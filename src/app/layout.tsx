import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { defaultLocale, isRtl, locales } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "alraedcrops",
  description: "Egyptian agricultural products export",
};

/** Runs before Next/React — sets `lang` + `dir` from URL so first paint matches locale (no RTL/LTR flash). */
const LOCALE_DIR_BOOTSTRAP = `(()=>{try{var p=location.pathname.split("/").filter(Boolean)[0];var a=${JSON.stringify([...locales])};var loc=a.indexOf(p)>=0?p:${JSON.stringify(defaultLocale)};var e=document.documentElement;e.setAttribute("lang",loc);e.setAttribute("dir",loc==="ar"?"rtl":"ltr");}catch(_){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rtl = isRtl(defaultLocale);
  return (
    <html
      suppressHydrationWarning
      lang={defaultLocale}
      dir={rtl ? "rtl" : "ltr"}
    >
      <body className="antialiased" suppressHydrationWarning>
        <Script
          id="locale-dir-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: LOCALE_DIR_BOOTSTRAP }}
        />
        {children}
      </body>
    </html>
  );
}
