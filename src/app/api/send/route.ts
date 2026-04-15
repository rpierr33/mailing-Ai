import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getCampaign, updateCampaign, getContacts } from "@/lib/db";
import { sendCampaignSchema } from "@/lib/validations";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(request: NextRequest) {
  const { user, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const parsed = sendCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const campaign = await getCampaign(parsed.data.campaignId);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    if (campaign.userId !== user.id) {
      // Don't leak existence of other users' campaigns.
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // If test email, send only to that address
    if (parsed.data.testEmail) {
      const result = await sendEmail({
        to: [parsed.data.testEmail],
        subject: `[TEST] ${campaign.subject}`,
        html: campaign.body ?? `<h1>${campaign.subject}</h1>`,
        from: campaign.fromEmail
          ? `${campaign.fromName ?? "MailFlow"} <${campaign.fromEmail}>`
          : undefined,
      });

      return NextResponse.json({ result, test: true });
    }

    // Full send — scope to the caller's contacts only.
    const contacts = await getContacts(user.id);
    const recipients = contacts.map((c) => c.email);

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No contacts to send to. Add a contact first." },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to: recipients,
      subject: campaign.subject,
      html: campaign.body ?? `<h1>${campaign.subject}</h1>`,
      from: campaign.fromEmail
        ? `${campaign.fromName ?? "MailFlow"} <${campaign.fromEmail}>`
        : undefined,
    });

    if (result.success) {
      await updateCampaign(campaign.id, {
        status: "Sent",
        sentAt: new Date().toISOString(),
        recipients: recipients.length,
      });
    }

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Failed to send campaign" }, { status: 500 });
  }
}
