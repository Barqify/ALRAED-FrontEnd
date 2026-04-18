import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALMASA CROPS",
  description: "Egyptian agricultural products export",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="ar">
      <body className="antialiased">{children}</body>
    </html>
  );
}
