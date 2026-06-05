import type { Metadata } from "next";
import { STATS } from "@/lib/site";
import { MEDIA } from "@/lib/data";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { StatGrid, CTA } from "@/components/Blocks";
import { AdBanner } from "@/components/Ads";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "活動実績",
  description:
    "保護馬53頭、支援者600名超、YouTube登録者2万人超、署名5万人超、メディア掲載多数。数字が証明する、支援の力。",
};

const HIGHLIGHTS = [
  { id: "保護馬53頭", value: "53", unit: "頭", title: "累計保護馬", image: "保護馬の写真コラージュ",
    body: "肥育場・競馬場・牧場から救い出した馬の累計頭数。一頭ずつ、確かに命をつないできました。" },
  { id: "支援者600名超", value: "600", unit: "名超", title: "支援者・会員", image: "全国の支援者・コミュニティの写真",
    body: "全国から集まった会員・サポーター。月々のご支援が、馬たちの飼養・治療・再調教を支えています。" },
  { id: "YouTube登録者2万人超", value: "2", unit: "万人超", title: "YouTube登録者", image: "動画視聴風景／人気動画サムネイル",
    body: "公式チャンネル @Retouch2023。保護馬の日常を発信し、登録者の増加が新たな1頭を救う力になっています。" },
  { id: "署名5万人超", value: "5", unit: "万人超", title: "署名", image: "署名活動の様子（社会的インパクト）",
    body: "引退馬を守る制度づくりに向けた署名。農水省・JRA・地方競馬への提言を後押しする確かな声です。" },
];

const TIMELINE = [
  { year: "2023", title: "活動開始", body: "引退競走馬保護団体 Retouch（リタッチ）始動。肥育場からの保護を開始。" },
  { year: "2024", title: "保護馬増加", body: "千葉・大阪の拠点で受け入れを拡大。見学会＆懇談会を定期開催。" },
  { year: "2025", title: "メディア掲載", body: "新聞・テレビ・Webで活動が紹介され、支援者・署名が大きく拡大。" },
  { year: "現在", title: "全国へ", body: "保護馬53頭・支援者600名超。教育・福祉・観光へ活動を広げています。" },
];

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="IMPACT"
        title="活動実績"
        subtitle="数字が証明する、支援の力。"
        image="保護された馬たちの集合写真"
        crumbs={[{ label: "活動実績" }]}
      />

      {/* 大型カウンター */}
      <div className="bg-brand-900">
        <div className="container-x py-14">
          <p className="text-center eyebrow !text-gold">BY THE NUMBERS</p>
          <h2 className="mt-3 mb-10 text-center text-2xl sm:text-3xl font-semibold text-white">
            これまでの歩み
          </h2>
          <StatGrid stats={STATS} dark />
        </div>
      </div>

      {/* 各指標の詳細 */}
      {HIGHLIGHTS.map((h, i) => (
        <Section key={h.id} id={h.id} alt={i % 2 === 0}>
          <div
            className={`grid items-center gap-10 lg:grid-cols-2 ${
              i % 2 ? "lg:[&>div:first-child]:order-2" : ""
            }`}
          >
            <Placeholder label={h.image} className="aspect-[4/3] w-full rounded-3xl shadow-lg" />
            <div>
              <div className="flex items-end gap-2">
                <span className="text-6xl sm:text-7xl font-bold text-brand-700">{h.value}</span>
                <span className="mb-2 text-xl text-brand-600">{h.unit}</span>
              </div>
              <h3 className="mt-2 section-title !text-2xl">{h.title}</h3>
              <p className="section-lead mt-5">{h.body}</p>
            </div>
          </div>
        </Section>
      ))}

      {/* メディア掲載（ロゴ一覧） */}
      <Section id="メディア掲載" alt>
        <SectionHeading
          center
          eyebrow="MEDIA"
          title="メディア掲載"
          lead="テレビ・新聞・Webなど、多くのメディアにRetouchの取り組みを取り上げていただいています。"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {MEDIA.map((m) => (
            <Placeholder
              key={m.title}
              label={`${m.outlet}（ロゴ）`}
              className="aspect-[3/2] w-full rounded-xl"
            />
          ))}
        </div>
      </Section>

      <AdBanner
        badge="SPONSORED ｜ 法人協賛"
        title="この実績を、貴社とともに次のステージへ。"
        body="協賛企業として活動を支え、社会貢献の実績を共有しませんか。広報・社員参加プログラムもご用意しています。"
        cta="協賛を相談する"
        href="/partners"
        tone="dark"
      />

      {/* 年表 */}
      <Section id="年表">
        <SectionHeading center eyebrow="HISTORY" title="活動の歩み（年表）" />
        <ol className="mx-auto mt-12 max-w-3xl border-l-2 border-brand-200 pl-8">
          {TIMELINE.map((t) => (
            <li key={t.year} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[41px] flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white ring-4 ring-cream">
                ●
              </span>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-900/5">
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-bold text-brand-700">{t.year}</span>
                  <h3 className="text-lg font-semibold text-brand-900">{t.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-14">
          <CTA
            title="次の1頭を救うために。"
            body="あなたの支援が、次の保護とリトレーニングを可能にします。"
            primary={{ label: "応援する", href: "/support" }}
            secondary={{ label: "馬たちを見る", href: "/horses" }}
          />
        </div>
      </Section>
    </>
  );
}
