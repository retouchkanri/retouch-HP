import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { IMG } from "@/lib/images";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { CTA } from "@/components/Blocks";
import { AdBanner } from "@/components/Ads";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "応援する",
  description: "会員になる、一口支援、ポニーチーム、法人協賛、寄付・支援。あなたに合った方法で引退競走馬の命をつなぐ。",
};

const PLANS = [
  { name: "フリー会員", price: "0", unit: "円", featured: false,
    desc: "まずは応援から。最新情報やイベントのお知らせを受け取れます。",
    items: ["活動の最新情報をお届け", "イベント・見学会のご案内"] },
  { name: "サポーター会員", price: "1,000", unit: "円/月", featured: true,
    desc: "もっとも人気のプラン。会員限定情報で馬たちの今を見守れます。",
    items: ["会員限定の活動報告・会計報告", "保護馬の近況・限定動画", "見学会の優先案内"] },
  { name: "レリーフ会員", price: "5,000", unit: "円/月", featured: false,
    desc: "より深く支える上位プラン。馬たちの飼養を力強く支援します。",
    items: ["サポーター会員の特典すべて", "見学会・体験乗馬の優待", "特別レポートのお届け"] },
];

const WAYS = [
  { id: "一口支援", title: "一口支援", img: IMG.owner,
    body: "1頭の馬を、みんなで支える仕組み。月々の一口支援で、飼養・治療・再調教を支えます。支援した馬に会える・乗れる体験も。" },
  { id: "ポニーチーム", title: "ポニーチーム", img: IMG.welfare,
    body: "ふれあい・教育・福祉で活躍するポニーたちを応援するチーム。子どもや家族で参加できる、やさしい支援のかたちです。" },
  { id: "法人協賛", title: "法人協賛", img: IMG.rescue,
    body: "企業として活動を支える年間協賛。CSR・SDGsの取り組みとして、広報掲出や社員参加プログラムもご用意します。" },
  { id: "寄付・支援", title: "寄付・支援（ふるさと納税）", img: IMG.pasture,
    body: "都度の寄付、ふるさと納税（大阪府河内長野市）による「1頭まるごと保護」など。返礼として馬に会える支援メニューもあります。" },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="SUPPORT"
        title="応援する"
        subtitle="あなたの応援が、一頭の命をつなぎます。"
        image={IMG.bannerSupport}
        crumbs={[{ label: "応援する" }]}
      />

      {/* 会員になる */}
      <Section id="会員になる" alt>
        <SectionHeading
          center
          eyebrow="MEMBERSHIP"
          title="会員になる"
          lead="月々のご支援が、馬たちの毎日を支えます。会費の多くは、馬の保護・飼養活動に充てられます。"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-3xl p-8 shadow-sm ring-1 ${
                p.featured ? "bg-brand-700 text-white ring-brand-700 lg:-translate-y-3" : "bg-white ring-brand-900/10"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-semibold text-white">
                  人気No.1
                </span>
              )}
              <h3 className={`text-lg font-semibold ${p.featured ? "text-white" : "text-brand-900"}`}>{p.name}</h3>
              <div className="mt-3 flex items-end gap-1">
                <span className={`text-4xl font-bold ${p.featured ? "text-gold" : "text-brand-700"}`}>{p.price}</span>
                <span className={`mb-1 text-sm ${p.featured ? "text-brand-100" : "text-ink/60"}`}>{p.unit}</span>
              </div>
              <p className={`mt-3 text-sm ${p.featured ? "text-brand-100" : "text-ink/70"}`}>{p.desc}</p>
              <ul className={`mt-5 flex-1 space-y-2 text-sm ${p.featured ? "text-brand-50" : "text-ink/80"}`}>
                {p.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${p.featured ? "bg-gold" : "bg-brand-500"}`} />
                    {it}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className={`mt-7 ${p.featured ? "btn-gold" : "btn-primary"}`}>
                このプランで申し込む
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-ink/50">
          ※ 会費・特典は一例です。最新の詳細はお問い合わせください。
        </p>
      </Section>

      <AdBanner
        badge="SUPPORT ｜ ふるさと納税"
        title="ふるさと納税で、1頭まるごと保護。"
        body="大阪府河内長野市のふるさと納税を通じて、引退馬の保護を直接応援。返礼として馬に会える・乗れる体験もご用意しています。"
        cta="寄付・支援を見る"
        href="#寄付・支援"
        tone="gold"
      />

      {/* 支援の方法（一口支援・ポニーチーム・法人協賛・寄付） */}
      {WAYS.map((w, i) => (
        <Section key={w.id} id={w.id} alt={i % 2 === 1}>
          <div className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <Placeholder label={w.img} className="aspect-[4/3] w-full" />
            </div>
            <div>
              <p className="eyebrow">{`SUPPORT 0${i + 1}`}</p>
              <h3 className="mt-3 section-title !text-2xl sm:!text-3xl">{w.title}</h3>
              <p className="section-lead mt-5">{w.body}</p>
              <Link href="/contact" className="btn-outline mt-7">この方法で支援する</Link>
            </div>
          </div>
        </Section>
      ))}

      <Section alt>
        <CTA
          title="あなたにできる方法で、命をつなぐ。"
          body="ご不明な点は、お気軽にお問い合わせください。あなたに合った応援の形をご提案します。"
          primary={{ label: "お問い合わせ", href: "/contact" }}
          secondary={{ label: "馬たちを見る", href: "/horses" }}
        />
        <p className="mt-6 text-center text-sm text-ink/60">
          公式YouTube（登録者2万人超）でも活動を発信中 ▶{" "}
          <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
            @Retouch2023
          </a>
        </p>
      </Section>
    </>
  );
}
