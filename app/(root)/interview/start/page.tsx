"use client";

import { useState, useEffect } from "react";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { createInterview } from "@/lib/actions/interview.action";

export default function StartInterviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState("frontend");
  const [level, setLevel] = useState("junior");
  const [techstack, setTechstack] = useState<string[]>(["React"]);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const startDynamicInterview = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Create a new dynamic interview in Firestore
      const interview = await createInterview({
        userId: user.id,
        role,
        level,
        type: "dynamic",
        techstack,
      });

      setInterviewId(interview.id);
    } catch (err) {
      console.error(err);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Please login to start an interview.</p>;

  if (!interviewId)
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">Start Your Dynamic Interview</h3>

        {/* Role selection */}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="frontend">Frontend Developer</option>
          <option value="fullstack">Full Stack Developer</option>
          <option value="backend">Backend Developer</option>
        </select>

        {/* Level selection */}
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>

        {/* Techstack input */}
        <input
          type="text"
          value={techstack.join(",")}
          onChange={(e) => setTechstack(e.target.value.split(","))}
          placeholder="Enter tech stack, e.g., React, Next.js"
        />

        <button className="btn-primary" onClick={startDynamicInterview}>
          Start Interview
        </button>
      </div>
    );

  // Load Agent for AI-driven conversation
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Interview in Progress</h3>
      <Agent
        userName={user.name!}
        userId={user.id}
        interviewId={interviewId}
        type="generate" // this tells Agent to generate AI questions dynamically
      />
    </div>
  );
}
