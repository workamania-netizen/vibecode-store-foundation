# CLAUDE.md — Instructions for Claude Code

> This file tells Claude Code how this project works. Read it before making any changes.

## Project Overview

**Vibecode Store Foundation** is a Next.js ecommerce template for non-technical small business owners selling physical products. It is a config-driven storefront — one file (`src/config/store.ts`) controls all business data, products, colors, and content. The buyer customizes that single file to make it their own.

### Business Context (Sample Data)

<!-- CUSTOMIZE: Replace these values when adapting for a different store -->
- **Store:** Martinsburg Honey Co. — family apiary in Martinsburg, WV
- **Products:** 10 products across 3 categories (Raw Honey, Infused Honey, Bee Products)
- **Owner:** Sarah & Tom Mitchell, founded 2018
- **Colors:** Honey gold (#D4A017), dark honey (#8B6914), amber (#F4C430), brown (#2C1810), cream (#FFF8E7)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with CSS custom properties
- **Payments:** Stripe hosted checkout (server-side session creation)
- **Email:** Resend (with console.log fallback)
- **Blog:** MDX files in `content/blog/` with gray-matter frontmatter
- **Deployment:** Vercel (zero-config) or Replit

## Architecture — The Single Config Rule

**All business data lives in `src/config/store.ts`.** Never hardcode store names, product details, prices, colors, addresses, hours, or policy text in components. Always read from `storeConfig`.

### Color Flow

1. `src/config/store.ts` defines 5 hex colors (`primary`, `secondary`, `accent`, `dark`, `light`)
2. `src/app/layout.tsx` → `getColorCSSVariables()` injects them as inline CSS custom properties on `<html>`
3. `src/app/globals.css` → Tailwind `@theme` block maps CSS vars to Tailwind utilities + generates light/dark variants via `color-mix()`
4. Components use classes like `bg-primary`, `text-dark`, `text-accent`, `bg-light`

**To re-theme the entire site:** change 5 hex values in `store.ts`. Nothing else.

## File Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout — CSS vars, CartProvider, Header/Footer, Organization JSON-LD
│   ├── page.tsx                      # Homepage — HeroSection, FeaturedProducts, AboutPreview, Testimonials, CTA, Store JSON-LD
│   ├── globals.css                   # Tailwind @theme, CSS custom properties, base styles
│   ├── about/page.tsx                # About page — story, hours, visit info
│   ├── products/
│   │   ├── page.tsx                  # Product listing — client-side category filter
│   │   └── [slug]/page.tsx           # Product detail — generateStaticParams, VariantSelector, Product JSON-LD
│   ├── cart/page.tsx                 # Cart page — line items, qty controls, order summary, checkout button
│   ├── contact/page.tsx              # Contact page — ContactForm + sidebar with hours/address
│   ├── blog/
│   │   ├── page.tsx                  # Blog listing — post cards sorted by date
│   │   └── [slug]/page.tsx           # Blog post — MDX rendering with prose styling, BlogPosting JSON-LD
│   ├── order-confirmation/page.tsx   # Post-checkout success page — clears cart, Suspense boundary
│   ├── policies/
│   │   ├── shipping/page.tsx         # Shipping info from config
│   │   └── returns/page.tsx          # Returns policy from config
│   ├── api/
│   │   ├── checkout/route.ts         # POST — server-side price validation, Stripe session creation
│   │   ├── contact/route.ts          # POST — rate limit, sanitize, honeypot, Resend email
│   │   └── webhook/stripe/route.ts   # POST — Stripe signature verification, order emails
│   ├── sitemap.ts                    # Programmatic sitemap (all pages, products, blog posts)
│   └── robots.ts                     # Programmatic robots.txt
├── components/
│   ├── cart/
│   │   ├── CartIcon.tsx              # Header cart icon with badge (hidden until hydrated)
│   │   └── CartItem.tsx              # Line item with qty +/- controls
│   ├── contact/
│   │   └── ContactForm.tsx           # Form with contactReasons dropdown, honeypot, validation
│   ├── home/
│   │   ├── HeroSection.tsx           # Hero with image + CTAs
│   │   ├── FeaturedProducts.tsx      # Featured product grid
│   │   ├── AboutPreview.tsx          # About teaser with image
│   │   ├── TestimonialsSection.tsx   # Customer review cards
│   │   └── CTASection.tsx            # Dark CTA section
│   ├── layout/
│   │   ├── Header.tsx                # Sticky header — nav, CartIcon, mobile toggle
│   │   ├── Footer.tsx                # 4-column footer — links, policies, contact, social
│   │   └── MobileNav.tsx             # Slide-out mobile menu
│   ├── product/
│   │   ├── ProductCard.tsx           # Product card (used on listing + homepage)
│   │   ├── ProductGallery.tsx        # Product image display
│   │   └── VariantSelector.tsx       # Variant dropdown + price + Add to Cart
│   └── ui/
│       ├── Button.tsx                # Polymorphic button/link (3 variants, 3 sizes)
│       ├── Card.tsx                  # Card wrapper
│       ├── SectionHeading.tsx        # Section title + subtitle
│       └── StarRating.tsx            # Star rating display
├── config/
│   └── store.ts                      # THE single config file — all business data
├── context/
│   └── CartContext.tsx               # Cart state — useReducer, localStorage, isHydrated
└── lib/
    ├── blog.ts                       # MDX reader — getAllPosts, getPostBySlug, getAllSlugs
    ├── cart-storage.ts               # localStorage load/save helpers
    ├── json-ld.ts                    # JSON-LD generators (Organization, Store, Product, BlogPosting, Breadcrumb)
    ├── rate-limit.ts                 # In-memory sliding window rate limiter (5/hr per IP)
    ├── sanitize.ts                   # stripHtml, sanitizeField, isValidEmail
    └── stripe.ts                     # Stripe client singleton (getStripe)

content/blog/                         # MDX blog posts with frontmatter
public/images/                        # SVG placeholders (products, categories, blog, hero, about)
```

## Common Tasks

### Add a new product

Edit `src/config/store.ts` → add an entry to the `products` array. Required fields: `slug`, `name`, `category` (must match a `categories[].slug`), `description`, `longDescription`, `price` (cents), `variants` (array with `name`, `price` in cents, `sku`), `images` (array of paths), `featured`, `inStock`. Add a placeholder image to `public/images/products/`.

### Add a new category

Edit `src/config/store.ts` → add an entry to the `categories` array with `slug`, `name`, `description`, `image`. Existing products reference categories by `slug`.

### Change store colors

Edit `src/config/store.ts` → change the 5 hex values in `colors`. The entire site re-themes automatically through the CSS custom property flow.

### Add a blog post

Create `content/blog/your-slug.mdx` with frontmatter (`title`, `date`, `excerpt`, `author`, `image`). Add a placeholder image to `public/images/blog/`. The blog listing and sitemap update automatically.

### Change contact form reasons

Edit `src/config/store.ts` → modify the `contactReasons` array. The dropdown on the contact form updates automatically.

### Update shipping or return policies

Edit `src/config/store.ts` → modify `shipping.policy`, `shipping.standardRate`, `shipping.freeShippingThreshold`, or `returns.policy`, `returns.windowDays`. The policy pages and cart shipping calculation update automatically.

## Key Conventions

1. **Prices are in cents.** Store as integers, format to dollars only at display time with `(cents / 100).toFixed(2)`.
2. **Server-side price validation.** `src/app/api/checkout/route.ts` looks up prices from `storeConfig.products` — never trusts client-sent prices.
3. **No database.** All data lives in the config file and MDX files.
4. **Cart uses React context + localStorage.** `CartContext.tsx` with `useReducer` for state, `cart-storage.ts` for persistence. The `isHydrated` flag prevents SSR/client mismatches.
5. **Stripe hosted checkout.** Server creates session, client redirects. No custom payment form. No PCI scope.
6. **Graceful fallbacks.** No `STRIPE_SECRET_KEY` → checkout returns 503 with message. No `RESEND_API_KEY` → emails logged to console. No `STRIPE_WEBHOOK_SECRET` → webhook returns 400.
7. **Security.** Rate limiting on contact form (5/hr per IP), input sanitization, honeypot field, Stripe webhook signature verification, CSP headers allowing Stripe domains.
8. **Mobile-first.** All layouts responsive down to 375px. Mobile nav via `MobileNav.tsx`.

## Commands

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run start        # Start production server
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Purpose |
|----------|----------|---------|
| `STRIPE_SECRET_KEY` | For checkout | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For checkout | Stripe publishable key |
| `RESEND_API_KEY` | For emails | Resend API key (falls back to console.log) |
| `NEXT_PUBLIC_SITE_URL` | For SEO/emails | Production URL |
| `NOTIFICATION_EMAIL` | For order alerts | Where order notification emails go |
| `CONTACT_EMAIL` | For contact form | Where contact form emails go |
