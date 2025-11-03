// /app/api/create-feedback/route.ts
import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { db } from "@/firebase/admin";
import { z } from "zod";

// ✅ Schema
const feedbackSchema = z.object({
  candidateName: z.string(),
  company: z.string(),
  role: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      candidateAnswer: z.string(),
      correctAnswer: z.string(),
      score: z.number().min(0).max(10),
    })
  ),
  averageScore: z.number().min(0).max(10),
});

export async function POST(req: Request) {
  try {
    const { company, role, candidateName, transcript } = await req.json();

    const formattedTranscript = transcript
      .map(
        (msg: { role: string; content: string }) =>
          `- ${msg.role}: ${msg.content}`
      )
      .join("\n");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", { structuredOutputs: false }),
      schema: feedbackSchema,
      prompt: `
You are an AI evaluator. You are given the transcript of an interview for the role of ${role} at ${company}.
Extract all questions asked by the interviewer and answers given by the candidate.
For each question:
- Identify the question
- Extract the candidate’s answer
- Write a short, correct/ideal answer
- Give a score from 0–10 based on accuracy, clarity, and completeness.

Then calculate the average of all question scores and return data in valid JSON according to the schema.

Transcript:
${formattedTranscript}
      `,
    });

    const reviewRef = db
      .collection("recruiter-interviews")
      .doc(company)
      .collection("reviews")
      .doc();

    await reviewRef.set({
      ...object,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, reviewId: reviewRef.id });
  } catch (error) {
    console.error("Error generating feedback:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
