import { NextResponse, type NextRequest } from "next/server";

// ?lang=es|en sets the locale cookie (used by hreflang alternates and the language switcher).
export function middleware(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang");
  if (lang !== "en" && lang !== "es") return NextResponse.next();
  const headers = new Headers(req.headers);
  const rest = (req.headers.get("cookie") ?? "").split(/;\s*/).filter((c) => c && !c.startsWith("bti_locale="));
  headers.set("cookie", [...rest, `bti_locale=${lang}`].join("; "));
  const res = NextResponse.next({ request: { headers } });
  res.cookies.set("bti_locale", lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return res;
}

export const config = { matcher: ["/((?!api|admin|_next|.*\\..*).*)"] };
