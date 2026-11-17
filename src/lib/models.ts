import mongoose, { Schema, model, models, type Model } from "mongoose";

const ts = { timestamps: true };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function m(name: string, schema: Schema): Model<any> {
  return (models[name] as Model<unknown>) ?? model(name, schema);
}

export const AdminUser = m("AdminUser", new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: String,
  passwordHash: { type: String, required: true },
}, ts));

const sessionSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  admin: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
  expiresAt: { type: Date, required: true },
}, ts);
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const AdminSession = m("AdminSession", sessionSchema);

const rateSchema = new Schema({ key: { type: String, unique: true }, count: Number, expiresAt: Date });
rateSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RateLimit = m("RateLimit", rateSchema);

export const SiteSettings = m("SiteSettings", new Schema({
  key: { type: String, unique: true, default: "main" },
  data: { type: Schema.Types.Mixed, default: {} },
}, { ...ts, minimize: false }));

export const PageContent = m("PageContent", new Schema({
  page: { type: String, unique: true },
  title: String, title_es: String, intro: String, intro_es: String,
  seoTitle: String, seoDescription: String,
}, ts));

export const Feature = m("Feature", new Schema({
  title: String, title_es: String, description: String, description_es: String,
  icon: { type: String, default: "target" }, order: { type: Number, default: 0, index: true },
  visible: { type: Boolean, default: true },
}, ts));

export const PricingPlan = m("PricingPlan", new Schema({
  slug: { type: String, unique: true },
  name: String, name_es: String,
  interval: { type: String, enum: ["month", "year", "lifetime"] },
  price: Number, regularPrice: Number, discountPercent: Number,
  showRegularPrice: { type: Boolean, default: false },
  promoStart: Date, promoEnd: Date,
  note: String, note_es: String,
  features: [String], features_es: [String],
  ctaLabel: String, ctaLabel_es: String, badge: String,
  featured: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  stripePriceId: String, order: { type: Number, default: 0 },
}, ts));

export const Customer = m("Customer", new Schema({
  firstName: String, lastName: String,
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  tradingViewUsername: { type: String, index: true },
  stripeCustomerId: { type: String, index: true },
}, ts));

export const Order = m("Order", new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer", index: true },
  plan: String, planName: String, interval: String,
  amount: Number, currency: { type: String, default: "usd" },
  tradingViewUsername: String,
  status: { type: String, enum: ["pending", "paid", "failed", "refunded", "canceled"], default: "pending", index: true },
  stripeSessionId: { type: String, index: true },
  stripeSubscriptionId: String, stripePaymentIntentId: { type: String, index: true },
  paidAt: Date,
}, ts));

export const Subscription = m("Subscription", new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer", index: true },
  order: { type: Schema.Types.ObjectId, ref: "Order" },
  plan: String,
  stripeSubscriptionId: { type: String, unique: true },
  status: { type: String, default: "active", index: true },
  currentPeriodEnd: Date, cancelAtPeriodEnd: Boolean,
  history: [{ date: Date, event: String, amount: Number }],
}, ts));

export const TradingViewAccess = m("TradingViewAccess", new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer", index: true },
  order: { type: Schema.Types.ObjectId, ref: "Order", unique: true },
  tradingViewUsername: { type: String, index: true },
  plan: String,
  status: { type: String, enum: ["pending", "granted", "revoked"], default: "pending", index: true },
  attention: String,
  notes: String, grantedAt: Date, revokedAt: Date,
}, ts));

export const Testimonial = m("Testimonial", new Schema({
  name: String, text: String, text_es: String, rating: Number,
  verified: { type: Boolean, default: false },
  approved: { type: Boolean, default: false, index: true },
  order: { type: Number, default: 0 },
}, ts));

const blogSchema = new Schema({
  title: String, slug: { type: String, unique: true },
  excerpt: String, content: String, category: { type: String, index: true },
  coverImage: String, author: { type: String, default: "BTI Team" },
  published: { type: Boolean, default: false, index: true },
  featured: { type: Boolean, default: false },
  seoTitle: String, seoDescription: String, publishedAt: Date,
}, ts);
blogSchema.index({ title: "text", excerpt: "text", content: "text" });
export const BlogPost = m("BlogPost", blogSchema);

export const BlogCategory = m("BlogCategory", new Schema({ name: { type: String, unique: true }, order: Number }, ts));

export const FAQ = m("FAQ", new Schema({
  question: String, answer: String, question_es: String, answer_es: String,
  order: { type: Number, default: 0 }, visible: { type: Boolean, default: true },
}, ts));

export const ContactInquiry = m("ContactInquiry", new Schema({
  firstName: String, lastName: String, email: String, tradingViewUsername: String,
  subject: String, planInterest: String, message: String,
  status: { type: String, enum: ["new", "read", "resolved"], default: "new", index: true },
  notes: String,
}, ts));

export const MediaAsset = m("MediaAsset", new Schema({
  title: String, url: String, alt: String,
  group: { type: String, enum: ["showcase", "slideshow"], index: true },
  order: { type: Number, default: 0 }, visible: { type: Boolean, default: true },
}, ts));

const uploadSchema = new Schema({
  folder: { type: String, required: true }, filename: { type: String, required: true },
  mimeType: String, size: Number, data: Buffer,
}, ts);
uploadSchema.index({ folder: 1, filename: 1 }, { unique: true });
export const StoredUpload = m("StoredUpload", uploadSchema);

export const LegalPage = m("LegalPage", new Schema({
  slug: { type: String, unique: true }, title: String, content: String,
  approved: { type: Boolean, default: false },
}, ts));

export const PaymentEvent = m("PaymentEvent", new Schema({
  eventId: { type: String, unique: true }, type: String,
}, ts));

export const AuditLog = m("AuditLog", new Schema({
  admin: String, action: String, target: String, meta: Schema.Types.Mixed,
}, ts));

export { mongoose };
