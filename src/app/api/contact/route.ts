// ---------------------------------------------------------------------------
// POST /api/contact — Handle contact form submissions
// ---------------------------------------------------------------------------
// Rate limited, sanitized, honeypot-checked. Sends email via Resend
// or falls back to console.log if RESEND_API_KEY is not set.
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeField, isValidEmail } from "@/lib/sanitize";
import storeConfig from "@/config/store";

export async function POST(request: NextRequest) {
  // ── Rate limiting ───────────────────────────────────────────────────
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const { allowed, retryAfterSeconds } = rateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: `Too many requests. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
      },
      { status: 429 }
    );
  }

  // ── Parse body ──────────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  const { name, email, phone, reason, message, website } = body;

  // ── Honeypot check — bots fill this hidden field ────────────────────
  if (website) {
    // Silently accept to not tip off bots, but don't send email
    return NextResponse.json({ success: true });
  }

  // ── Sanitize inputs ─────────────────────────────────────────────────
  const cleanName = sanitizeField(String(name || ""), 200);
  const cleanEmail = sanitizeField(String(email || ""), 320);
  const cleanPhone = sanitizeField(String(phone || ""), 20);
  const cleanReason = sanitizeField(String(reason || ""), 100);
  const cleanMessage = sanitizeField(String(message || ""), 2000);

  // ── Validate ────────────────────────────────────────────────────────
  if (!cleanName) {
    return NextResponse.json(
      { error: "Please enter your name." },
      { status: 422 }
    );
  }

  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  if (!cleanReason) {
    return NextResponse.json(
      { error: "Please select a reason for contacting us." },
      { status: 422 }
    );
  }

  if (!cleanMessage || cleanMessage.length < 10) {
    return NextResponse.json(
      { error: "Please write a message with at least 10 characters." },
      { status: 422 }
    );
  }

  // ── Send email ──────────────────────────────────────────────────────
  const recipientEmail =
    process.env.CONTACT_EMAIL || storeConfig.email;
  const apiKey = process.env.RESEND_API_KEY;

  const emailHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${cleanName}</p>
    <p><strong>Email:</strong> ${cleanEmail}</p>
    ${cleanPhone ? `<p><strong>Phone:</strong> ${cleanPhone}</p>` : ""}
    <p><strong>Reason:</strong> ${cleanReason}</p>
    <hr/>
    <p><strong>Message:</strong></p>
    <p>${cleanMessage.replace(/\n/g, "<br/>")}</p>
  `;

  if (!apiKey) {
    // Fallback: log to console
    console.log("══════════════════════════════════════════════════");
    console.log("CONTACT FORM (Resend not configured — logging)");
    console.log(`  From:    ${cleanName} <${cleanEmail}>`);
    console.log(`  Phone:   ${cleanPhone || "N/A"}`);
    console.log(`  Reason:  ${cleanReason}`);
    console.log(`  Message: ${cleanMessage}`);
    console.log("══════════════════════════════════════════════════");
    return NextResponse.json({ success: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: `${storeConfig.name} Contact <onboarding@resend.dev>`,
      to: recipientEmail,
      replyTo: cleanEmail,
      subject: `[${cleanReason}] Message from ${cleanName}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return NextResponse.json(
      { error: "Failed to send your message. Please try again later." },
      { status: 500 }
    );
  }
}
