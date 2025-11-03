"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompanyInterviewsPage() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/company");
      const json = await res.json();
      if (json.success) setInterviews(json.data);
    };
    fetchData();
  }, []);

  return (
    <section className="flex flex-col gap-6 mt-8">
      <h2 className="text-3xl font-bold">Company Interviews</h2>

      <Button asChild className="btn-primary mt-6 w-40">
        <Link href="/recruiter-interview">Create Interview</Link>
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {interviews.length > 0 ? (
          interviews.map((item: any) => (
            <div
              key={item.id}
              className="bg-[#0E0E10] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-between shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              <Image
                src={item.logo || "/profile.svg"} // 👈 updated default logo
                alt={`${item.company} logo`}
                width={80}
                height={80}
                className="rounded-full object-cover mb-4"
              />

              <div className="text-center">
                <h3 className="text-lg font-semibold capitalize text-white">
                  {item.company}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{item.role}</p>
              </div>

              <Button asChild className="btn-primary mt-6 w-full">
                <Link href="/vapi-interview">Take Interview</Link>
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No company interviews available</p>
        )}
      </div>
    </section>
  );
}
