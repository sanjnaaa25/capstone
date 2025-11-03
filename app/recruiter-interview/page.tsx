"use client";

import React, { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";

if (!getApps().length) {
  initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}
const db = getFirestore();

export default function RecruiterForm() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [status, setStatus] = useState("");
  const [interviewId, setInterviewId] = useState("");

  useEffect(() => setInterviewId(nanoid(8)), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving interview...");

    const questions = questionsText
      .split("\n")
      .map((q) => q.trim())
      .filter(Boolean);

    if (!company || !role || questions.length === 0) {
      setStatus("❌ Please fill all fields.");
      return;
    }

    try {
      await setDoc(doc(db, "recruiter_interviews", interviewId), {
        interviewId,
        company,
        role,
        questions,
        createdAt: new Date().toISOString(),
      });
      setStatus(
        `✅ Saved successfully! Check Firestore → recruiter_interviews → ${interviewId}`
      );
    } catch (err: any) {
      console.error(err);
      setStatus("Error: " + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white flex justify-center items-start py-12">
      <div className="bg-[#1A1A1D] border border-gray-800 rounded-2xl p-8 w-full max-w-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Create Company Interview
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Company Name
            </label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-[#0E0E10] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="e.g. Google"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#0E0E10] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Questions (one per line)
            </label>
            <textarea
              value={questionsText}
              onChange={(e) => setQuestionsText(e.target.value)}
              className="w-full bg-[#0E0E10] border border-gray-700 rounded-xl px-4 py-3 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder={
                "Enter each question on a new line\nExample:\nWhat is React?\nExplain useEffect hook.\n..."
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-all"
          >
            Save Interview
          </Button>

          {status && (
            <p
              className={`text-sm mt-3 ${
                status.startsWith("✅")
                  ? "text-green-400"
                  : status.startsWith("❌")
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
