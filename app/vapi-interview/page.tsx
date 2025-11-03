"use client";

import React, { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import Agent from "@/components/Agent";
import { Button } from "@/components/ui/button";

export default function VoiceInterviewPage() {
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  const handleStart = async () => {
    try {
      await vapi.start("a34a3792-b48d-4aef-91fa-445793d8b0b3");
      setIsInterviewActive(true);
    } catch (err) {
      console.error("Error starting interview:", err);
    }
  };

  const handleStop = async () => {
    try {
      await vapi.stop();
      setIsInterviewActive(false);
    } catch (err) {
      console.error("Error stopping interview:", err);
    }
  };

  useEffect(() => {
    // Cleanup on page leave
    return () => {
      try {
        vapi.stop();
      } catch (err) {
        console.warn("Vapi cleanup error:", err);
      }
    };
  }, []);

  return (
    <section className="min-h-screen bg-[#0E0E10] text-white flex flex-col items-center justify-center px-8 py-12">
      {/* Header */}
      <div className="absolute top-6 left-8 flex items-center gap-2">
        <span className="text-[#d2c6ff] text-2xl font-semibold">
          💬 PrepWise
        </span>
      </div>

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">AI Voice Interview</h1>
      </div>

      {/* Agent Card */}
      <div className="w-full max-w-6xl bg-[#18181B] border border-gray-800 rounded-2xl shadow-xl p-10 flex flex-col items-center justify-center gap-8">
        {/* ✅ Control Buttons moved ABOVE Agent */}
        {!isInterviewActive ? (
          <Button
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            🎤 Start Interview
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            ⏹ End Interview
          </Button>
        )}

        {/* Agent stays below button */}
        <Agent />
      </div>
    </section>
  );
}
