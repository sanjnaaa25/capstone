"use client";

import React, { useEffect } from "react";
import { vapi } from "@/lib/vapi.sdk"; // ✅ Your configured Vapi client
import Agent from "@/components/Agent"; // ✅ Your existing interview UI

export default function InterviewStartPage() {
  // 🧠 Your assistant ID (don’t change this)
  const ASSISTANT_ID = "a34a3792-b48d-4aef-91fa-445793d8b0b3";

  useEffect(() => {
    const startInterview = async () => {
      try {
        // ✅ Fetch interview data dynamically
        const res = await fetch(
          "http://localhost:3000/api/get-interview?company=sd"
        );
        const data = await res.json();

        // 🧩 Build dynamic interview context
        const interviewPrompt = `
You are a professional interviewer conducting a voice interview for the role of "${
          data.role
        }" at "${data.company}".
Ask the following questions one by one:
${data.questions.map((q: string) => `- ${q}`).join("\n")}
After each answer, give short constructive feedback and move to the next question.
End the interview by thanking the candidate politely.
`;

        // 🧠 Inject the prompt into the assistant's context
        await (vapi as any).addMessage({
          role: "system",
          content: interviewPrompt,
        });

        // 🎤 Start the voice interview with the specific assistant
        await vapi.start(ASSISTANT_ID);
      } catch (err) {
        console.error("❌ Error starting interview:", err);
      }
    };

    // 🟢 Start interview on page load
    startInterview();

    // 🔴 Stop the interview when leaving the page
    return () => {
      try {
        vapi.stop();
      } catch (err) {
        console.warn("⚠️ Vapi cleanup error:", err);
      }
    };
  }, [ASSISTANT_ID]);

  // 🎨 Keep your same UI
  return <Agent />;
}
