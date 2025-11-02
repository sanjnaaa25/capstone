// /app/api/start-interview/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company");

  if (!company) {
    return NextResponse.json(
      { error: "Company name is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://capstone-b73y.vercel.app/api/get-interview?company=${company}`
    );

    const data = await res.json();

    // Extract the variables
    const { id, role, company: comp, questions } = data;

    // Send to Vapi or handle locally
    return NextResponse.json({
      success: true,
      id,
      role,
      company: comp,
      questions,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch interview data" },
      { status: 500 }
    );
  }
}
