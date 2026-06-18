import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import ConditionalShell from "@/components/ConditionalShell";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

// フォント（Noto Serif JP）はビルド時取得を避け、実行時に Google Fonts から
// 読み込みます。--font-noto-serif-jp は globals.css の :root で定義済み。
// これにより、ビルドが外部ネットワーク（フォント取得）に依存しません。

export const metadata: Metadata = {
  title: {
    default: SITE.seoTitle,
    template: `%s｜${SITE.name}（${SITE.nameJa}）`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  metadataBase: new URL("https://retouch-members.com"),
  openGraph: {
    title: SITE.seoTitle,
    description: SITE.description,
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.seoTitle,
    description: SITE.description,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  // PWA（ホーム画面に追加してアプリ起動）
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#1b3522",
  width: "device-width",
  initialScale: 1,
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
        <ConditionalShell>{children}</ConditionalShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
