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
    const body = (await req.json()) as HandoffPayload;

    // --------------------------
    // Validate required fields
    // --------------------------
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields: name and email" },
        { status: 400 }
      );
    }

    // --------------------------
    // ENV variables
    // --------------------------
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;
    const ghlApiKey = process.env.GHL_API_KEY;
    const ghlLocationId = process.env.GHL_LOCATION_ID;
    const transcriptField = process.env.GHL_CUSTOM_FIELD_TRANSCRIPT;

    if (!slackWebhook || !ghlApiKey || !ghlLocationId || !transcriptField) {
      console.error("Missing environment variables");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // --------------------------
    // Prepare Slack message
    // --------------------------
    const ticketId = Math.random().toString(36).substring(2, 10).toUpperCase();

    const handoffType =
      body.type === "progressive_profile"
        ? "🟣 Progressive Profile"
        : "🟢 Human Handoff";

    const slackText = `
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

    // --------------------------
    // GHL Contact Payload
    // --------------------------
    const ghlPayload = {
      locationId: ghlLocationId,
      firstName: body.name, // Option B → store full name in firstName
      lastName: "",
      email: body.email,
      phone: body.phone || "",
      companyName: body.company || "",
      tags: [
        body.type === "progressive_profile"
          ? "tp-progressive-profile"
          : "tp-human-handoff",
      ],
      customField: [
        {
          id: transcriptField,
          value: body.transcript || "",
        },
      ],
    };

    // --------------------------
    // Fire Slack + GHL together
    // --------------------------
    const slackRequest = fetch(slackWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: slackText }),
    });

    const ghlRequest = fetch("https://rest.gohighlevel.com/v1/contacts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ghlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ghlPayload),
    });

    const [slackRes, ghlRes] = await Promise.all([slackRequest, ghlRequest]);

    // Slack errors
    if (!slackRes.ok) {
      console.error("Slack error:", await slackRes.text());
    }

    // GHL errors
    if (!ghlRes.ok) {
      console.error("GHL error:", await ghlRes.text());
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

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
