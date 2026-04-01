# AGENTS.md — Instructions for Autonomous AI Agents

> For Codex, Devin, and similar autonomous coding agents. Read this before modifying any file.

## Project Summary

**Vibecode Store Foundation** — a Next.js 15 ecommerce template. One config file drives everything. Non-technical small business owners buy this template, update one file with their store details, and deploy.

**Sample store:** Martinsburg Honey Co. (fictional honey shop, Martinsburg, WV). 10 products, 3 categories.

<!-- CUSTOMIZE: When adapting for a different store, the ONLY file you must edit is src/config/store.ts. Update name, tagline, products, categories, colors, address, hours, policies, testimonials, contactReasons, and SEO fields. Then replace SVG placeholders in public/images/ with real photos. -->

## Architecture Constraints

1. **`src/config/store.ts` is the single source of truth.** Every component imports `storeConfig` from this file. Business name, products, categories, prices (in cents), colors, policies, testimonials, contact reasons, SEO config — all here. Never scatter business data across components.

2. **No database.** Product catalog is in the config file. Blog posts are MDX files in `content/blog/`. Cart is client-side React context with localStorage.

3. **Prices in cents.** `1495` means `$14.95`. Stored as integers everywhere — config, Stripe, cart context. Display formatting: `(cents / 100).toFixed(2)`.

4. **Server-side price validation.** `src/app/api/checkout/route.ts` looks up every price from `storeConfig.products` by `productSlug` and `variantSku`. Client sends quantities only. Never trust client prices.

5. **Stripe hosted checkout.** No custom payment form. Server creates a Stripe checkout session, client redirects to `session.url`. This avoids PCI compliance scope entirely.

6. **Graceful degradation.** Missing `STRIPE_SECRET_KEY` → 503 with helpful message. Missing `RESEND_API_KEY` → console.log fallback. Missing `STRIPE_WEBHOOK_SECRET` → 400 on webhook.

## Technology

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties from config |
| Payments | Stripe hosted checkout (server-side) |
| Email | Resend API (optional, console.log fallback) |
| Blog | MDX with gray-matter, compiled via @mdx-js/mdx |
| Cart | React context + useReducer + localStorage |
| SEO | JSON-LD (Organization, Store, Product, BlogPosting, BreadcrumbList), programmatic sitemap/robots |
| Security | CSP, HSTS, rate limiting, input sanitization, honeypot, webhook signature verification |

## Route Map

| Route | File | Type |
|-------|------|------|
| `/` | `src/app/page.tsx` | Static |
| `/products` | `src/app/products/page.tsx` | Static (client-side filter) |
| `/products/[slug]` | `src/app/products/[slug]/page.tsx` | SSG (generateStaticParams) |
| `/cart` | `src/app/cart/page.tsx` | Static (client component) |
| `/about` | `src/app/about/page.tsx` | Static |
| `/contact` | `src/app/contact/page.tsx` | Static (client form) |
| `/blog` | `src/app/blog/page.tsx` | Static |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | SSG (generateStaticParams) |
| `/order-confirmation` | `src/app/order-confirmation/page.tsx` | Static (client, Suspense) |
| `/policies/shipping` | `src/app/policies/shipping/page.tsx` | Static |
| `/policies/returns` | `src/app/policies/returns/page.tsx` | Static |
| `POST /api/checkout` | `src/app/api/checkout/route.ts` | Dynamic |
| `POST /api/contact` | `src/app/api/contact/route.ts` | Dynamic |
| `POST /api/webhook/stripe` | `src/app/api/webhook/stripe/route.ts` | Dynamic |
| `/sitemap.xml` | `src/app/sitemap.ts` | Static |
| `/robots.txt` | `src/app/robots.ts` | Static |

## Key Files and Their Roles

### Config
- `src/config/store.ts` — Exports `storeConfig` (type `StoreConfig`) and all related interfaces: `Product`, `ProductVariant`, `Category`, `StoreColors`, `ShippingPolicy`, `ReturnsPolicy`, `Testimonial`, `SEOConfig`, `SocialLinks`, etc.

### Cart System
- `src/context/CartContext.tsx` — Exports `CartProvider`, `useCart()` hook, and `CartItem` interface. Actions: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`, `HYDRATE`. Exposes `items`, `totalItems`, `totalPrice`, `isHydrated`.
- `src/lib/cart-storage.ts` — `loadCart()` and `saveCart()` for localStorage with error handling.
- `src/app/layout.tsx` — Wraps app in `<CartProvider>`.

### Checkout Flow
- `src/app/cart/page.tsx` — Cart UI. Calls `POST /api/checkout` with `{ items: [{ productSlug, variantSku, quantity }] }`. Redirects to Stripe `session.url`.
- `src/app/api/checkout/route.ts` — Validates items against config, creates Stripe session with server-side prices, adds shipping line item. Returns `{ url }`.
- `src/app/api/webhook/stripe/route.ts` — Verifies Stripe signature, handles `checkout.session.completed`, sends emails via Resend.
- `src/app/order-confirmation/page.tsx` — Reads `session_id` from URL (via `useSearchParams` inside `Suspense`), clears cart.

### Contact
- `src/components/contact/ContactForm.tsx` — Client component. Dropdown populated from `storeConfig.contactReasons`. Honeypot field (`website`). Client-side validation with plain English errors.
- `src/app/api/contact/route.ts` — Rate limits (5/hr per IP via `src/lib/rate-limit.ts`), sanitizes input (via `src/lib/sanitize.ts`), checks honeypot, sends email via Resend.

### Blog
- `content/blog/*.mdx` — Blog posts. Frontmatter: `title`, `date`, `excerpt`, `author`, `image`.
- `src/lib/blog.ts` — `getAllPosts()` (sorted by date desc), `getPostBySlug()`, `getAllSlugs()`.
- `src/app/blog/[slug]/page.tsx` — Compiles MDX at build time via `@mdx-js/mdx`. Uses `generateStaticParams`.

### SEO
- `src/lib/json-ld.ts` — Functions: `organizationJsonLd()`, `localBusinessJsonLd()`, `productJsonLd(product)`, `blogPostingJsonLd(post)`, `breadcrumbJsonLd(items)`.
- `src/app/sitemap.ts` — Includes all static pages, all product slugs, all blog slugs.
- `src/app/robots.ts` — Allows `/`, disallows `/api/` and `/order-confirmation`.

### Color System
- `src/config/store.ts` → `colors: { primary, secondary, accent, dark, light }` (hex values)
- `src/app/layout.tsx` → `getColorCSSVariables()` injects as `--color-*` CSS vars on `<html>`
- `src/app/globals.css` → `@theme` maps vars to Tailwind + generates `*-light`/`*-dark` variants via `color-mix()`
- `tailwind.config.ts` → Also maps `var(--color-*)` to Tailwind color keys

## Modification Patterns

### Adding a product
1. Add object to `storeConfig.products` in `src/config/store.ts`
2. Include: `slug`, `name`, `category` (matches `categories[].slug`), `description`, `longDescription`, `price` (cents), `variants[]` (each with `name`, `price` cents, `sku`), `images[]`, `featured`, `inStock`
3. Add SVG placeholder to `public/images/products/{slug}.svg`
4. Sitemap and product listing update automatically

### Adding a blog post
1. Create `content/blog/{slug}.mdx` with frontmatter
2. Add image to `public/images/blog/{slug}.svg`
3. Listing page, sitemap, and static generation update automatically

### Changing the theme
1. Edit `storeConfig.colors` in `src/config/store.ts`
2. All 5 values (primary, secondary, accent, dark, light) must be valid hex
3. Entire site re-themes — no other files need changes

## Commands

```bash
npm run dev      # Dev server on localhost:3000
npm run build    # Production build (must pass with zero errors)
npm run start    # Start production server
```

## Environment Variables

Required in `.env.local` (see `.env.example`):

- `STRIPE_SECRET_KEY` — Stripe secret key (checkout returns 503 without this)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `RESEND_API_KEY` — Resend API key (falls back to console.log without this)
- `NEXT_PUBLIC_SITE_URL` — Production URL for SEO and emails
- `NOTIFICATION_EMAIL` — Where order notification emails are sent
- `CONTACT_EMAIL` — Where contact form emails are sent

## Safety Checklist

Before submitting changes, verify:

- [ ] `npm run build` passes with zero errors
- [ ] No business data hardcoded outside `src/config/store.ts`
- [ ] Prices are in cents (integers), not dollars (floats)
- [ ] API routes never trust client-sent prices
- [ ] New pages are included in `src/app/sitemap.ts`
- [ ] Environment variables are not committed (check `.gitignore`)
