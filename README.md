# BTI – Best Trading Indicator

A Next.js 15 (App Router) site with Stripe subscriptions, MongoDB and an admin panel at `/admin`.

## Setup
1. Copy `.env.example` to `.env.local` and fill in the values. Use Stripe **test** keys first.
2. Run `npm install`, then `npm run dev`.
3. Open `/admin/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. The first admin account is created on that first login. Default features, plans, FAQs and legal drafts are added to the database automatically.

## Stripe
- Webhook endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`
- Events to send: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`
- To test locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`. Put the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET`.
- Turn on the **Customer Portal** in Stripe (Settings → Billing → Customer portal) so customers can cancel and update their cards.
- Google Pay and Apple Pay show up automatically once they are enabled under Payment methods in the Stripe Dashboard.
- Orders change to *paid* **only** when a webhook confirms the payment. The success page never activates anything.

## Daily workflow: granting TradingView access
1. When someone pays, an email goes to `NOTIFY_EMAIL` and a **Pending** record appears in Admin → TradingView Access.
2. Add their username to the invite-only script in TradingView.
3. Set the record to **Granted**. The customer gets an email automatically.
4. Records flagged **Needs attention** (refund, cancellation or failed renewal) need you to revoke or check access in TradingView. Then set the status to **Revoked**.

## Content rules
- The customer count and rating stay hidden until you turn them on in Homepage Content, and only once they are verified.
- Every chart is labelled *illustrative* until real BTI screenshots are uploaded (Pages → Before/After, Images/Media).
- Legal pages show a "draft pending review" banner until you tick **Approved** in Legal Pages.

## Deploy (Vercel)
Add every variable from `.env.example` to the Vercel project. Set `NEXT_PUBLIC_SITE_URL=https://besttradingindicator.us`. Uploaded images are stored in MongoDB, so they survive redeploys.
