import { NextRequest, NextResponse } from "next/server";
import { generateEmailContent } from "@/lib/ai";
import { aiGenerateSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(request: NextRequest) {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  // Rate limit per-user (was per-IP which collapsed behind shared NAT).
  const { allowed, remaining } = checkRateLimit(`ai-email-${user.id}`, 10, 60_000);

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
    const parsed = aiGenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = await generateEmailContent(parsed.data.prompt, parsed.data.tone);

    return NextResponse.json(
      { email },
      { headers: { "X-RateLimit-Remaining": remaining.toString() } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate email" },
      { status: 500 }
    );
  }
}
