import Anthropic from "@anthropic-ai/sdk";

const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    });
  }
  return client;
}

export async function generateEmailContent(
  prompt: string,
  tone: string = "professional"
): Promise<{ subject: string; previewText: string; body: string }> {
  if (!hasApiKey) {
    return simulateEmailGeneration(prompt, tone);
  }

  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are an expert email copywriter. Generate a marketing email based on this brief: "${prompt}"

Tone: ${tone}

Respond with ONLY a JSON object (no markdown, no code blocks) with these exact keys:
- "subject": A compelling subject line (under 60 characters)
- "previewText": Preview text for email clients (under 90 characters)
- "body": The full email body in HTML format with inline styles. Use clean, modern formatting. Include a greeting, main content, CTA button, and sign-off.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateSubjectLines(topic: string): Promise<string[]> {
  if (!hasApiKey) {
    return simulateSubjectLines(topic);
  }

  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Generate 5 compelling email subject lines about "${topic}". Respond with ONLY a JSON array of strings, nothing else.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function improveEmailCopy(
  existingCopy: string,
  instruction: string
): Promise<string> {
  if (!hasApiKey) {
    return `${existingCopy}\n\n[Improved version would appear here with AI - configure your Anthropic API key in Settings]`;
  }

  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Improve this email copy based on the instruction: "${instruction}"

Original copy:
${existingCopy}

Return ONLY the improved copy, no explanation.`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : existingCopy;
}

// ─── Demo mode simulations ───

function simulateEmailGeneration(
  prompt: string,
  tone: string
): Promise<{ subject: string; previewText: string; body: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const toneStyles: Record<string, { greeting: string; closing: string }> = {
        professional: { greeting: "Dear valued subscriber", closing: "Best regards" },
        casual: { greeting: "Hey there", closing: "Cheers" },
        playful: { greeting: "What's up!", closing: "Catch you later" },
        urgent: { greeting: "IMPORTANT", closing: "Act now" },
      };
      const style = toneStyles[tone] ?? toneStyles.professional;

      resolve({
        subject: `${prompt.slice(0, 50)}${prompt.length > 50 ? "..." : ""}`,
        previewText: `Don't miss out on ${prompt.toLowerCase().slice(0, 60)}`,
        body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 16px;">${style.greeting},</h1>
  <p style="color: #4a4a5a; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
    We're excited to share something special with you. ${prompt}. This is your chance to be part of something amazing.
  </p>
  <p style="color: #4a4a5a; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
    Our team has been working hard to bring you the best experience possible. We believe this will make a real difference in how you connect with your audience.
  </p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="#" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Learn More</a>
  </div>
  <p style="color: #6a6a7a; font-size: 14px; margin-top: 32px;">${style.closing},<br/>The MailFlow Team</p>
</div>`,
      });
    }, 1500);
  });
}

function simulateSubjectLines(topic: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        `${topic} - You won't want to miss this`,
        `Something special: ${topic}`,
        `Your exclusive ${topic.toLowerCase()} update is here`,
        `Big news about ${topic.toLowerCase()}`,
        `${topic} - Limited time opportunity`,
      ]);
    }, 1000);
  });
}
