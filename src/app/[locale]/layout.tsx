import { Cairo, Montserrat, Playfair_Display } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { LocaleEffects } from "@/components/LocaleEffects";
import categories from "@/data/categories.json";
import { defaultLocale, getDict, isLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Category } from "@/lib/types";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

/** Same family as https://fonts.google.com/specimen/Montserrat — optimized via next/font */
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: loc } = await params;
  const locale: Locale = isLocale(loc) ? loc : defaultLocale;
  const dict = getDict(locale);

  /** Arabic: Cairo; Latin locales: Montserrat */
  const bodyFont =
    locale === "ar"
      ? "font-[family-name:var(--font-cairo)]"
      : "font-[family-name:var(--font-montserrat)]";

  return (
    <>
      <LocaleEffects locale={locale} />
      <div
        className={`${cairo.variable} ${playfair.variable} ${montserrat.variable} ${bodyFont} min-h-screen`}
      >
        <Navbar locale={locale} dict={dict} />
        <main>{children}</main>
        <Footer
          locale={locale}
          dict={dict}
          categories={categories as Category[]}
        />
        <WhatsAppFloat />
      </div>
    </>
  );
}
