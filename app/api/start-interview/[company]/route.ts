import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// ✅ Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

// ✅ Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ Handle OPTIONS preflight request
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// ✅ Handle GET /api/start-interview/[company]
export async function GET(
  req: Request,
  { params }: { params: { company: string } }
) {
  const company = params.company;

  if (!company) {
    return new Response(JSON.stringify({ error: "Missing company name" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    const snapshot = await db
      .collection("recruiter_interviews")
      .where("company", "==", company)
      .get();

    if (snapshot.empty) {
      return new Response(
        JSON.stringify({ error: "No interview found for this company" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    const responseData = {
      id: doc.id,
      company: data.company || company,
      role: data.role || "Not specified",
      questions: Array.isArray(data.questions)
        ? data.questions
        : ["No questions found"],
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error fetching interview:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
