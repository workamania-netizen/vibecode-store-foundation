// ---------------------------------------------------------------------------
// POST /api/checkout — Create a Stripe Checkout Session
// ---------------------------------------------------------------------------
// SECURITY: All prices are looked up from storeConfig.products on the server.
// The client sends only product slugs, variant SKUs, and quantities.
// We NEVER trust client-sent prices.
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";
import storeConfig from "@/config/store";

interface CheckoutItem {
  productSlug: string;
  variantSku: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  // ── Rate limiting ──────────────────────────────────────────────────
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const { allowed, retryAfterSeconds } = rateLimit(`checkout:${ip}`);

  if (!allowed) {
    return NextResponse.json(
      {
        error: `Too many requests. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
      },
      { status: 429 }
    );
  }

  // ── Check Stripe is configured ──────────────────────────────────────
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error: "Payment processing is not configured.",
        message:
          "Set the STRIPE_SECRET_KEY environment variable to enable checkout.",
      },
      { status: 503 }
    );
  }

  // ── Parse and validate request body ─────────────────────────────────
  let items: CheckoutItem[];
  try {
    const body = await request.json();
    items = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  // ── Validate each item against config and build line items ──────────
  const lineItems: {
    price_data: {
      currency: string;
      product_data: { name: string; description?: string; images?: string[] };
      unit_amount: number;
    };
    quantity: number;
  }[] = [];

  for (const item of items) {
    // Validate quantity
    if (
      typeof item.quantity !== "number" ||
      item.quantity < 1 ||
      item.quantity > 99 ||
      !Number.isInteger(item.quantity)
    ) {
      return NextResponse.json(
        { error: `Invalid quantity for ${item.productSlug}.` },
        { status: 400 }
      );
    }

    // Look up product from config — NEVER trust client prices
    const product = storeConfig.products.find(
      (p) => p.slug === item.productSlug
    );
    if (!product) {
      return NextResponse.json(
        { error: `Product "${item.productSlug}" not found.` },
        { status: 400 }
      );
    }

    if (!product.inStock) {
      return NextResponse.json(
        { error: `"${product.name}" is currently sold out.` },
        { status: 400 }
      );
    }

    // Look up variant from config
    const variant = product.variants.find((v) => v.sku === item.variantSku);
    if (!variant) {
      return NextResponse.json(
        {
          error: `Variant "${item.variantSku}" not found for "${product.name}".`,
        },
        { status: 400 }
      );
    }

    // Build line item with SERVER-SIDE price
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || storeConfig.seo.siteUrl;
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${product.name} — ${variant.name}`,
          description: product.description,
          images: product.images.map((img) =>
            img.startsWith("http") ? img : `${siteUrl}${img}`
          ),
        },
        unit_amount: variant.price, // cents — from config, NOT from client
      },
      quantity: item.quantity,
    });
  }

  // ── Calculate shipping ──────────────────────────────────────────────
  const subtotal = lineItems.reduce(
    (sum, li) => sum + li.price_data.unit_amount * li.quantity,
    0
  );
  const shippingCost =
    subtotal >= storeConfig.shipping.freeShippingThreshold
      ? 0
      : storeConfig.shipping.standardRate;

  // Add shipping as a line item if applicable
  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Standard Shipping",
          description: storeConfig.shipping.estimatedDays,
        },
        unit_amount: shippingCost,
      },
      quantity: 1,
    });
  }

  // ── Create Stripe Checkout Session ──────────────────────────────────
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || storeConfig.seo.siteUrl;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${siteUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: {
        source: "vibecode-store",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
