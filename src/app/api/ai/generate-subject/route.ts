import { NextRequest, NextResponse } from "next/server";
import { generateSubjectLines } from "@/lib/ai";
import { aiSubjectSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(request: NextRequest) {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { allowed, remaining } = checkRateLimit(`ai-subject-${user.id}`, 15, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      {
        status: 429,
        headers: { "X-RateLimit-Remaining": remaining.toString() },
      }
    );
  }

  try {
    const body = await request.json();
    const parsed = aiSubjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const subjects = await generateSubjectLines(parsed.data.topic);

    return NextResponse.json(
      { subjects },
      { headers: { "X-RateLimit-Remaining": remaining.toString() } }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to generate subject lines" },
      { status: 500 }
    );
  }
}
