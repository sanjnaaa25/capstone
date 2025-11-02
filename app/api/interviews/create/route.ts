export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const interviewsDataPath = path.join(process.cwd(), "data", "interviews.json");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      assistantId = "a34a3792-b48d-4aef-91fa-445793d8b0b3",
      customPrompt,
      interviewConfig,
      interviewId = uuidv4(),
      createdAt = new Date().toISOString(),
    } = body;

    if (
      !interviewConfig ||
      !interviewConfig.role ||
      !interviewConfig.questions ||
      interviewConfig.questions.length === 0
    ) {
      return NextResponse.json(
        { error: "Role and at least one question are required" },
        { status: 400 }
      );
    }

    const shareableLink = `https://vapi.ai/interview/${interviewId}?assistant=${assistantId}`;

    const interviewRecord = {
      id: interviewId,
      assistantId,
      role: interviewConfig.role,
      level: interviewConfig.level || "Junior",
      companyName: interviewConfig.companyName || "Tech Company",
      techStack: interviewConfig.techStack || [],
      questions: interviewConfig.questions,
      systemPrompt: customPrompt,
      shareableLink,
      status: "active",
      createdAt,
      updatedAt: createdAt,
      feedbackCollected: false,
      candidateCount: 0,
    };

    // Read existing file (or blank)
    let allInterviews = [];
    if (fs.existsSync(interviewsDataPath)) {
      const content = fs.readFileSync(interviewsDataPath, "utf8");
      allInterviews = JSON.parse(content || "[]");
    }

    allInterviews.push(interviewRecord);
    fs.writeFileSync(
      interviewsDataPath,
      JSON.stringify(allInterviews, null, 2)
    );

    return NextResponse.json({
      success: true,
      interviewId,
      shareableLink,
      role: interviewConfig.role,
      questions: interviewConfig.questions.length,
      assistantId,
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      {
        error: "Failed to create interview",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
