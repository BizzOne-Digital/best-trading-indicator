// Shared (client + server) admin resource definitions. Drives the generic CRUD API and UI.
import { BLOG_CATEGORIES } from "./defaults";

export type FieldType = "text" | "textarea" | "markdown" | "number" | "boolean" | "select" | "image" | "list" | "date" | "readonly";
export type FieldDef = { name: string; label: string; type: FieldType; options?: string[]; folder?: string; required?: boolean; help?: string };
export type ResourceDef = {
  key: string; label: string; model: string; fields: FieldDef[]; columns: string[];
  sort: Record<string, 1 | -1>; create?: boolean; remove?: boolean; search?: string[]; populate?: string; help?: string;
};

const ICONS = ["target", "bars", "bell", "layers", "tv", "clock", "shield", "trend", "activity", "zap"];

export const RESOURCES: Record<string, ResourceDef> = {
  features: {
    key: "features", label: "Features", model: "Feature", sort: { order: 1 }, columns: ["title", "icon", "order", "visible"], create: true, remove: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true }, { name: "title_es", label: "Title (Spanish)", type: "text" },
      { name: "description", label: "Description", type: "textarea", required: true, help: "Do not promise features the client has not confirmed." },
      { name: "description_es", label: "Description (Spanish)", type: "textarea" },
      { name: "icon", label: "Icon", type: "select", options: ICONS }, { name: "order", label: "Order", type: "number" }, { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  plans: {
    key: "plans", label: "Pricing Plans", model: "PricingPlan", sort: { order: 1 }, columns: ["name", "interval", "price", "visible", "stripePriceId"], create: true, remove: false,
    help: "“Price” is the amount charged now (current offer price). No extra discount is applied on top. If a promo window is set and has ended, the Regular price is charged instead.",
    fields: [
      { name: "slug", label: "Slug (URL key)", type: "text", required: true }, { name: "name", label: "Name", type: "text", required: true }, { name: "name_es", label: "Name (Spanish)", type: "text" },
      { name: "interval", label: "Billing", type: "select", options: ["month", "year", "lifetime"], required: true },
      { name: "price", label: "Price charged (USD)", type: "number", required: true }, { name: "regularPrice", label: "Regular price (USD)", type: "number" },
      { name: "discountPercent", label: "Discount %", type: "number" }, { name: "showRegularPrice", label: "Show crossed-out regular price (only if verified)", type: "boolean" },
      { name: "promoStart", label: "Promo start", type: "date" }, { name: "promoEnd", label: "Promo end", type: "date" },
      { name: "note", label: "Note under price", type: "text" }, { name: "note_es", label: "Note (Spanish)", type: "text" },
      { name: "features", label: "Features (one per line)", type: "list" }, { name: "features_es", label: "Features Spanish (one per line)", type: "list" },
      { name: "ctaLabel", label: "Button label", type: "text" }, { name: "ctaLabel_es", label: "Button label (Spanish)", type: "text" },
      { name: "badge", label: "Badge (e.g. Best Value)", type: "text" }, { name: "featured", label: "Featured (glowing card)", type: "boolean" },
      { name: "visible", label: "Visible", type: "boolean" },
      { name: "stripePriceId", label: "Stripe Price ID (optional)", type: "text", help: "Leave blank to charge the price above. If set, Stripe uses that Price — keep amounts in sync." },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  orders: {
    key: "orders", label: "Orders", model: "Order", sort: { createdAt: -1 }, populate: "customer", columns: ["createdAt", "customer", "planName", "amount", "status", "tradingViewUsername"],
    search: ["tradingViewUsername", "planName", "status", "stripeSessionId"],
    fields: [{ name: "status", label: "Status (set by Stripe webhooks)", type: "readonly" }, { name: "stripeSessionId", label: "Stripe session", type: "readonly" }, { name: "stripeSubscriptionId", label: "Stripe subscription", type: "readonly" }, { name: "stripePaymentIntentId", label: "Payment intent", type: "readonly" }],
  },
  customers: {
    key: "customers", label: "Customers", model: "Customer", sort: { createdAt: -1 }, columns: ["createdAt", "firstName", "lastName", "email", "tradingViewUsername", "stripeCustomerId"],
    search: ["email", "firstName", "lastName", "tradingViewUsername"],
    fields: [
      { name: "firstName", label: "First name", type: "text" }, { name: "lastName", label: "Last name", type: "text" },
      { name: "tradingViewUsername", label: "TradingView username", type: "text" }, { name: "email", label: "Email", type: "readonly" }, { name: "stripeCustomerId", label: "Stripe customer", type: "readonly" },
    ],
  },
  subscriptions: {
    key: "subscriptions", label: "Subscriptions", model: "Subscription", sort: { createdAt: -1 }, populate: "customer", columns: ["createdAt", "customer", "plan", "status", "currentPeriodEnd", "cancelAtPeriodEnd"],
    search: ["status", "plan", "stripeSubscriptionId"],
    fields: [{ name: "status", label: "Status (from Stripe)", type: "readonly" }, { name: "currentPeriodEnd", label: "Renews / ends", type: "readonly" }, { name: "stripeSubscriptionId", label: "Stripe subscription", type: "readonly" }, { name: "history", label: "Billing history", type: "readonly" }],
  },
  access: {
    key: "access", label: "TradingView Access", model: "TradingViewAccess", sort: { createdAt: -1 }, populate: "customer order", columns: ["createdAt", "customer", "tradingViewUsername", "plan", "order", "status", "attention"],
    search: ["tradingViewUsername", "status", "plan"],
    help: "Grant access manually in TradingView (Manage access on the invite-only script), then set status to Granted. The customer is emailed when you mark it Granted.",
    fields: [
      { name: "tradingViewUsername", label: "TradingView username", type: "text" },
      { name: "status", label: "Access status", type: "select", options: ["pending", "granted", "revoked"] },
      { name: "attention", label: "Needs attention (cleared when you save)", type: "readonly" },
      { name: "notes", label: "Admin notes", type: "textarea" },
    ],
  },
  testimonials: {
    key: "testimonials", label: "Testimonials", model: "Testimonial", sort: { order: 1, createdAt: -1 }, columns: ["name", "rating", "approved", "verified", "order"], create: true, remove: true,
    help: "Publish real, client-approved reviews only.",
    fields: [
      { name: "name", label: "Customer name", type: "text", required: true }, { name: "text", label: "Review", type: "textarea", required: true }, { name: "text_es", label: "Review (Spanish)", type: "textarea" },
      { name: "rating", label: "Rating (1-5, optional)", type: "number" }, { name: "verified", label: "Verified customer", type: "boolean" }, { name: "approved", label: "Approved / published", type: "boolean" }, { name: "order", label: "Order", type: "number" },
    ],
  },
  blogs: {
    key: "blogs", label: "Blogs", model: "BlogPost", sort: { createdAt: -1 }, columns: ["title", "category", "published", "featured", "publishedAt"], create: true, remove: true, search: ["title", "slug", "category"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true }, { name: "slug", label: "Slug (auto from title if blank)", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" }, { name: "content", label: "Content (Markdown)", type: "markdown" },
      { name: "category", label: "Category", type: "select", options: BLOG_CATEGORIES }, { name: "coverImage", label: "Featured image", type: "image", folder: "pages" },
      { name: "author", label: "Author", type: "text" }, { name: "published", label: "Published", type: "boolean" }, { name: "featured", label: "Featured", type: "boolean" },
      { name: "publishedAt", label: "Publish date", type: "date" }, { name: "seoTitle", label: "SEO title", type: "text" }, { name: "seoDescription", label: "SEO description", type: "textarea" },
    ],
  },
  faqs: {
    key: "faqs", label: "FAQ", model: "FAQ", sort: { order: 1 }, columns: ["question", "order", "visible"], create: true, remove: true,
    fields: [
      { name: "question", label: "Question", type: "text", required: true }, { name: "answer", label: "Answer", type: "textarea", required: true, help: "Avoid profit guarantees." },
      { name: "question_es", label: "Question (Spanish)", type: "text" }, { name: "answer_es", label: "Answer (Spanish)", type: "textarea" },
      { name: "order", label: "Order", type: "number" }, { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  inquiries: {
    key: "inquiries", label: "Contact Inquiries", model: "ContactInquiry", sort: { createdAt: -1 }, columns: ["createdAt", "firstName", "lastName", "email", "tradingViewUsername", "status"], remove: true,
    search: ["email", "firstName", "lastName", "tradingViewUsername", "subject"],
    fields: [
      { name: "message", label: "Message", type: "readonly" }, { name: "subject", label: "Subject", type: "readonly" }, { name: "planInterest", label: "Plan interest", type: "readonly" },
      { name: "status", label: "Status", type: "select", options: ["new", "read", "resolved"] }, { name: "notes", label: "Internal notes", type: "textarea" },
    ],
  },
  media: {
    key: "media", label: "Images / Media", model: "MediaAsset", sort: { group: 1, order: 1 }, columns: ["url", "title", "group", "order", "visible"], create: true, remove: true,
    help: "“showcase” images appear in the Product Showcase gallery; “slideshow” images appear in the moving screenshot strip.",
    fields: [
      { name: "url", label: "Image", type: "image", folder: "gallery", required: true }, { name: "title", label: "Title", type: "text" }, { name: "alt", label: "Alt text (SEO)", type: "text" },
      { name: "group", label: "Group", type: "select", options: ["showcase", "slideshow"], required: true }, { name: "order", label: "Order", type: "number" }, { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  legal: {
    key: "legal", label: "Legal Pages", model: "LegalPage", sort: { slug: 1 }, columns: ["title", "slug", "approved", "updatedAt"],
    help: "Legal text must be reviewed by the client. Pages show a “draft pending review” banner until Approved is checked.",
    fields: [{ name: "title", label: "Title", type: "text" }, { name: "content", label: "Content (Markdown)", type: "markdown" }, { name: "approved", label: "Approved by client", type: "boolean" }],
  },
  audit: { key: "audit", label: "Audit Log", model: "AuditLog", sort: { createdAt: -1 }, columns: ["createdAt", "admin", "action", "target"], fields: [{ name: "meta", label: "Details", type: "readonly" }], search: ["admin", "action", "target"] },
};

export type SettingsField = { name: string; label: string; type: "text" | "textarea" | "image" | "boolean"; help?: string };
export const SETTINGS_TABS: Record<string, { label: string; fields: SettingsField[] }> = {
  hero: {
    label: "Homepage Content",
    fields: [
      { name: "heroBadge", label: "Hero badge", type: "text" }, { name: "heroTitle1", label: "Headline line 1", type: "text" }, { name: "heroTitle2", label: "Headline line 2 (before highlight)", type: "text" },
      { name: "heroHighlight", label: "Highlighted words (green)", type: "text" }, { name: "heroDescription", label: "Hero description", type: "textarea" },
      { name: "heroPrimaryCta", label: "Primary button label", type: "text" }, { name: "heroSecondaryCta", label: "Video button label", type: "text" },
      { name: "heroImage", label: "Hero chart image (optional — replaces the illustrative chart)", type: "image" },
      { name: "heroTitle1_es", label: "Headline line 1 (Spanish)", type: "text" }, { name: "heroTitle2_es", label: "Headline line 2 (Spanish)", type: "text" },
      { name: "heroHighlight_es", label: "Highlighted words (Spanish)", type: "text" }, { name: "heroDescription_es", label: "Hero description (Spanish)", type: "textarea" },
      { name: "showTraderCount", label: "Show customer count (only when verified)", type: "boolean" }, { name: "traderCount", label: "Customer count text, e.g. “1,200+ Active Traders”", type: "text" },
      { name: "showRating", label: "Show rating (only when verified)", type: "boolean" }, { name: "ratingText", label: "Rating text", type: "text" },
    ],
  },
  pages: {
    label: "Pages (About & Comparison)",
    fields: [
      { name: "aboutTitle", label: "About title", type: "text" }, { name: "aboutBody", label: "About text (blank line = new paragraph)", type: "textarea" },
      { name: "aboutTitle_es", label: "About title (Spanish)", type: "text" }, { name: "aboutBody_es", label: "About text (Spanish)", type: "textarea" },
      { name: "aboutImage", label: "About image", type: "image" },
      { name: "beforeImage", label: "Before image (chart without BTI)", type: "image", help: "Upload both Before and After screenshots of the same chart to replace the illustrative slider." },
      { name: "afterImage", label: "After image (same chart with BTI)", type: "image" },
    ],
  },
  video: {
    label: "Videos",
    fields: [
      { name: "videoUrl", label: "Intro video URL (YouTube, Vimeo or MP4)", type: "text", help: "Leave blank to show a “coming soon” state." },
      { name: "videoThumbnail", label: "Video thumbnail", type: "image" },
    ],
  },
  seo: {
    label: "SEO",
    fields: [{ name: "seoTitle", label: "Default page title", type: "text" }, { name: "seoDescription", label: "Default meta description", type: "textarea" }, { name: "ogImage", label: "Social share image (1200×630)", type: "image" }],
  },
  site: {
    label: "Website Settings",
    fields: [
      { name: "contactEmail", label: "Contact email", type: "text" }, { name: "instagramUrl", label: "Instagram URL (icon hidden while blank)", type: "text" }, { name: "tiktokUrl", label: "TikTok URL (icon hidden while blank)", type: "text" },
    ],
  },
};
