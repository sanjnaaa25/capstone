export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const interviewsDataPath = path.join(process.cwd(), "data", "interviews.json");

export async function GET() {
  try {
    let allInterviews: any[] = [];
    if (fs.existsSync(interviewsDataPath)) {
      allInterviews = JSON.parse(
        fs.readFileSync(interviewsDataPath, "utf8") || "[]"
      );
    }

    return NextResponse.json({
      success: true,
      interviews: allInterviews.map((i) => ({
        id: i.id,
        role: i.role,
        level: i.level,
        companyName: i.companyName,
        questions: i.questions.length,
        candidateCount: i.candidateCount || 0,
        createdAt: i.createdAt,
        shareableLink: i.shareableLink,
      })),
      total: allInterviews.length,
    });
  } catch (error) {
    console.error("Error getting interviews:", error);
    return NextResponse.json(
      { error: "Failed to get interviews" },
      { status: 500 }
    );
  }
}
