"use client";

import React, { useEffect } from "react";
import { vapi } from "@/lib/vapi.sdk"; // ✅ correct Vapi import
import Agent from "@/components/Agent"; // ✅ your existing UI component

export default function InterviewStartPage() {
  useEffect(() => {
    // ✅ Start the call automatically when page loads
    vapi.start("1b237e72-ec44-4a3a-ad7c-22d589b0c5bf");

    // ✅ Stop the call when leaving the page
    return () => {
      try {
        vapi.stop();
      } catch (err) {
        console.warn("Vapi cleanup error:", err);
      }
    };
  }, []);

  // ✅ Keep your same UI
  return <Agent />;
}
