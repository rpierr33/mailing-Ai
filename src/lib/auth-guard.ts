import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Guard helper for API routes. Returns the authenticated user + a
 * pre-built 401 response when unauthenticated. Usage:
 *
 *   const { user, unauthorized } = await requireAuth();
 *   if (unauthorized) return unauthorized;
 *
 * Mirrors the pattern used in the sibling quickbooks-ai and
 * ben-real-estate projects so behavior is consistent.
 */
export interface AuthedUser {
  id: string;
  name: string;
  email: string;
}

type RequireAuthResult =
  | { user: AuthedUser; unauthorized: null }
  | { user: null; unauthorized: NextResponse };

export async function requireAuth(): Promise<RequireAuthResult> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!session?.user || !id) {
    return {
      user: null,
      unauthorized: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }
  return {
    user: {
      id,
      name: session.user.name ?? "",
      email: session.user.email ?? "",
    },
    unauthorized: null,
  };
}

/**
 * Pick only allowed keys from an incoming body. Anything not in
 * `allowed` is silently dropped. Prevents mass-assignment on PATCH
 * endpoints.
 */
export function pickAllowed<T extends string>(
  body: unknown,
  allowed: readonly T[]
): Partial<Record<T, unknown>> {
  if (!body || typeof body !== "object") return {};
  const record = body as Record<string, unknown>;
  const out: Partial<Record<T, unknown>> = {};
  for (const key of allowed) {
    if (key in record) {
      out[key] = record[key];
    }
  }
  return out;
}
