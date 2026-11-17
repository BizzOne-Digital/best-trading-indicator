import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ensureSeeded } from "@/lib/admin-server";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  await connectDB();
  await ensureSeeded();
  return (
    <div className="lg:flex">
      <Suspense fallback={<div className="w-64" />}><AdminNav email={admin.email} /></Suspense>
      <div className="min-w-0 flex-1 p-4 sm:p-8">{children}</div>
    </div>
  );
}
