import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { db } from "@/firebase/admin";

async function getRecruiterInterviews() {
  const snapshot = await db.collection("recruiter_interviews").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function Home() {
  const user = await getCurrentUser();

  // ✅ Fetch user interviews + global available ones
  const [userInterviews, allInterview, recruiterInterviews] = await Promise.all(
    [
      getInterviewsByUserId(user?.id!),
      getLatestInterviews({ userId: user?.id! }),
      getRecruiterInterviews(),
    ]
  );

  const takenInterviewIds = new Set(userInterviews?.map((i) => i.id));
  const availableInterviews = allInterview?.filter(
    (i) => !takenInterviewIds.has(i.id)
  );

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = availableInterviews?.length! > 0;
  const hasRecruiterInterviews = recruiterInterviews?.length! > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview/start">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {/* ✅ Recruiter-created interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Recruiter Interviews</h2>

        <div className="interviews-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hasRecruiterInterviews ? (
            recruiterInterviews.map((interview: any) => (
              <div
                key={interview.id}
                className="p-4 border rounded-2xl shadow-sm bg-white flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-medium capitalize">
                    {interview.company}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Role: {interview.role || "Not specified"}
                  </p>
                </div>

                <Button
                  className="mt-4 bg-black text-white hover:bg-gray-800"
                  asChild
                >
                  <Link href={`/interview/${interview.id}`}>
                    Take Interview
                  </Link>
                </Button>
              </div>
            ))
          ) : (
            <p>No recruiter interviews available yet.</p>
          )}
        </div>
      </section>

      {/* ✅ Available AI-generated interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Available AI Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            availableInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
