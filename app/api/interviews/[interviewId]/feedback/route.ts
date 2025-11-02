export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const feedbackDataPath = path.join(process.cwd(), "data", "feedback.json");
const interviewsDataPath = path.join(process.cwd(), "data", "interviews.json");

interface SimpleFeedback {
  id: string;
  interviewId: string;
  candidateName?: string;
  totalScore: number;
  communication: number;
  technical: number;
  problemSolving: number;
  confidence: number;
  overallAssessment: string;
  strengths: string[];
  improvements: string[];
  interviewDate: string;
  transcript?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interviewId, transcript, candidateName } = body;

    if (!interviewId || !transcript) {
      return NextResponse.json(
        { error: "interviewId and transcript are required" },
        { status: 400 }
      );
    }

    const generateSimpleFeedback = (
      transcript: string,
      candidateName?: string
    ) => {
      const text = transcript || "";
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const hasTechnicalTerms =
        /react|javascript|html|css|node|typescript/i.test(text);

      const baseScore = Math.min(90, 50 + Math.round(wordCount / 10));
      const technicalScore = hasTechnicalTerms
        ? Math.min(100, baseScore + 10)
        : Math.max(0, baseScore - 10);

      return {
        id: uuidv4(),
        interviewId,
        candidateName: candidateName || "Anonymous Candidate",
        totalScore: Math.round((baseScore + technicalScore) / 2),
        communication: Math.round(baseScore + (wordCount > 100 ? 10 : 0)),
        technical: Math.round(technicalScore),
        problemSolving: Math.round(
          baseScore + (/solution|approach|algorithm/i.test(text) ? 10 : 0)
        ),
        confidence: Math.round(baseScore + (wordCount > 50 ? 5 : -5)),
        overallAssessment:
          wordCount > 80
            ? "Good understanding of basics; shows potential."
            : "Needs to elaborate more on technical concepts.",
        strengths: [
          "Clear communication",
          "Good enthusiasm",
          "Basic technical understanding",
        ],
        improvements: [
          "Provide more specific examples",
          "Elaborate on technical concepts",
          "Structure answers better",
        ],
        interviewDate: new Date().toISOString(),
        transcript:
          typeof transcript === "string"
            ? transcript
            : JSON.stringify(transcript),
      } as SimpleFeedback;
    };

    const feedback = generateSimpleFeedback(transcript, candidateName);

    // Read and write feedback file
    let allFeedback: SimpleFeedback[] = [];
    if (fs.existsSync(feedbackDataPath)) {
      allFeedback = JSON.parse(
        fs.readFileSync(feedbackDataPath, "utf8") || "[]"
      );
    }
    allFeedback.push(feedback);
    fs.writeFileSync(feedbackDataPath, JSON.stringify(allFeedback, null, 2));

    // Update interview candidateCount
    if (fs.existsSync(interviewsDataPath)) {
      const interviews = JSON.parse(
        fs.readFileSync(interviewsDataPath, "utf8") || "[]"
      );
      const updated = interviews.map((iv: any) =>
        iv.id === interviewId
          ? {
              ...iv,
              candidateCount: (iv.candidateCount || 0) + 1,
              feedbackCollected: true,
            }
          : iv
      );
      fs.writeFileSync(interviewsDataPath, JSON.stringify(updated, null, 2));
    }

    return NextResponse.json({
      success: true,
      feedbackId: feedback.id,
      totalScore: feedback.totalScore,
      candidateName: feedback.candidateName,
    });
  } catch (error) {
    console.error("Error generating feedback:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}

// GET handler to return feedback for a given interviewId
export async function GET(
  request: NextRequest,
  { params }: { params: { interviewId: string } }
) {
  try {
    const { interviewId } = params;
    let allFeedback: SimpleFeedback[] = [];
    if (fs.existsSync(feedbackDataPath)) {
      allFeedback = JSON.parse(
        fs.readFileSync(feedbackDataPath, "utf8") || "[]"
      );
    }
    const interviewFeedback = allFeedback.filter(
      (fb) => fb.interviewId === interviewId
    );
    const totalCandidates = interviewFeedback.length;
    const averageScore =
      totalCandidates > 0
        ? Math.round(
            interviewFeedback.reduce((s, f) => s + f.totalScore, 0) /
              totalCandidates
          )
        : 0;

    return NextResponse.json({
      success: true,
      interviewId,
      feedbacks: interviewFeedback,
      totalCandidates,
      averageScore,
      hasFeedback: interviewFeedback.length > 0,
    });
  } catch (error) {
    console.error("Error getting feedback:", error);
    return NextResponse.json(
      { error: "Failed to get feedback" },
      { status: 500 }
    );
  }
}
