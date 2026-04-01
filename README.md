# Vibecode Store Foundation

A ready-to-deploy ecommerce website template built with Next.js. Designed for small businesses selling physical products — honey shops, candle makers, bakeries, artisan goods.

**One config file drives everything.** Change your store name, products, colors, and policies in a single file. No coding required beyond that.

## What's Included

- **Product catalog** with categories and variant sizing
- **Shopping cart** that remembers items across page refreshes
- **Stripe checkout** — secure, hosted payment page (no credit card data touches your site)
- **Order confirmation emails** via Resend
- **Contact form** with spam protection
- **Blog** for sharing stories, recipes, and updates
- **About page** with your story and store hours
- **Shipping and returns** policy pages
- **SEO** — search engine optimized with structured data, sitemap, and meta tags
- **Mobile responsive** — looks great on phones, tablets, and desktops

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd vibecode-store-foundation
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable | What It Is | Where to Get It |
|----------|-----------|----------------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe Dashboard → Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe public key | Stripe Dashboard → API Keys |
| `RESEND_API_KEY` | Email sending API key | [Resend Dashboard](https://resend.com) |
| `NEXT_PUBLIC_SITE_URL` | Your website URL | e.g., `https://yourstore.com` |
| `NOTIFICATION_EMAIL` | Where order alerts go | Your email address |
| `CONTACT_EMAIL` | Where contact form messages go | Your email address |

**Don't have these yet?** The site still works without them — checkout will show a helpful message, and emails will be logged to the console instead of sent.

### 3. Customize your store

Open `src/config/store.ts` and replace the sample data with your own:

- **Store name and tagline** — your business identity
- **Address, phone, email, hours** — your contact info
- **Colors** — 5 hex color values that theme the entire site
- **Products** — your product catalog with names, descriptions, prices, and variants
- **Categories** — how products are grouped
- **Shipping and return policies** — your store policies
- **Testimonials** — customer reviews
- **Contact reasons** — dropdown options on the contact form

### 4. Add your images

Replace the placeholder SVGs in `public/images/` with your real photos:

- `public/images/hero.svg` — homepage hero image
- `public/images/about.svg` — about page image
- `public/images/logo.svg` — your logo
- `public/images/products/` — one image per product (named `{product-slug}.svg` or `.jpg`/`.png`)
- `public/images/categories/` — one image per category
- `public/images/blog/` — blog post featured images

### 5. Run it

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your store.

## Deploy

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add your environment variables in the Vercel dashboard
4. Deploy — that's it

### Replit

1. Import the repository into Replit
2. Add environment variables in the Secrets tab
3. Click Run

## Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up a webhook endpoint pointing to `https://yoursite.com/api/webhook/stripe`
4. Select the `checkout.session.completed` event
5. Copy the webhook signing secret to your environment variables

**For testing:** Use Stripe's test mode keys. Test card number: `4242 4242 4242 4242`, any future expiry date, any CVC.

## Blog Posts

Add blog posts by creating `.mdx` files in `content/blog/`:

```
---
title: "Your Post Title"
date: "2025-01-15"
excerpt: "A short summary shown on the blog listing page."
author: "Your Name"
image: "/images/blog/your-post.svg"
---

Your post content goes here. You can use **bold**, *italic*, and other Markdown formatting.

## Headings Work Too

So do lists:
- Item one
- Item two
```

## Project Structure

```
src/config/store.ts    ← Edit this file to customize your store
content/blog/          ← Add blog posts here
public/images/         ← Replace placeholder images with your photos
.env.local             ← Your API keys (never commit this file)
```

## Built With

- [Next.js 15](https://nextjs.org) — React framework
- [Tailwind CSS v4](https://tailwindcss.com) — Styling
- [Stripe](https://stripe.com) — Payments
- [Resend](https://resend.com) — Email
- [MDX](https://mdxjs.com) — Blog content

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
