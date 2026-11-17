import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-4 text-center">
      <Logo />
      <h1 className="text-5xl font-extrabold">404</h1>
      <p className="text-muted">This page could not be found.</p>
      <Link href="/" className="btn-primary rounded-xl px-6 py-3 font-bold">Back to home</Link>
    </main>
  );
}
