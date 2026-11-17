"use client";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Eye, Loader2, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { RESOURCES, type FieldDef } from "@/lib/admin-resources";
import LocalImageField from "./LocalImageField";
import { markdownToHtml } from "@/lib/markdown";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Item = Record<string, any> & { _id: string };

const inp = "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent";
const fmtDate = (v: string) => (v ? new Date(v).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—");

function Cell({ name, v }: { name: string; v: any }) {
  if (v == null || v === "") return <span className="text-muted">—</span>;
  if (typeof v === "boolean") return <span className={`rounded-full px-2 py-0.5 text-xs ${v ? "bg-accent/15 text-accent" : "bg-white/5 text-muted"}`}>{v ? "Yes" : "No"}</span>;
  if (name === "customer" && typeof v === "object") return <span><span className="font-medium">{v.firstName} {v.lastName}</span><br /><span className="text-xs text-muted">{v.email}</span></span>;
  if (name === "order" && typeof v === "object") return <span className="text-xs">{v.planName} · ${v.amount} · <StatusPill v={v.status} /></span>;
  if (/At$|End$/.test(name)) return <span className="whitespace-nowrap text-xs">{fmtDate(v)}</span>;
  if (name === "status") return <StatusPill v={v} />;
  if (name === "attention") return <span className="inline-flex items-center gap-1 text-xs text-yellow-300"><AlertTriangle className="h-3.5 w-3.5" />{v}</span>;
  if (name === "url") return /* eslint-disable-next-line @next/next/no-img-element */ <img src={v} alt="" className="h-10 w-16 rounded object-cover" />;
  if (name === "amount") return <span className="font-mono">${v}</span>;
  return <span className="line-clamp-2">{String(v)}</span>;
}

function StatusPill({ v }: { v: string }) {
  const c = ["paid", "active", "granted", "resolved", "trialing"].includes(v) ? "bg-accent/15 text-accent" : ["pending", "new", "past_due", "read"].includes(v) ? "bg-yellow-400/15 text-yellow-300" : "bg-down/15 text-down";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c}`}>{v}</span>;
}

function FieldInput({ f, value, set }: { f: FieldDef; value: any; set: (v: any) => void }) {
  const [preview, setPreview] = useState(false);
  if (f.type === "readonly") {
    const text = Array.isArray(value)
      ? value.map((h: any) => `${h.date ? fmtDate(h.date) : ""} – ${h.event ?? ""}${h.amount != null ? ` ($${h.amount})` : ""}`).join("\n")
      : typeof value === "object" && value ? JSON.stringify(value, null, 2) : /End$/.test(f.name) && value ? fmtDate(value) : value ?? "—";
    return <pre className="whitespace-pre-wrap rounded-lg border border-line bg-bg2 p-3 font-sans text-sm text-fg/90">{String(text)}</pre>;
  }
  if (f.type === "boolean") return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!value} onChange={(e) => set(e.target.checked)} className="h-4 w-4 accent-[#00e6a7]" />{f.label}</label>;
  if (f.type === "select") return <select className={inp} value={value ?? ""} onChange={(e) => set(e.target.value)}><option value="">—</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>;
  if (f.type === "image") return <LocalImageField value={value} onChange={set} folder={f.folder ?? "misc"} />;
  if (f.type === "number") return <input type="number" step="any" className={inp} value={value ?? ""} onChange={(e) => set(e.target.value)} />;
  if (f.type === "date") return <input type="date" className={inp} value={value ? String(value).slice(0, 10) : ""} onChange={(e) => set(e.target.value)} />;
  if (f.type === "list") return <textarea rows={5} className={inp} value={Array.isArray(value) ? value.join("\n") : value ?? ""} onChange={(e) => set(e.target.value.split("\n"))} />;
  if (f.type === "textarea") return <textarea rows={4} className={inp} value={value ?? ""} onChange={(e) => set(e.target.value)} />;
  if (f.type === "markdown")
    return (
      <div>
        <div className="mb-1 flex gap-2 text-xs">
          <button type="button" onClick={() => setPreview(false)} className={!preview ? "text-accent" : "text-muted"}>Write</button>
          <button type="button" onClick={() => setPreview(true)} className={preview ? "text-accent" : "text-muted"}><Eye className="mr-1 inline h-3 w-3" />Preview</button>
          <span className="ml-auto text-muted">## Heading · **bold** · - list · [link](https://…) · ![image](url)</span>
        </div>
        {preview ? <div className="prose-bti max-h-[50vh] overflow-auto rounded-lg border border-line bg-bg2 p-4 text-sm" dangerouslySetInnerHTML={{ __html: markdownToHtml(value ?? "") }} /> : <textarea rows={16} className={`${inp} font-mono`} value={value ?? ""} onChange={(e) => set(e.target.value)} />}
      </div>
    );
  return <input className={inp} value={value ?? ""} onChange={(e) => set(e.target.value)} />;
}

export default function ResourceManager({ resource }: { resource: string }) {
  const def = RESOURCES[resource];
  const [data, setData] = useState<{ items: Item[]; total: number; pages: number }>({ items: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  const statusOptions: Record<string, string[]> = {
    orders: ["pending", "paid", "failed", "refunded", "canceled"], access: ["pending", "granted", "revoked"],
    inquiries: ["new", "read", "resolved"], subscriptions: ["active", "past_due", "canceled", "unpaid", "trialing"],
  };

  const load = useCallback(async () => {
    setLoading(true);
    const u = new URLSearchParams({ page: String(page), ...(q && { q }), ...(status && { status }) });
    const r = await fetch(`/api/admin/${resource}?${u}`);
    if (r.ok) setData(await r.json());
    setLoading(false);
  }, [resource, page, q, status]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); } }, [toast]);

  const open = (it: Item | null) => {
    setEditing(it ?? ({ _id: "" } as Item));
    const init: Record<string, any> = {};
    for (const f of def.fields) init[f.name] = it ? it[f.name] : f.type === "boolean" ? (f.name === "visible" ? true : false) : undefined;
    setDraft(init);
  };

  async function save() {
    setSaving(true);
    const body: Record<string, any> = {};
    for (const f of def.fields) if (f.type !== "readonly") body[f.name] = draft[f.name];
    const isNew = !editing?._id;
    const r = await fetch(isNew ? `/api/admin/${resource}` : `/api/admin/${resource}/${editing!._id}`, { method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) return setToast({ ok: false, text: j.error ?? "Save failed" });
    setToast({ ok: true, text: "Saved" });
    setEditing(null);
    load();
  }

  async function remove(it: Item) {
    if (!confirm("Delete this item permanently?")) return;
    const r = await fetch(`/api/admin/${resource}/${it._id}`, { method: "DELETE" });
    setToast(r.ok ? { ok: true, text: "Deleted" } : { ok: false, text: "Delete failed" });
    load();
  }

  const editable = def.fields.some((f) => f.type !== "readonly");

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{def.label}</h1>
          <p className="text-sm text-muted">{data.total} total</p>
        </div>
        {def.create && <button onClick={() => open(null)} className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold"><Plus className="h-4 w-4" />Add new</button>}
      </div>
      {def.help && <p className="mb-4 rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm text-fg/90">{def.help}</p>}
      <div className="mb-4 flex flex-wrap gap-3">
        {def.search && (
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); setQ(String(new FormData(e.currentTarget).get("q") ?? "")); }} className="flex items-center gap-2 rounded-lg border border-line bg-bg2 px-3">
            <Search className="h-4 w-4 text-muted" /><input name="q" placeholder="Search…" className="bg-transparent py-2 text-sm outline-none" />
          </form>
        )}
        {statusOptions[resource] && (
          <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="rounded-lg border border-line bg-bg2 px-3 py-2 text-sm">
            <option value="">All statuses</option>{statusOptions[resource].map((s) => <option key={s}>{s}</option>)}
          </select>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-bg2 text-xs uppercase tracking-wider text-muted">
            <tr>{def.columns.map((c) => <th key={c} className="px-4 py-3 font-semibold">{c.replace(/([A-Z])/g, " $1")}</th>)}<th className="px-4 py-3" /></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={def.columns.length + 1} className="px-4 py-10 text-center text-muted"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
            ) : data.items.length === 0 ? (
              <tr><td colSpan={def.columns.length + 1} className="px-4 py-10 text-center text-muted">No records yet.</td></tr>
            ) : (
              data.items.map((it) => (
                <tr key={it._id} className="border-t border-line hover:bg-white/[0.02]">
                  {def.columns.map((c) => <td key={c} className="max-w-xs px-4 py-3 align-top"><Cell name={c} v={it[c]} /></td>)}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button onClick={() => open(it)} className="rounded-lg border border-line p-1.5 hover:border-accent" aria-label={editable ? "Edit" : "View"}>{editable ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                    {def.remove && <button onClick={() => remove(it)} className="ml-2 rounded-lg border border-line p-1.5 hover:border-down hover:text-down" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {data.pages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-line p-1.5 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
          Page {page} of {data.pages}
          <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="rounded-lg border border-line p-1.5 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={() => setEditing(null)}>
          <div className="flex h-full w-full max-w-2xl flex-col border-l border-line bg-bg2" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-center justify-between border-b border-line p-5">
              <h2 className="text-lg font-bold">{editing._id ? (editable ? "Edit" : "View") : "New"} · {def.label}</h2>
              <button onClick={() => setEditing(null)} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {editing._id && (editing.customer || editing.email) && (
                <div className="grid gap-1 rounded-lg border border-line bg-bg p-3 text-sm sm:grid-cols-2">
                  {editing.customer && typeof editing.customer === "object" && <><span className="text-muted">Customer</span><span>{editing.customer.firstName} {editing.customer.lastName} · {editing.customer.email}</span></>}
                  {editing.email && <><span className="text-muted">Email</span><span>{editing.email}</span></>}
                  {editing.tradingViewUsername && <><span className="text-muted">TradingView</span><span className="font-mono text-accent">{editing.tradingViewUsername}</span></>}
                  {editing.order && typeof editing.order === "object" && <><span className="text-muted">Payment</span><span>{editing.order.planName} · ${editing.order.amount} · {editing.order.status}</span></>}
                  <span className="text-muted">Created</span><span>{fmtDate(editing.createdAt)}</span>
                </div>
              )}
              {def.fields.map((f) => (
                <div key={f.name}>
                  {f.type !== "boolean" && <label className="mb-1.5 block text-sm font-medium">{f.label}{f.required && <span className="text-down"> *</span>}</label>}
                  <FieldInput f={f} value={draft[f.name]} set={(v) => setDraft((d) => ({ ...d, [f.name]: v }))} />
                  {f.help && <p className="mt-1 text-xs text-muted">{f.help}</p>}
                </div>
              ))}
            </div>
            {editable && (
              <div className="flex justify-end gap-3 border-t border-line p-5">
                <button onClick={() => setEditing(null)} className="rounded-lg border border-line px-4 py-2 text-sm">Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {toast && <div role="status" className={`fixed bottom-5 right-5 z-[60] rounded-lg px-4 py-3 text-sm font-semibold shadow-lg ${toast.ok ? "bg-accent text-bg" : "bg-down text-white"}`}>{toast.text}</div>}
    </div>
  );
}
