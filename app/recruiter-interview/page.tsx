"use client";

import React, { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

// ✅ Initialize Firebase only once
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
    <div className="min-h-screen bg-gray-50 flex justify-center p-8">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">
          Recruiter — Create Interview
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Company Name</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Accenture"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Data Analyst Intern"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Questions (one per line)
            </label>
            <textarea
              value={questionsText}
              onChange={(e) => setQuestionsText(e.target.value)}
              className="w-full border rounded p-3 min-h-[160px]"
              placeholder={
                "Enter each question on a new line\nExample:\nWhat is Python?\nExplain regression analysis.\n..."
              }
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Interview
          </button>

          <p className="text-sm mt-2 text-gray-700">{status}</p>
        </form>
      </div>
    </div>
  );
}
