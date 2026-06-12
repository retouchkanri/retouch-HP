import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import DonateBanner from "@/components/DonateBanner";

// フォント（Noto Serif JP）はビルド時取得を避け、実行時に Google Fonts から
// 読み込みます。--font-noto-serif-jp は globals.css の :root で定義済み。
// これにより、ビルドが外部ネットワーク（フォント取得）に依存しません。

export const metadata: Metadata = {
  title: {
    default: `${SITE.name}（${SITE.nameJa}）｜引退競走馬保護団体`,
    template: `%s｜${SITE.name}（${SITE.nameJa}）`,
  },
  description: SITE.description,
  metadataBase: new URL("https://retouch-members.com"),
  openGraph: {
    title: `${SITE.name}（${SITE.nameJa}）｜引退競走馬保護団体`,
    description: SITE.description,
    type: "website",
    locale: "ja_JP",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main className="max-sm:pb-24">{children}</main>
        <Footer />
        <ScrollToTop />
        <DonateBanner />
      </body>
    </html>
  );
}
