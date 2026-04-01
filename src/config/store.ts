// ---------------------------------------------------------------------------
// Store Configuration — THE single source of truth
// ---------------------------------------------------------------------------
// Every component reads from this file. To customize the store for a
// different business, edit the values below — never hardcode business
// data in components.
// ---------------------------------------------------------------------------

export interface StoreAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface StoreHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface StoreColors {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  light: string;
}

export interface ProductVariant {
  name: string;
  price: number; // cents
  sku: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string; // matches Category.slug
  description: string;
  longDescription: string;
  price: number; // cents — base price (smallest variant)
  variants: ProductVariant[];
  images: string[];
  featured: boolean;
  inStock: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface ShippingPolicy {
  freeShippingThreshold: number; // cents
  standardRate: number; // cents
  estimatedDays: string;
  policy: string;
}

export interface ReturnsPolicy {
  windowDays: number;
  policy: string;
}

export interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
}

export interface SEOConfig {
  siteUrl: string;
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

export interface StoreConfig {
  // Identity
  name: string;
  tagline: string;
  description: string;
  foundedYear: number;
  owner: string;

  // Contact
  address: StoreAddress;
  phone: string;
  email: string;
  hours: StoreHours[];

  // Navigation
  nav: NavItem[];

  // Colors
  colors: StoreColors;

  // Catalog
  categories: Category[];
  products: Product[];

  // Policies
  shipping: ShippingPolicy;
  returns: ReturnsPolicy;

  // Social proof
  testimonials: Testimonial[];

  // SEO
  seo: SEOConfig;

  // Social
  social: SocialLinks;

  // Contact form
  contactReasons: string[];

  // Footer
  copyrightHolder: string;
  showPoweredBy: boolean;
}

// ---------------------------------------------------------------------------
// Martinsburg Honey Co. — Sample Data
// ---------------------------------------------------------------------------

const storeConfig: StoreConfig = {
  // ── Identity ──────────────────────────────────────────────────────────
  name: "Martinsburg Honey Co.",
  tagline: "Pure Appalachian Honey, Straight from Our Hives",
  description:
    "Family-owned apiary in Martinsburg, West Virginia producing raw, unfiltered honey and handcrafted bee products since 2018.",
  foundedYear: 2018,
  owner: "Sarah & Tom Mitchell",

  // ── Contact ───────────────────────────────────────────────────────────
  address: {
    street: "142 Honeybee Lane",
    city: "Martinsburg",
    state: "WV",
    zip: "25401",
    country: "US",
  },
  phone: "(304) 555-0172",
  email: "hello@martinsburg-honey.com",
  hours: [
    { day: "Monday", open: "9:00 AM", close: "5:00 PM" },
    { day: "Tuesday", open: "9:00 AM", close: "5:00 PM" },
    { day: "Wednesday", open: "9:00 AM", close: "5:00 PM" },
    { day: "Thursday", open: "9:00 AM", close: "5:00 PM" },
    { day: "Friday", open: "9:00 AM", close: "6:00 PM" },
    { day: "Saturday", open: "10:00 AM", close: "4:00 PM" },
    { day: "Sunday", open: "Closed", close: "Closed", closed: true },
  ],

  // ── Navigation ────────────────────────────────────────────────────────
  nav: [
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],

  // ── Colors ────────────────────────────────────────────────────────────
  // Change these 5 values to re-theme the entire site.
  colors: {
    primary: "#D4A017", // honey gold
    secondary: "#8B6914", // dark honey
    accent: "#F4C430", // bright amber
    dark: "#2C1810", // dark brown
    light: "#FFF8E7", // cream
  },

  // ── Categories ────────────────────────────────────────────────────────
  categories: [
    {
      slug: "raw-honey",
      name: "Raw Honey",
      description:
        "Unprocessed, unfiltered honey harvested straight from our Appalachian hives. All the natural enzymes, pollen, and flavor intact.",
      image: "/images/categories/raw-honey.svg",
    },
    {
      slug: "infused-honey",
      name: "Infused Honey",
      description:
        "Our raw honey blended with carefully selected herbs, spices, and botanicals for unique flavor profiles.",
      image: "/images/categories/infused-honey.svg",
    },
    {
      slug: "bee-products",
      name: "Bee Products",
      description:
        "Beeswax candles, lip balm, and other handcrafted goods made from our hive products.",
      image: "/images/categories/bee-products.svg",
    },
  ],

  // ── Products ──────────────────────────────────────────────────────────
  // Prices are in CENTS. Never trust client-side prices.
  products: [
    // ─── Raw Honey ───
    {
      slug: "wildflower-honey",
      name: "Wildflower Honey",
      category: "raw-honey",
      description:
        "A rich, complex blend from wildflowers across the Appalachian foothills. Our most popular honey.",
      longDescription:
        "Our Wildflower Honey is harvested from hives placed among the diverse wildflowers of the Appalachian foothills. Each batch reflects the unique blend of clover, goldenrod, black locust, and dozens of other native wildflowers blooming in our region. The result is a rich, complex honey with deep amber color and a flavor that changes subtly with each season. Raw and unfiltered — never heated above natural hive temperatures.",
      price: 1495,
      variants: [
        { name: "8 oz Jar", price: 1495, sku: "WF-8OZ" },
        { name: "16 oz Jar", price: 2495, sku: "WF-16OZ" },
        { name: "32 oz Jar", price: 3995, sku: "WF-32OZ" },
      ],
      images: ["/images/products/wildflower-honey.svg"],
      featured: true,
      inStock: true,
    },
    {
      slug: "clover-honey",
      name: "Clover Honey",
      category: "raw-honey",
      description:
        "Light, mild, and subtly sweet. A classic everyday honey perfect for tea, toast, and baking.",
      longDescription:
        "Our Clover Honey comes from hives surrounded by fields of white and crimson clover in the Shenandoah Valley. It has a light golden color, mild floral aroma, and clean sweetness that makes it the perfect all-purpose honey. Wonderful in tea, drizzled on toast, or used in baking where you want honey flavor without overpowering other ingredients. Raw and unfiltered.",
      price: 1295,
      variants: [
        { name: "8 oz Jar", price: 1295, sku: "CL-8OZ" },
        { name: "16 oz Jar", price: 2195, sku: "CL-16OZ" },
        { name: "32 oz Jar", price: 3495, sku: "CL-32OZ" },
      ],
      images: ["/images/products/clover-honey.svg"],
      featured: true,
      inStock: true,
    },
    {
      slug: "buckwheat-honey",
      name: "Buckwheat Honey",
      category: "raw-honey",
      description:
        "Dark, bold, and molasses-like. Packed with antioxidants and perfect for marinades and glazes.",
      longDescription:
        "Buckwheat Honey is the boldest honey we produce. Dark as molasses with a rich, malty flavor and slight bitterness that honey connoisseurs love. Studies have shown buckwheat honey contains more antioxidants than lighter varieties. Excellent in marinades, BBQ glazes, and robust baked goods. A tablespoon in warm water makes a traditional sore-throat remedy. Raw and unfiltered.",
      price: 1695,
      variants: [
        { name: "8 oz Jar", price: 1695, sku: "BW-8OZ" },
        { name: "16 oz Jar", price: 2895, sku: "BW-16OZ" },
      ],
      images: ["/images/products/buckwheat-honey.svg"],
      featured: false,
      inStock: true,
    },
    {
      slug: "orange-blossom-honey",
      name: "Orange Blossom Honey",
      category: "raw-honey",
      description:
        "Light citrus notes with a delicate floral finish. Harvested from hives near Virginia orchards.",
      longDescription:
        "Our Orange Blossom Honey is a special seasonal offering from hives we place near citrus-growing friends in Virginia's milder southern counties. It captures the delicate fragrance of orange blossoms in a light, golden honey with subtle citrus undertones. Beautiful drizzled over yogurt, fresh fruit, or vanilla ice cream. Limited availability — we produce only a few batches each spring. Raw and unfiltered.",
      price: 1595,
      variants: [
        { name: "8 oz Jar", price: 1595, sku: "OB-8OZ" },
        { name: "16 oz Jar", price: 2695, sku: "OB-16OZ" },
      ],
      images: ["/images/products/orange-blossom-honey.svg"],
      featured: false,
      inStock: true,
    },

    // ─── Infused Honey ───
    {
      slug: "lavender-honey",
      name: "Lavender Honey",
      category: "infused-honey",
      description:
        "Wildflower honey infused with dried Appalachian lavender. Floral, calming, and delicious in tea.",
      longDescription:
        "We infuse our raw wildflower honey with dried lavender buds grown on a partner farm right here in the Eastern Panhandle. The lavender is steeped for several weeks, then strained, leaving behind a beautifully aromatic honey with floral complexity. Stir it into chamomile tea for a calming evening drink, drizzle over goat cheese, or use it to glaze roasted vegetables. A customer favorite for gift sets.",
      price: 1795,
      variants: [
        { name: "8 oz Jar", price: 1795, sku: "LV-8OZ" },
        { name: "16 oz Jar", price: 2995, sku: "LV-16OZ" },
      ],
      images: ["/images/products/lavender-honey.svg"],
      featured: true,
      inStock: true,
    },
    {
      slug: "hot-honey",
      name: "Hot Honey",
      category: "infused-honey",
      description:
        "Sweet heat! Raw honey infused with chili peppers. Amazing on pizza, fried chicken, and biscuits.",
      longDescription:
        "Our Hot Honey brings together the sweetness of raw wildflower honey and the kick of locally grown chili peppers. We steep a blend of cayenne and habanero peppers in warm honey until we hit the perfect sweet-heat balance — enough spice to tingle, not enough to overpower the honey flavor. The result is addictively good on pizza, fried chicken, cornbread, grilled peaches, and just about everything else. Once you try it, you'll keep a jar on the table.",
      price: 1695,
      variants: [
        { name: "8 oz Jar", price: 1695, sku: "HH-8OZ" },
        { name: "16 oz Jar", price: 2895, sku: "HH-16OZ" },
      ],
      images: ["/images/products/hot-honey.svg"],
      featured: true,
      inStock: true,
    },
    {
      slug: "cinnamon-honey",
      name: "Cinnamon Honey",
      category: "infused-honey",
      description:
        "Warm cinnamon spice blended into raw honey. Perfect in oatmeal, on toast, or in hot cider.",
      longDescription:
        "We blend our raw clover honey with Ceylon cinnamon — the \"true\" cinnamon prized for its delicate, complex flavor. The result is a warm, spiced honey that tastes like autumn in a jar. Swirl it into oatmeal, spread it on warm toast, stir it into hot apple cider, or use it as a glaze for sweet potatoes. Kids and adults alike love this one. Made with real cinnamon bark, never extracts or flavorings.",
      price: 1595,
      variants: [
        { name: "8 oz Jar", price: 1595, sku: "CI-8OZ" },
        { name: "16 oz Jar", price: 2695, sku: "CI-16OZ" },
      ],
      images: ["/images/products/cinnamon-honey.svg"],
      featured: false,
      inStock: true,
    },
    {
      slug: "garlic-honey",
      name: "Garlic Honey",
      category: "infused-honey",
      description:
        "Fermented garlic in raw honey. An umami-rich condiment for cooking, marinades, and charcuterie boards.",
      longDescription:
        "Garlic Honey is made by fermenting whole cloves of locally grown hardneck garlic in our raw wildflower honey. Over several weeks, the garlic softens and mellows while the honey takes on a deep, savory-sweet umami flavor. Use the honey as a glaze for salmon or roasted chicken, toss it with roasted vegetables, or spread the soft garlic cloves on crusty bread. A staple for home cooks and a hit on charcuterie boards.",
      price: 1695,
      variants: [
        { name: "8 oz Jar", price: 1695, sku: "GH-8OZ" },
        { name: "16 oz Jar", price: 2895, sku: "GH-16OZ" },
      ],
      images: ["/images/products/garlic-honey.svg"],
      featured: false,
      inStock: true,
    },

    // ─── Bee Products ───
    {
      slug: "beeswax-candles",
      name: "Beeswax Candles",
      category: "bee-products",
      description:
        "Hand-poured beeswax candles with a natural honey scent. Clean-burning and long-lasting.",
      longDescription:
        "Our beeswax candles are hand-poured from the cappings wax harvested during honey extraction — nothing is wasted. Pure beeswax burns cleaner and longer than paraffin, producing a warm glow and subtle honey scent without synthetic fragrances. Each candle is made in small batches and has the natural golden color of fresh beeswax. They make wonderful gifts and fill any room with a gentle, warm ambiance.",
      price: 1295,
      variants: [
        { name: "Single Candle", price: 1295, sku: "BC-SINGLE" },
        { name: "3-Pack", price: 3295, sku: "BC-3PACK" },
      ],
      images: ["/images/products/beeswax-candles.svg"],
      featured: false,
      inStock: true,
    },
    {
      slug: "lip-balm",
      name: "Honey Lip Balm",
      category: "bee-products",
      description:
        "All-natural lip balm made with our beeswax and honey. Moisturizing and lightly sweet.",
      longDescription:
        "Our Honey Lip Balm is crafted from just four ingredients: our beeswax, raw honey, coconut oil, and a touch of vitamin E. No petroleum, no synthetic fragrances, no artificial colors. The beeswax creates a protective barrier while the honey and coconut oil moisturize. Lightly sweet with a subtle honey flavor, it keeps lips soft through all seasons. Comes in a compostable paperboard tube.",
      price: 595,
      variants: [
        { name: "Single Tube", price: 595, sku: "LB-SINGLE" },
        { name: "3-Pack", price: 1495, sku: "LB-3PACK" },
      ],
      images: ["/images/products/lip-balm.svg"],
      featured: false,
      inStock: true,
    },
  ],

  // ── Policies ──────────────────────────────────────────────────────────
  shipping: {
    freeShippingThreshold: 5000, // $50.00
    standardRate: 599, // $5.99
    estimatedDays: "3-5 business days",
    policy:
      "We ship all orders via USPS Priority Mail from Martinsburg, WV. Orders placed before 2 PM ET on business days ship same day. Free shipping on orders over $50. We currently ship within the continental United States only. Honey is carefully packed to prevent breakage during transit.",
  },
  returns: {
    windowDays: 30,
    policy:
      "We stand behind every product we sell. If you're not completely satisfied, contact us within 30 days of delivery for a full refund or exchange. Unopened items can be returned in their original packaging. If a jar arrives damaged during shipping, send us a photo and we'll ship a replacement immediately at no cost. Please contact us at hello@martinsburg-honey.com to initiate a return.",
  },

  // ── Testimonials ──────────────────────────────────────────────────────
  testimonials: [
    {
      name: "Margaret R.",
      location: "Charles Town, WV",
      quote:
        "The wildflower honey is absolutely divine. You can taste the difference from store-bought — it's like liquid gold. I won't buy honey anywhere else now.",
      rating: 5,
    },
    {
      name: "David & Lisa K.",
      location: "Winchester, VA",
      quote:
        "We ordered the hot honey on a whim and now we're obsessed. It goes on everything — pizza, biscuits, even ice cream. Already on our third jar!",
      rating: 5,
    },
    {
      name: "James T.",
      location: "Hagerstown, MD",
      quote:
        "Bought the gift set for my mother's birthday. Beautiful packaging, amazing honey, and it arrived in perfect condition. She loved it. Will definitely order again.",
      rating: 5,
    },
    {
      name: "Priya M.",
      location: "Shepherdstown, WV",
      quote:
        "The lavender honey in chamomile tea has become my nightly ritual. So calming and delicious. Sarah and Tom clearly put so much care into everything they make.",
      rating: 5,
    },
  ],

  // ── SEO ───────────────────────────────────────────────────────────────
  seo: {
    siteUrl: "https://martinsburg-honey.com",
    titleTemplate: "%s | Martinsburg Honey Co.",
    defaultDescription:
      "Pure, raw Appalachian honey from our family apiary in Martinsburg, WV. Shop wildflower, infused, and specialty honeys plus beeswax products. Free shipping over $50.",
    ogImage: "/images/og-default.svg",
  },

  // ── Social ────────────────────────────────────────────────────────────
  social: {
    facebook: "https://facebook.com/martinsburghoney",
    instagram: "https://instagram.com/martinsburghoney",
  },

  // ── Contact Form Reasons ──────────────────────────────────────────────
  contactReasons: [
    "General Question",
    "Wholesale Inquiry",
    "Custom Gift Sets",
    "Shipping Question",
    "Returns & Exchanges",
    "Other",
  ],

  // ── Footer ────────────────────────────────────────────────────────────
  copyrightHolder: "Martinsburg Honey Co.",
  showPoweredBy: false,
};

export default storeConfig;
