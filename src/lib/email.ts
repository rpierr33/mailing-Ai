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
      html: params.html,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
