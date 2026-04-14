import { Resend } from "resend";

const hasResendKey = !!process.env.RESEND_API_KEY;

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY ?? "");
  }
  return resend;
}

interface SendEmailParams {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  mock?: boolean;
}

export async function sendEmail(params: SendEmailParams): Promise<SendResult> {
  // Inject unsubscribe footer for CAN-SPAM compliance
  const unsubFooter = `<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#9ca3af;">
    <p>You're receiving this because you subscribed to updates.</p>
    <p><a href="#" style="color:#6366f1;">Unsubscribe</a> | <a href="#" style="color:#6366f1;">Manage Preferences</a></p>
    <p style="margin-top:8px;">MailFlow AI &mdash; AI-Powered Email Marketing</p>
  </div>`;
  const htmlWithFooter = params.html + unsubFooter;

  if (!hasResendKey) {
    // Mock mode
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      mock: true,
    };
  }

  try {
    const r = getResend();
    const result = await r.emails.send({
      from: params.from ?? "MailFlow <noreply@mailflow.ai>",
      to: params.to,
      subject: params.subject,
      html: htmlWithFooter,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
