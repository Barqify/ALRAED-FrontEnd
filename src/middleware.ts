import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

const LOCALE_COOKIE = "alraed_locale";
const ONE_YEAR = 60 * 60 * 24 * 365;

function detectFromAcceptLanguage(req: NextRequest) {
  const al = req.headers.get("accept-language")?.toLowerCase() ?? "";
  // Very small supported set; cookie wins; default fallback is `en`.
  if (al.includes("ar")) return "ar";
  if (al.includes("fr")) return "fr";
  if (al.includes("en")) return "en";
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // If URL has no locale prefix, prefer user-selected cookie over browser language.
  // Fallback to defaultLocale ("en").
  if (!first || !isLocale(first)) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const preferred =
      cookieLocale && isLocale(cookieLocale)
        ? cookieLocale
        : detectFromAcceptLanguage(request);
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/" ? `/${preferred}` : `/${preferred}${pathname}`;
    const res = NextResponse.redirect(url);
    // Persist the detected locale so next request is stable.
    res.cookies.set(LOCALE_COOKIE, preferred, {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
    });
    return res;
  }

  // Persist locale choice whenever user is on a locale-prefixed URL.
  const res = NextResponse.next();
  res.cookies.set(LOCALE_COOKIE, first, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
