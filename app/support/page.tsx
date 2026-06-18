import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteLink from "@/components/SiteLink";
import { SITE } from "@/lib/site";
import { IMG } from "@/lib/images";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { CTA } from "@/components/Blocks";
import { AdBanner } from "@/components/Ads";
import MembershipGuidelines from "@/components/MembershipGuidelines";

export const metadata: Metadata = {
  title: {
    absolute: "Retouch（リタッチ）引退馬支援／入会の方法",
  },
  description:
    "引退馬保護団体リタッチの入会方法について、メンバーになるには？メンバーズ会員・サポーター会員をはじめ一口支援制度も充実。ポニーのリタポメンバー入会案内。",
  keywords: [
    "入会方法",
    "Retouch",
    "リタッチ",
    "馬",
    "メンバー会員",
    "方法",
    "支援方法",
    "法人協賛",
    "スポンサー募集",
  ],
};

// 会員種別による特典内容の違いはなし。月額のみが異なる3プラン。
const PLANS = [
  { name: "メンバーズ会員", price: "1,800", unit: "円/月" },
  { name: "サポーター会員", price: "3,600", unit: "円/月" },
  { name: "リェリーフ会員", price: "7,200", unit: "円/月" },
];

// 全プラン共通の特典
const MEMBER_BENEFITS = ["見学会へのご参加", "会員専用情報の閲覧"];

const WAYS = [
  { id: "一口支援", title: "一口支援", image: IMG.supportOneShare, imageAlt: "一口オーナーと馬（日本人）",
    body: "1頭の馬を、みんなで支える仕組み。月々の一口支援で、飼養・治療・再調教を支えます。支援した馬に会える・乗れる体験も。" },
  { id: "ポニーチーム", title: "ポニーチーム", image: IMG.supportPony, imageAlt: "ふれあい・教育・福祉で活躍するポニー",
    body: "ふれあい・教育・福祉で活躍するポニーたちを応援するチーム。子どもや家族で参加できる、やさしい支援のかたちです。" },
  { id: "法人協賛", title: "法人協賛", image: IMG.supportCorporate, imageAlt: "企業協賛・CSR活動",
    body: "企業として活動を支える年間協賛。CSR・SDGsの取り組みとして、広報掲出や社員参加プログラムもご用意します。" },
  { id: "寄付・支援", title: "寄付・支援（ふるさと納税）", image: IMG.supportDonation, imageAlt: "寄付・ふるさと納税による支援",
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
        backgroundImage={IMG.supportHeroBg}
        imagePosition="72% center"
        overlay="strong"
        crumbs={[{ label: "応援する" }]}
      />

      <Section alt>
        <SectionHeading
          eyebrow="SUPPORT STATUS"
          title="馬ごとの支援状況"
          lead="月間支援の達成率・支援者数から、いま応援を必要としている馬を探せます。"
        />
        <div className="mt-8 text-center">
          <Link href="/support/status" className="btn-primary">
            支援状況をすべて見る
          </Link>
        </div>
      </Section>

      {/* 会員になる */}
      <Section id="会員になる" alt>
        <SectionHeading
          eyebrow="MEMBERSHIP"
          title="ご入会のご案内"
          lead="本ページでは、Retouch（リタッチ）の活動理念にご賛同いただき、引退競走馬たちの未来を共に支えてくださる皆さまへ、会員制度についてご案内いたします。見学会へのご参加、会員専用の情報閲覧が可能です。"
        />
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-ink/80">
          現在、Retouchでは以下の3種類の月額会員制度をご用意しております。
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand-900/10"
            >
              <h3 className="text-lg font-semibold text-brand-900">{p.name}</h3>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-bold text-brand-700">{p.price}</span>
                <span className="mb-1 text-sm text-ink/60">{p.unit}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-ink/80">
                {MEMBER_BENEFITS.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {it}
                  </li>
                ))}
              </ul>
              <SiteLink href={SITE.membersUrl} className="mt-7 btn-primary">
                このプランで申し込む
              </SiteLink>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-ink/60">
          ※ 会員種別による特典内容の違いはございません。ご自身のご負担のない範囲で、応援いただけるプランをお選びください。
        </p>

        <MembershipGuidelines />
      </Section>

      <AdBanner
        badge="SUPPORT ｜ ふるさと納税"
        title="ふるさと納税で、1頭まるごと保護。"
        body="大阪府河内長野市のふるさと納税を通じて、引退馬の保護を直接応援。返礼として馬に会える・乗れる体験もご用意しています。"
        cta="支援状況を見る"
        href="/support/status"
        tone="gold"
      />

      {/* 支援の方法（一口支援・ポニーチーム・法人協賛・寄付） */}
      {WAYS.map((w, i) => (
        <Section key={w.id} id={w.id} alt={i % 2 === 1}>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
              <Image
                src={w.image}
                alt={w.imageAlt}
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
              <p className="eyebrow">{`SUPPORT 0${i + 1}`}</p>
              <h3 className="mt-3 section-title !text-2xl sm:!text-3xl">{w.title}</h3>
              <p className="section-lead mt-5">{w.body}</p>
              <SiteLink href={SITE.membersUrl} className="btn-outline mt-7">
                この方法で支援する
              </SiteLink>
            </div>
          </div>
        </Section>
      ))}

      <Section alt>
        <CTA
          backgroundImage={IMG.ctaBg}
          title="あなたにできる方法で、命をつなぐ。"
          body="ご不明な点は、お気軽にお問い合わせください。あなたに合った応援の形をご提案します。"
          primary={{ label: "会員登録・支援する", href: SITE.loginUrl }}
          secondary={{ label: "お問い合わせ", href: "/contact" }}
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
