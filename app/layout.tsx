import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 見出し・本文のメインフォント（retouch.salon と同じ Noto Serif JP）
const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

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
    <html lang="ja" className={notoSerifJp.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
