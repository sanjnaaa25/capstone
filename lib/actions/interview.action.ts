"use server";

import { db } from "@/firebase/admin";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema, interviewer } from "@/constants";

// --- Types ---
interface CreateInterviewParams {
  userId: string;
  role: string;
  type: string; // "mock" or "real"
  techstack: string[];
  questions?: string[];
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: "user" | "assistant"; content: string }[];
  feedbackId?: string;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

// --- Interview Actions ---

export async function createInterview(params: CreateInterviewParams) {
  const { userId, role, type, techstack, questions = [] } = params;

  try {
    const interviewRef = db.collection("interviews").doc();

    await interviewRef.set({
      userId,
      role,
      type,
      techstack,
      questions,
      createdAt: new Date().toISOString(),
      finalized: true,
    });

    return { id: interviewRef.id };
  } catch (error) {
    console.error("Error creating interview:", error);
    throw new Error("Failed to create interview");
  }
}

export async function getInterviewById(id: string) {
  const doc = await db.collection("interviews").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function getInterviewsByUserId(userId: string) {
  const snapshot = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getLatestInterviews(params: GetLatestInterviewsParams) {
  const { userId, limit = 20 } = params;
  const snapshot = await db
    .collection("interviews")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// --- Feedback Actions ---

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map((msg) => `- ${msg.role}: ${msg.content}`)
      .join("\n");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", { structuredOutputs: false }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate.
        Transcript:
        ${formattedTranscript}

        Score the candidate 0-100 in:
        - Communication Skills
        - Technical Knowledge
        - Problem-Solving
        - Cultural & Role Fit
        - Confidence & Clarity
      `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId,
      userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    const feedbackRef = feedbackId
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (err) {
    console.error("Error generating feedback:", err);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
) {
  const { interviewId, userId } = params;
  const snapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}
