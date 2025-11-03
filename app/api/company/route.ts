import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function GET() {
  try {
    const snapshot = await db.collection("recruiter_interviews").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching recruiter interviews:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message });
  }
}
