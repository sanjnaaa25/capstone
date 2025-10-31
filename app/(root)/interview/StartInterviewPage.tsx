"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { createInterview } from "@/lib/actions/interview.action";
import Agent from "@/components/Agent";

export default function StartInterviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState("frontend");
  const [level, setLevel] = useState("junior");
  const [techstack, setTechstack] = useState<string[]>(["React"]);
  const [type, setType] = useState("mixed");
  const [numQuestions, setNumQuestions] = useState(5);

  useEffect(() => {
    const initUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    initUser();
  }, []);

  const startInterview = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const interview = await createInterview({
        userId: user.id,
        role,
        type,
        techstack,
        level,
      });

      setInterviewId(interview.id);
    } catch (err) {
      console.error("Failed to start interview:", err);
      alert("Failed to generate interview.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Please login to start an interview.</p>;

  if (!interviewId)
    return (
      <div className="flex flex-col gap-4">
        <h2>Start a Dynamic AI Interview</h2>

        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Full Stack Developer</option>
          </select>
        </div>

        <div>
          <label>Experience Level:</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="junior">Junior</option>
            <option value="mid">Mid-Level</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <div>
          <label>Tech Stack (comma separated):</label>
          <input
            type="text"
            value={techstack.join(",")}
            onChange={(e) => setTechstack(e.target.value.split(","))}
          />
        </div>

        <div>
          <label>Interview Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="technical">Technical</option>
            <option value="behavioral">Behavioral</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label>Number of Questions:</label>
          <input
            type="number"
            min={1}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          />
        </div>

        <button onClick={startInterview} className="btn-primary">
          {loading ? "Generating..." : "Start Interview"}
        </button>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-semibold">Interview in Progress</h3>

      {loading && <p>Generating dynamic questions...</p>}

      {interviewId && !loading && (
        <Agent
          userName={user.name!}
          userId={user.id}
          interviewId={interviewId}
          role={role}
          level={level}
          techstack={techstack}
          interviewType={type}
          numQuestions={numQuestions}
        />
      )}
    </div>
  );
}
