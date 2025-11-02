import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company");

  if (!company) {
    return addCORSHeaders(
      NextResponse.json({ error: "Company name is required" }, { status: 400 })
    );
  }

  try {
    const res = await fetch(
      `https://capstone-b73y.vercel.app/api/get-interview?company=${company}`
    );
    const data = await res.json();

    const { id, role, company: comp, questions } = data;

    return addCORSHeaders(
      NextResponse.json({
        success: true,
        id,
        role,
        company: comp,
        questions,
      })
    );
  } catch (err) {
    return addCORSHeaders(
      NextResponse.json(
        { error: "Failed to fetch interview data" },
        { status: 500 }
      )
    );
  }
}

// ✅ Add this helper to handle CORS
function addCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

// ✅ Handle preflight OPTIONS request
export async function OPTIONS() {
  return addCORSHeaders(NextResponse.json({}, { status: 200 }));
}
