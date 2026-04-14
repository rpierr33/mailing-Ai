import { NextRequest, NextResponse } from "next/server";
import { getCampaigns, addCampaign, deleteCampaign, updateCampaign, getContacts } from "@/lib/db";
import { campaignCreateSchema } from "@/lib/validations";
import { requireAuth, pickAllowed } from "@/lib/auth-guard";
import type { Campaign } from "@/types";

// Fields a client may legally PATCH on a campaign. Anything not in this
// list is silently dropped (see CLAUDE.md §Workarounds — mass-assignment).
const CAMPAIGN_PATCH_FIELDS = [
  "name",
  "subject",
  "previewText",
  "body",
  "type",
  "status",
  "audience",
  "fromName",
  "fromEmail",
  "scheduledAt",
] as const;

export async function GET() {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const campaigns = getCampaigns().filter((c) => c.userId === user.id);
  return NextResponse.json({ campaigns });
}

export async function POST(request: NextRequest) {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const parsed = campaignCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const status = data.scheduleType === "schedule" ? "Scheduled" : "Sent";
    // Real recipient count pulled from this user's contacts instead of
    // the prior Math.random() placeholder.
    const recipients = getContacts().filter((c) => c.userId === user.id).length;

    const campaign = addCampaign({
      name: data.name,
      subject: data.subject,
      previewText: data.previewText ?? null,
      body: data.body ?? null,
      type: data.type,
      status,
      audience: data.audience ?? null,
      recipients,
      openRate: 0,
      clickRate: 0,
      fromName: data.fromName ?? null,
      fromEmail: data.fromEmail ?? null,
      scheduledAt: data.scheduleDate
        ? new Date(`${data.scheduleDate}T${data.scheduleTime || "09:00"}`).toISOString()
        : null,
      sentAt: status === "Sent" ? new Date().toISOString() : null,
      userId: user.id,
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Verify the caller owns this campaign before deleting.
  const campaigns = getCampaigns();
  const target = campaigns.find((c) => c.id === id);
  if (!target || target.userId !== user.id) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const deleted = deleteCampaign(id);
  if (!deleted) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const campaigns = getCampaigns();
    const target = campaigns.find((c) => c.id === id);
    if (!target || target.userId !== user.id) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const body = await request.json();
    const patch = pickAllowed(body, CAMPAIGN_PATCH_FIELDS) as Partial<Campaign>;
    const campaign = updateCampaign(id, patch);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ campaign });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
