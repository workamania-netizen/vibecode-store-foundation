# Vibecode Store Foundation — Implementation Plan

> Next.js ecommerce template for non-technical small business owners selling physical products.
> Sample data: **Martinsburg Honey Co.** — fictional honey shop in Martinsburg, WV.

---

## Architecture Overview

Single config file (`src/config/store.ts`) drives all business details, products, categories, colors, and copy. CSS custom properties generated from config colors, consumed by Tailwind. Stripe hosted checkout (server-side session creation, client redirect — no custom payment form). Order notifications via Resend. MDX blog. SEO with JSON-LD Product/Store schemas. AI config files for vibe coding tools.

**Target: ~65 files** | **Framework: Next.js 15 (App Router)** | **Styling: Tailwind CSS v4**

---

## Complete File Tree

```
.cursorrules
.env.example
.gitignore
.replit
AGENTS.md
CLAUDE.md
PLAN.md
README.md
content/
  blog/
    benefits-of-raw-honey.mdx
next.config.ts
package.json
package-lock.json
postcss.config.mjs
public/
  favicon.ico
  images/
    about.svg
    blog/
      benefits-of-raw-honey.svg
      honey-recipes.svg
      bee-health.svg
    hero.svg
    logo.svg
    og-default.svg
    products/
      wildflower-honey.svg
      clover-honey.svg
      buckwheat-honey.svg
      orange-blossom-honey.svg
      lavender-honey.svg
      hot-honey.svg
      cinnamon-honey.svg
      garlic-honey.svg
      beeswax-candles.svg
      lip-balm.svg
    categories/
      raw-honey.svg
      infused-honey.svg
      bee-products.svg
replit.nix
src/
  app/
    about/
      page.tsx
    api/
      contact/
        route.ts
      checkout/
        route.ts
      webhook/
        stripe/
          route.ts
    blog/
      [slug]/
        page.tsx
      page.tsx
    cart/
      page.tsx
    contact/
      page.tsx
    globals.css
    layout.tsx
    order-confirmation/
      page.tsx
    page.tsx
    policies/
      shipping/
        page.tsx
      returns/
        page.tsx
    products/
      [slug]/
        page.tsx
      page.tsx
    robots.ts
    sitemap.ts
  components/
    cart/
      AddToCartButton.tsx
      CartDrawer.tsx
      CartIcon.tsx
      CartItem.tsx
    contact/
      ContactForm.tsx
    home/
      AboutPreview.tsx
      CTASection.tsx
      FeaturedProducts.tsx
      HeroSection.tsx
      TestimonialsSection.tsx
    layout/
      Footer.tsx
      Header.tsx
      MobileNav.tsx
    product/
      ProductCard.tsx
      ProductGallery.tsx
      VariantSelector.tsx
    ui/
      Button.tsx
      Card.tsx
      SectionHeading.tsx
      StarRating.tsx
  config/
    store.ts
  context/
    CartContext.tsx
  lib/
    blog.ts
    cart-storage.ts
    json-ld.ts
    rate-limit.ts
    sanitize.ts
    stripe.ts
tailwind.config.ts
tsconfig.json
```

**File count: ~67 files** (excluding package-lock.json and .git)

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^15.1",
    "react": "^19.0",
    "react-dom": "^19.0",
    "stripe": "^17.0",
    "resend": "^4.0",
    "@mdx-js/mdx": "^3.0",
    "@next/mdx": "^15.1",
    "gray-matter": "^4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0",
    "tailwindcss": "^4.0",
    "@types/node": "^22.0",
    "@types/react": "^19.0",
    "@types/react-dom": "^19.0",
    "typescript": "^5.7"
  }
}
```

---

## Phase Breakdown

### Phase 1: Project Scaffolding & Config

**Goal:** Working Next.js app with store config, colors, layout shell, and all tooling.

**Files created:**
1. `package.json` — dependencies, scripts
2. `tsconfig.json` — TypeScript config
3. `next.config.ts` — Next.js config with MDX, security headers
4. `tailwind.config.ts` — Tailwind v4 with CSS custom property mapping
5. `postcss.config.mjs` — PostCSS with Tailwind plugin
6. `src/config/store.ts` — **THE config file** (business info, colors, nav, products, categories, policies, SEO, social links, testimonials)
7. `src/app/globals.css` — Tailwind directives, CSS custom properties, base styles
8. `src/app/layout.tsx` — Root layout with color CSS vars, Header/Footer
9. `src/components/layout/Header.tsx` — Nav with cart icon, mobile menu toggle
10. `src/components/layout/Footer.tsx` — Footer with links, business info
11. `src/components/layout/MobileNav.tsx` — Slide-out mobile nav
12. `src/components/ui/Button.tsx` — Reusable button component
13. `src/components/ui/Card.tsx` — Reusable card component
14. `src/components/ui/SectionHeading.tsx` — Section heading component
15. `.env.example` — Environment variable template
16. `.gitignore` — Standard Next.js gitignore
17. `replit.nix` — Replit Nix config (Node.js 20)
18. `.replit` — Replit run config

**Config file structure (`store.ts`):**
```typescript
const storeConfig = {
  // Business identity
  name: "Martinsburg Honey Co.",
  tagline: "Pure Appalachian Honey, Straight from Our Hives",
  description: "...",
  foundedYear: 2018,
  owner: "Sarah & Tom Mitchell",

  // Location & contact
  address: { street, city: "Martinsburg", state: "WV", zip, country },
  phone: "...",
  email: "...",
  hours: [...],

  // Navigation
  nav: [
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],

  // Colors (drive entire site via CSS custom properties)
  colors: {
    primary: "#D4A017",    // honey gold
    secondary: "#8B6914",  // dark honey
    accent: "#F4C430",     // bright amber
    dark: "#2C1810",       // dark brown
    light: "#FFF8E7",      // cream
  },

  // Products (10 products, 3 categories)
  categories: [
    { slug: "raw-honey", name: "Raw Honey", description: "...", image: "..." },
    { slug: "infused-honey", name: "Infused Honey", description: "...", image: "..." },
    { slug: "bee-products", name: "Bee Products", description: "...", image: "..." },
  ],
  products: [
    {
      slug: "wildflower-honey",
      name: "Wildflower Honey",
      category: "raw-honey",
      description: "...",
      longDescription: "...",
      price: 1495,         // cents — never trust client prices
      variants: [
        { name: "8 oz Jar", price: 1495, sku: "WF-8OZ" },
        { name: "16 oz Jar", price: 2495, sku: "WF-16OZ" },
        { name: "32 oz Jar", price: 3995, sku: "WF-32OZ" },
      ],
      images: ["wildflower-honey.svg"],
      featured: true,
      inStock: true,
    },
    // ... 9 more products
  ],

  // Store policies
  shipping: {
    freeShippingThreshold: 5000, // cents
    standardRate: 599,
    estimatedDays: "3-5 business days",
    policy: "...",
  },
  returns: {
    windowDays: 30,
    policy: "...",
  },

  // Testimonials
  testimonials: [...],

  // SEO
  seo: {
    siteUrl: "https://martinsburg-honey.com",
    titleTemplate: "%s | Martinsburg Honey Co.",
    defaultDescription: "...",
    ogImage: "/images/og-default.svg",
  },

  // Social links
  social: {
    facebook: "...",
    instagram: "...",
  },
};
```

**Prompt size: ~1,800 lines | Recommended: 1 prompt**

**Dependencies:** None (first phase)

---

### Phase 2: Homepage & Static Pages

**Goal:** Complete homepage with all sections, About page, policy pages.

**Files created:**
1. `src/app/page.tsx` — Homepage composing all sections
2. `src/components/home/HeroSection.tsx` — Hero with CTA to products
3. `src/components/home/FeaturedProducts.tsx` — 3-4 featured product cards
4. `src/components/home/AboutPreview.tsx` — Short about blurb + link
5. `src/components/home/TestimonialsSection.tsx` — Customer reviews
6. `src/components/home/CTASection.tsx` — Final call-to-action
7. `src/components/ui/StarRating.tsx` — Star rating display
8. `src/components/product/ProductCard.tsx` — Product card (reused on homepage + products page)
9. `src/app/about/page.tsx` — About page with story, images
10. `src/app/policies/shipping/page.tsx` — Shipping info from config
11. `src/app/policies/returns/page.tsx` — Returns policy from config

**SVG placeholders created:**
12. `public/images/hero.svg`
13. `public/images/about.svg`
14. `public/images/logo.svg`
15. `public/favicon.ico`

**Prompt size: ~1,200 lines | Recommended: 1 prompt**

**Dependencies:** Phase 1

---

### Phase 3: Product Catalog

**Goal:** Products listing page, category filtering, product detail pages with variant selection.

**Files created:**
1. `src/app/products/page.tsx` — Product listing with category filter
2. `src/app/products/[slug]/page.tsx` — Product detail page (static generation from config)
3. `src/components/product/ProductGallery.tsx` — Product image display
4. `src/components/product/VariantSelector.tsx` — Size/variant picker

**SVG placeholders created:**
5. `public/images/products/wildflower-honey.svg`
6. `public/images/products/clover-honey.svg`
7. `public/images/products/buckwheat-honey.svg`
8. `public/images/products/orange-blossom-honey.svg`
9. `public/images/products/lavender-honey.svg`
10. `public/images/products/hot-honey.svg`
11. `public/images/products/cinnamon-honey.svg`
12. `public/images/products/garlic-honey.svg`
13. `public/images/products/beeswax-candles.svg`
14. `public/images/products/lip-balm.svg`
15. `public/images/categories/raw-honey.svg`
16. `public/images/categories/infused-honey.svg`
17. `public/images/categories/bee-products.svg`

**Prompt size: ~900 lines | Recommended: 1 prompt**

**Dependencies:** Phase 1 (config + layout), Phase 2 (ProductCard component)

---

### Phase 4: Shopping Cart

**Goal:** Cart context with localStorage persistence, cart drawer, add-to-cart flow.

**Files created:**
1. `src/context/CartContext.tsx` — React context + useReducer for cart state, localStorage sync
2. `src/lib/cart-storage.ts` — localStorage read/write helpers with error handling
3. `src/components/cart/AddToCartButton.tsx` — Add to cart with variant selection
4. `src/components/cart/CartDrawer.tsx` — Slide-out cart panel with item list, totals
5. `src/components/cart/CartIcon.tsx` — Header cart icon with item count badge
6. `src/components/cart/CartItem.tsx` — Individual cart line item (qty adjust, remove)
7. `src/app/cart/page.tsx` — Full cart page (fallback for drawer, checkout button)

**Modifications:**
- `src/app/layout.tsx` — Wrap children with CartProvider
- `src/components/layout/Header.tsx` — Add CartIcon
- `src/components/product/VariantSelector.tsx` — Wire up AddToCartButton
- `src/app/products/[slug]/page.tsx` — Add AddToCartButton

**Prompt size: ~1,000 lines | Recommended: 1 prompt**

**Dependencies:** Phase 1 (layout), Phase 3 (product pages)

---

### Phase 5: Stripe Checkout & Order Confirmation

**Goal:** Server-side Stripe checkout session creation, client redirect, webhook handler, order confirmation page, notification emails via Resend.

**Files created:**
1. `src/lib/stripe.ts` — Stripe client init, session creation helper with server-side price validation
2. `src/app/api/checkout/route.ts` — POST: validate cart items against config prices, create Stripe checkout session, return session URL
3. `src/app/api/webhook/stripe/route.ts` — POST: verify Stripe signature, handle `checkout.session.completed`, send confirmation + notification emails via Resend
4. `src/app/order-confirmation/page.tsx` — Thank-you page (reads session_id from URL params)

**Security considerations:**
- Server-side price validation: cart items matched against `storeConfig.products` prices — **never trust client-sent prices**
- Stripe webhook signature verification
- No sensitive data in client-side code

**Prompt size: ~800 lines | Recommended: 1 prompt**

**Dependencies:** Phase 1 (config), Phase 4 (cart context for checkout trigger)

---

### Phase 6: Contact Form & Blog

**Goal:** Contact page with email form, blog with MDX posts, rate limiting, input sanitization.

**Files created:**
1. `src/app/contact/page.tsx` — Contact page with form + business info
2. `src/components/contact/ContactForm.tsx` — Form with honeypot, client validation
3. `src/app/api/contact/route.ts` — POST: rate limit, sanitize, send email via Resend
4. `src/lib/rate-limit.ts` — In-memory rate limiter (token bucket)
5. `src/lib/sanitize.ts` — Input sanitization (strip HTML, length limits)
6. `src/app/blog/page.tsx` — Blog listing page
7. `src/app/blog/[slug]/page.tsx` — Individual blog post with MDX rendering
8. `src/lib/blog.ts` — MDX file reading, frontmatter parsing
9. `content/blog/benefits-of-raw-honey.mdx` — Sample blog post

**SVG placeholders created:**
10. `public/images/blog/benefits-of-raw-honey.svg`
11. `public/images/blog/honey-recipes.svg`
12. `public/images/blog/bee-health.svg`
13. `public/images/og-default.svg`

**Prompt size: ~1,100 lines | Recommended: 1 prompt**

**Dependencies:** Phase 1 (config + layout)

---

### Phase 7: SEO, Security & Deployment

**Goal:** JSON-LD schemas, sitemap, robots.txt, security headers, Vercel/Replit deployment config.

**Files created:**
1. `src/lib/json-ld.ts` — JSON-LD generators: Store, Product (with Offer), BreadcrumbList, BlogPosting, Organization
2. `src/app/sitemap.ts` — Dynamic sitemap from config products/categories + blog posts
3. `src/app/robots.ts` — Robots.txt generation

**Modifications:**
- `next.config.ts` — Add security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP)
- `src/app/layout.tsx` — Add Organization JSON-LD to root layout
- `src/app/products/[slug]/page.tsx` — Add Product JSON-LD + metadata
- `src/app/blog/[slug]/page.tsx` — Add BlogPosting JSON-LD + metadata
- `src/app/page.tsx` — Add Store JSON-LD + metadata

**Prompt size: ~700 lines | Recommended: 1 prompt**

**Dependencies:** Phase 1–6 (all pages must exist to add SEO/headers)

---

### Phase 8: AI Config Files & README

**Goal:** CLAUDE.md, .cursorrules, AGENTS.md for AI-assisted development, comprehensive README.

**Files created:**
1. `CLAUDE.md` — Claude Code instructions: project structure, config-driven architecture, commands, conventions
2. `.cursorrules` — Cursor IDE rules: same content adapted for Cursor format
3. `AGENTS.md` — Multi-agent instructions: architecture, file roles, modification patterns
4. `README.md` — Setup guide, environment variables, deployment instructions, customization guide

**Prompt size: ~800 lines | Recommended: 1 prompt**

**Dependencies:** All prior phases (documents the complete project)

---

## Phase Dependency Graph

```
Phase 1 (Scaffolding + Config)
  ├── Phase 2 (Homepage + Static Pages)
  │     └── Phase 3 (Product Catalog)
  │           └── Phase 4 (Shopping Cart)
  │                 └── Phase 5 (Stripe Checkout)
  ├── Phase 6 (Contact + Blog)          ← can run parallel with Phases 3-5
  └── Phase 7 (SEO + Security)          ← after all pages exist
        └── Phase 8 (AI Configs + README) ← last, documents everything
```

**Phases 6 can start after Phase 1** (independent of product/cart work).
**Phases 2-5 are sequential** (each builds on the prior).
**Phase 7 should come after all pages exist** so JSON-LD and sitemap cover everything.
**Phase 8 is always last.**

---

## Environment Variables

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (email)
RESEND_API_KEY=re_...

# Site URL (for absolute URLs in emails, SEO)
NEXT_PUBLIC_SITE_URL=https://martinsburg-honey.com

# Notification email (where order alerts go)
NOTIFICATION_EMAIL=orders@martinsburg-honey.com
```

---

## Claude Code Best Practices for Implementation

1. **One phase per prompt** — Each phase is scoped to fit in a single prompt with room for iteration. Don't combine phases.

2. **Always start prompts with context** — Begin each phase prompt with: "Read PLAN.md, CLAUDE.md, and src/config/store.ts first, then implement Phase N."

3. **Config file first** — Phase 1 establishes the config that all subsequent phases read. Never hardcode values that should come from config.

4. **Commit after each phase** — Each phase produces a working (if incomplete) app. Commit before starting the next phase.

5. **No over-engineering** — No Redux, no external state management, no ORMs, no database. React context + localStorage for cart. Config file for data. Stripe hosted checkout to avoid PCI scope.

6. **Prices in cents** — All prices stored as integers (cents) in config and Stripe. Format to dollars only at display time.

7. **Server-side price validation** — The checkout API route must look up prices from `storeConfig.products`, never trust amounts sent from the client.

8. **SVG placeholders** — Use simple colored SVG placeholders for all images. Real photos are the buyer's responsibility.

9. **Test the critical path** — After Phase 5, manually test: browse → add to cart → checkout → Stripe → webhook → confirmation. This is the core value prop.

10. **Security is not optional** — Rate limiting, input sanitization, CSRF-safe API routes (POST-only), Stripe webhook signature verification, security headers. All must be present.

---

## Sample Product Data (Martinsburg Honey Co.)

### Raw Honey (4 products)
| Product | Variants | Base Price |
|---------|----------|------------|
| Wildflower Honey | 8oz / 16oz / 32oz | $14.95 |
| Clover Honey | 8oz / 16oz / 32oz | $12.95 |
| Buckwheat Honey | 8oz / 16oz | $16.95 |
| Orange Blossom Honey | 8oz / 16oz | $15.95 |

### Infused Honey (4 products)
| Product | Variants | Base Price |
|---------|----------|------------|
| Lavender Honey | 8oz / 16oz | $17.95 |
| Hot Honey | 8oz / 16oz | $16.95 |
| Cinnamon Honey | 8oz / 16oz | $15.95 |
| Garlic Honey | 8oz / 16oz | $16.95 |

### Bee Products (2 products)
| Product | Variants | Base Price |
|---------|----------|------------|
| Beeswax Candles | Single / 3-Pack | $12.95 |
| Honey Lip Balm | Single / 3-Pack | $5.95 |
