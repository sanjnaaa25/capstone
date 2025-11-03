import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, structuredOutput } = body;

    if (!companyName || !structuredOutput) {
      return NextResponse.json(
        { error: "Missing companyName or structuredOutput" },
        { status: 400 }
      );
    }

    // Save inside nested recruiter_interviews/{company}/reviews/
    const reviewsRef = db
      .collection("recruiter_interviews")
      .doc(companyName)
      .collection("reviews");

    await reviewsRef.add({
      createdAt: new Date().toISOString(),
      structuredOutput,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 Error saving structured data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
