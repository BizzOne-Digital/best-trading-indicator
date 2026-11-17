"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { SETTINGS_TABS } from "@/lib/admin-resources";
import LocalImageField from "./LocalImageField";

const inp = "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent";

export default function SettingsEditor({ tab }: { tab: string }) {
  const cfg = SETTINGS_TABS[tab] ?? SETTINGS_TABS.hero;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((j) => setData(j.data));
  }, []);

  async function save() {
    setSaving(true);
    setMsg(null);
    const body = Object.fromEntries(cfg.fields.map((f) => [f.name, data?.[f.name]]));
    const r = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    setSaving(false);
    setMsg(r.ok ? { ok: true, text: "Saved — the live site is updated." } : { ok: false, text: j.error ?? "Save failed" });
  }

  if (!data) return <Loader2 className="h-6 w-6 animate-spin text-accent" />;
  const set = (k: string, v: unknown) => setData((d) => ({ ...d, [k]: v }));

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(SETTINGS_TABS).map(([k, t]) => (
          <Link key={k} href={`/admin/settings?tab=${k}`} className={`rounded-lg border px-3 py-1.5 text-sm ${k === tab ? "border-accent text-accent" : "border-line text-muted"}`}>{t.label}</Link>
        ))}
      </div>
      <h1 className="mb-6 text-2xl font-extrabold">{cfg.label}</h1>
      <div className="space-y-5 rounded-2xl border border-line bg-bg2 p-6">
        {cfg.fields.map((f) => (
          <div key={f.name}>
            {f.type === "boolean" ? (
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!data[f.name]} onChange={(e) => set(f.name, e.target.checked)} className="h-4 w-4 accent-[#00e6a7]" />{f.label}</label>
            ) : f.type === "image" ? (
              <LocalImageField label={f.label} value={String(data[f.name] ?? "")} onChange={(v) => set(f.name, v)} folder="pages" />
            ) : (
              <>
                <label className="mb-1.5 block text-sm font-medium" htmlFor={f.name}>{f.label}</label>
                {f.type === "textarea" ? <textarea id={f.name} rows={5} className={inp} value={String(data[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} /> : <input id={f.name} className={inp} value={String(data[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} />}
              </>
            )}
            {f.help && <p className="mt-1 text-xs text-muted">{f.help}</p>}
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-bold disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save changes
        </button>
        {msg && <p role="status" className={`text-sm ${msg.ok ? "text-accent" : "text-down"}`}>{msg.text}</p>}
      </div>
    </div>
  );
}
