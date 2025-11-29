import { NextResponse } from "next/server";

export const runtime = "edge";

type HandoffPayload = {
  type: "progressive_profile" | "human_handoff";
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  transcript?: string | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<HandoffPayload>;

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("Missing SLACK_WEBHOOK_URL env variable");
      return NextResponse.json(
        { error: "Missing SLACK_WEBHOOK_URL env variable" },
        { status: 500 }
      );
    }

    // Basic validation – only name and email are required
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields: name and email" },
        { status: 400 }
      );
    }

    const ticketId = Math.random().toString(36).substring(2, 10).toUpperCase();

    const handoffType =
      body.type === "progressive_profile"
        ? "🟣 Progressive Profile"
        : "🟢 Human Handoff";

    const text = `
${handoffType}  (#${ticketId})

*Name:* ${body.name}
*Email:* ${body.email}
*Phone:* ${body.phone || "N/A"}
*Company:* ${body.company || "N/A"}

*Message:*
${body.message || "_No message provided_"}

*Transcript (context):*
${body.transcript || "_No transcript provided_"}
`.trim();

    // Send to Slack via Incoming Webhook
    const slackRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!slackRes.ok) {
      const errorText = await slackRes.text().catch(() => "");
      console.error("Slack webhook error", slackRes.status, errorText);
      return NextResponse.json(
        { error: "Failed to send message to Slack" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error in /api/handoff:", err);
    return NextResponse.json(
      { error: "Failed to process handoff" },
      { status: 500 }
    );
  }
}

// Optional: return 405 for non-POSTs
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
