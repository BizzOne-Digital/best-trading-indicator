import Link from "next/link";
import { AlertTriangle, BadgeCheck, CalendarClock, DollarSign, Infinity as Inf, MessageSquare, Repeat, ShoppingCart } from "lucide-react";
import { ContactInquiry, Order, Subscription, TradingViewAccess } from "@/lib/models";

const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export default async function Dashboard() {
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const [totalOrders, activeSubs, revenue, pending, attention, inquiries, recentOrders, newInquiries] = await Promise.all([
    Order.countDocuments({ status: { $in: ["paid", "refunded", "canceled"] } }),
    Subscription.countDocuments({ status: { $in: ["active", "trialing", "past_due"] } }),
    Order.aggregate([{ $match: { status: "paid" } }, { $group: { _id: "$interval", total: { $sum: "$amount" }, count: { $sum: 1 }, thisMonth: { $sum: { $cond: [{ $gte: ["$paidAt", monthStart] }, "$amount", 0] } } } }]),
    TradingViewAccess.countDocuments({ status: "pending" }),
    TradingViewAccess.countDocuments({ attention: { $nin: [null, ""] } }),
    ContactInquiry.countDocuments({ status: "new" }),
    Order.find({ status: { $ne: "pending" } }).sort({ createdAt: -1 }).limit(8).populate("customer", "firstName lastName email").lean<{ _id: string; planName: string; amount: number; status: string; createdAt: string; tradingViewUsername: string; customer?: { firstName: string; lastName: string; email: string } }[]>(),
    ContactInquiry.find().sort({ createdAt: -1 }).limit(5).lean<{ _id: string; firstName: string; lastName: string; subject?: string; message: string; status: string; createdAt: string }[]>(),
  ]);
  const by = (k: string) => revenue.find((r) => r._id === k) ?? { total: 0, count: 0, thisMonth: 0 };
  const m = by("month"), y = by("year"), l = by("lifetime");

  const cards = [
    [ShoppingCart, "Total paid orders", String(totalOrders), "/admin/orders"],
    [Repeat, "Active subscriptions", String(activeSubs), "/admin/subscriptions"],
    [DollarSign, "Monthly plan revenue", `${usd(m.total)}`, "/admin/orders", `${usd(m.thisMonth)} this month · ${m.count} orders`],
    [CalendarClock, "Annual plan revenue", `${usd(y.total)}`, "/admin/orders", `${usd(y.thisMonth)} this month · ${y.count} orders`],
    [Inf, "Lifetime purchases", String(l.count), "/admin/orders", `${usd(l.total)} total`],
    [BadgeCheck, "Pending TradingView access", String(pending), "/admin/access?status=pending"],
    [MessageSquare, "New inquiries", String(inquiries), "/admin/inquiries"],
  ] as const;

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Dashboard</h1>
      <p className="text-sm text-muted">Live figures from the database. Revenue counts paid orders (refunds excluded).</p>
      {(pending > 0 || attention > 0) && (
        <Link href="/admin/access" className="mt-5 flex items-center gap-3 rounded-xl border border-yellow-400/40 bg-yellow-400/10 p-4 text-sm text-yellow-100">
          <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-300" />
          {pending > 0 && <span><strong>{pending}</strong> customer(s) waiting for TradingView access.</span>}
          {attention > 0 && <span><strong>{attention}</strong> access record(s) need attention (refund, cancellation or failed payment).</span>}
        </Link>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([I, label, value, href, sub]) => (
          <Link key={label} href={href} className="rounded-2xl border border-line bg-bg2 p-5 transition hover:border-accent">
            <I className="h-6 w-6 text-accent" />
            <p className="mt-3 text-sm text-muted">{label}</p>
            <p className="font-head text-3xl font-extrabold">{value}</p>
            {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-line bg-bg2 p-5">
          <h2 className="mb-4 font-bold">Recent transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-left text-xs uppercase text-muted"><tr><th className="pb-2">Date</th><th>Customer</th><th>Plan</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted">No transactions yet.</td></tr>}
                {recentOrders.map((o) => (
                  <tr key={String(o._id)} className="border-t border-line">
                    <td className="py-2.5 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>{o.customer?.firstName} {o.customer?.lastName}<br /><span className="font-mono text-xs text-accent">{o.tradingViewUsername}</span></td>
                    <td>{o.planName}</td><td className="font-mono">{usd(o.amount)}</td><td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-bg2 p-5">
          <h2 className="mb-4 font-bold">Recent inquiries</h2>
          <ul className="space-y-3">
            {newInquiries.length === 0 && <li className="text-sm text-muted">No inquiries yet.</li>}
            {newInquiries.map((i) => (
              <li key={String(i._id)} className="border-b border-line pb-3 text-sm last:border-0">
                <p className="font-medium">{i.firstName} {i.lastName} <span className="text-xs text-muted">· {i.status}</span></p>
                <p className="line-clamp-2 text-muted">{i.subject || i.message}</p>
              </li>
            ))}
          </ul>
          <Link href="/admin/inquiries" className="mt-3 inline-block text-sm text-accent">View all →</Link>
        </section>
      </div>
    </div>
  );
}
