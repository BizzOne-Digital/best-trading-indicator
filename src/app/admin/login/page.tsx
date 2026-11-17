"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import Logo from "@/components/Logo";
import { inputCls } from "@/components/forms/Field";

export default function AdminLogin() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <main className="relative flex min-h-dvh items-center justify-center px-4">
      <div className="grid-bg absolute inset-0" />
      <form
        className="relative w-full max-w-sm space-y-4 rounded-3xl border border-line bg-card p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr("");
          const fd = new FormData(e.currentTarget);
          const r = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(fd)) }).catch(() => null);
          if (r?.ok) return router.replace("/admin");
          setErr((await r?.json().catch(() => null))?.error ?? "Login failed");
          setBusy(false);
        }}
      >
        <div className="mb-2 flex justify-center"><Logo compact /></div>
        <h1 className="text-center text-xl font-bold">Admin sign in</h1>
        <div><label htmlFor="email" className="mb-1 block text-sm">Email</label><input id="email" name="email" type="email" autoComplete="username" required className={inputCls} /></div>
        <div><label htmlFor="password" className="mb-1 block text-sm">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} /></div>
        {err && <p role="alert" className="text-sm text-down">{err}</p>}
        <button disabled={busy} className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Sign in
        </button>
      </form>
    </main>
  );
}
