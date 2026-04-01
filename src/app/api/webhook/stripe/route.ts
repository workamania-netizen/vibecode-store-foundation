// ---------------------------------------------------------------------------
// POST /api/webhook/stripe — Handle Stripe webhook events
// ---------------------------------------------------------------------------
// Verifies the webhook signature, then processes checkout.session.completed
// events by sending confirmation and notification emails via Resend.
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import storeConfig from "@/config/store";

// Disable body parsing — Stripe needs the raw body for signature verification
export const runtime = "nodejs";

async function sendEmails(session: {
  customer_details?: { email?: string | null; name?: string | null } | null;
  amount_total?: number | null;
  id: string;
}) {
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name || "Customer";
  const total = session.amount_total
    ? `$${(session.amount_total / 100).toFixed(2)}`
    : "N/A";

  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail =
    process.env.NOTIFICATION_EMAIL || storeConfig.email;

  // ── Fallback: log to console if no Resend API key ───────────────
  if (!apiKey) {
    console.log("══════════════════════════════════════════════════");
    console.log("ORDER RECEIVED (Resend not configured — logging)");
    console.log(`  Session ID: ${session.id}`);
    console.log(`  Customer:   ${customerName} <${customerEmail}>`);
    console.log(`  Total:      ${total}`);
    console.log("══════════════════════════════════════════════════");
    return;
  }

  // ── Send via Resend ─────────────────────────────────────────────
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  // Customer confirmation email
  if (customerEmail) {
    try {
      await resend.emails.send({
        from: `${storeConfig.name} <onboarding@resend.dev>`,
        to: customerEmail,
        subject: `Order Confirmed — ${storeConfig.name}`,
        html: `
          <h1>Thank you for your order, ${customerName}!</h1>
          <p>We've received your order and are getting it ready.</p>
          <p><strong>Order Total:</strong> ${total}</p>
          <p><strong>Session ID:</strong> ${session.id}</p>
          <p>You'll receive a shipping notification when your order is on its way.</p>
          <br/>
          <p>— ${storeConfig.owner}, ${storeConfig.name}</p>
        `,
      });
    } catch (err) {
      console.error("Failed to send customer confirmation email:", err);
    }
  }

  // Store notification email
  try {
    await resend.emails.send({
      from: `${storeConfig.name} Orders <onboarding@resend.dev>`,
      to: notificationEmail,
      subject: `New Order from ${customerName} — ${total}`,
      html: `
        <h1>New Order Received</h1>
        <p><strong>Customer:</strong> ${customerName} &lt;${customerEmail}&gt;</p>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>Session ID:</strong> ${session.id}</p>
        <p>View details in your <a href="https://dashboard.stripe.com/payments">Stripe Dashboard</a>.</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send store notification email:", err);
  }
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 503 }
    );
  }

  // ── Verify webhook signature ────────────────────────────────────
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not set. Cannot verify webhook signatures."
    );
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 400 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  // ── Handle events ───────────────────────────────────────────────
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log(
        `Checkout completed: ${session.id} — ${session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "N/A"}`
      );
      await sendEmails(session);
      break;
    }

    default:
      // Unhandled event type — acknowledge receipt
      console.log(`Unhandled webhook event: ${event.type}`);
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}
