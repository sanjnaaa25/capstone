"use client";

import React, { useEffect } from "react";
import { vapi } from "@/lib/vapi.sdk";
import Agent from "@/components/Agent";

export default function VoiceInterviewPage() {
  useEffect(() => {
    // ✅ Start the interview call automatically
    vapi.start("a34a3792-b48d-4aef-91fa-445793d8b0b3");

    // ✅ Graceful cleanup when leaving the page
    return () => {
      try {
        vapi.stop();
      } catch (err) {
        console.warn("Vapi cleanup error:", err);
      }
    };
  }, []);

  // ✅ Keep your same Agent UI
  return <Agent />;
}
