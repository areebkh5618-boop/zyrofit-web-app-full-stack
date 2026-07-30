import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

const OWNER_EMAIL = "areebkh5618@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await connectDB();
    await Message.create({ name, email, subject, message });

    // Forward to your Gmail via FormSubmit (no API key needed)
    try {
      await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          _subject: `[ZyroFit Contact] ${subject}`,
          message: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
          _replyto: email,
        }),
      });
    } catch (mailErr) {
      console.error("[contact email forward]", mailErr);
      // still ok — message saved in DB
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
