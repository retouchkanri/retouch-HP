import type { Metadata } from "next";
import Image from "next/image";
import { IMG } from "@/lib/images";
import { SITE, STATS } from "@/lib/site";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { StatGrid, CTA } from "@/components/Blocks";
import { AdBanner } from "@/components/Ads";
import Placeholder from "@/components/Placeholder";
import YouTubeGrid from "@/components/YouTubeGrid";

export const metadata: Metadata = {
  title: "活動実績",
  description:
    "保護馬53頭、支援者600名超、YouTube登録者2万人超、署名5万人超、メディア掲載多数。数字が証明する、支援の力。",
};

const HIGHLIGHTS = [
  { id: "保護馬53頭", value: "53", unit: "頭", title: "累計保護馬", image: IMG.impactProtected, imageAlt: "保護馬の写真コラージュ",
    body: "肥育場・競馬場・牧場から救い出した馬の累計頭数。一頭ずつ、確かに命をつないできました。" },
  { id: "支援者600名超", value: "600", unit: "名超", title: "支援者・会員", image: IMG.impactSupporters, imageAlt: "全国の支援者・コミュニティの写真",
    body: "全国から集まった会員・サポーター。月々のご支援が、馬たちの飼養・治療・再調教を支えています。" },
  { id: "YouTube登録者2万人超", value: "2", unit: "万人超", title: "Youtube啓発活動", image: IMG.impactYoutube, imageAlt: "動画視聴風景／人気動画サムネイル",
    body: "Retouch専用のYoutubeチャンネルを活用し引退馬問題を取り上げています。" },
  { id: "署名5万人超", value: "5", unit: "万人超", title: "署名", image: IMG.impactPetition, imageAlt: "署名活動の様子（社会的インパクト）",
    body: "引退馬を守る制度づくりに向けた署名。農水省・JRA・地方競馬への提言を後押しする確かな声です。" },
];

const TIMELINE = [
  { year: "2021年5月", title: "引退馬保護プロジェクト始動", body: "前代表・林氏による肥育場の馬保護クラウドファンディングが完了。" },
  { year: "2021年6月", title: "Retouch発足", body: "引退馬支援団体「Retouch」を設立。" },
  { year: "2023年10月", title: "代表交代", body: "野口佳槻がRetouch代表に就任。" },
  { year: "2023年11月", title: "初めての馬を保護", body: "第1号パヴォーネ号、第2号ハル号を肥育場から保護。" },
  { year: "2023年12月", title: "情報発信スタート", body: "YouTubeおよびSNSでの活動を開始。" },
  { year: "2024年12月", title: "支援の輪が拡大", body: "Retouchメンバー150名突破。1口支援馬制度を開始。" },
  { year: "2025年2月", title: "啓発活動スタート", body: "YouTubeにて引退馬問題を伝えるシリーズ配信開始。" },
  { year: "2025年12月", title: "法人化", body: "大阪府河内長野市に株式会社リタッチを設立。" },
  { year: "2026年6月", title: "新たな挑戦へ", body: "メンバーズサイト・公式Webサイトをリニューアル。" },
];

// YouTube動画（メディア掲載枠に2行×3列で掲載。サムネイルクリックでその場で再生）
const YOUTUBE_VIDEOS = [
  { id: "ZfKCxojVmcU", title: "Retouchで保護された馬", thumb: "/v1.webp" },
  { id: "aOg5jTScgIQ", title: "馬予算2億→12.8億 なぜ？", thumb: "/v2.jpg" },
  { id: "Bxt9r3Qdq7", title: "日々消えゆく引退競走馬の命", thumb: "/v3.jpg" },
  { id: "TSBOdDUPegg", title: "JRAでは公表されない引退競走馬の最期", thumb: "/v4.webp" },
  { id: "CicKVV8uT0Y", title: "引退馬の再就職先 ホースセラピー", thumb: "/v5.jpg" },
  { id: "vVg-H1p3Nv", title: "引退競走馬を救いたい", thumb: "/v6.jpg" },
];

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="IMPACT"
        title="活動実績"
        subtitle="数字が証明する、支援の力。"
        image="保護された馬たちの集合写真"
        backgroundImage={IMG.impactHeroBg}
        crumbs={[{ label: "活動実績" }]}
      />

      {/* 大型カウンター */}
      <div className="bg-brand-900">
        <div className="container-x py-14">
          <p className="eyebrow !text-gold">BY THE NUMBERS</p>
          <h2 className="section-title mt-3 mb-10 !text-white">
            これまでの歩み
          </h2>
          <StatGrid stats={STATS} dark />
        </div>
      </div>

      {/* 各指標の詳細 */}
      {HIGHLIGHTS.map((h, i) => (
        <Section key={h.id} id={h.id} alt={i % 2 === 0}>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
              {h.image.startsWith("/") ? (
                <Image
                  src={h.image}
                  alt={h.imageAlt ?? ""}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              ) : (
                <Placeholder label={h.image} className="aspect-[4/3] w-full" />
              )}
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
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
          eyebrow="MEDIA"
          title="メディア掲載"
          lead="テレビ・新聞・Webなど、多くのメディアにRetouchの取り組みを取り上げていただいています。"
        />
        <YouTubeGrid videos={YOUTUBE_VIDEOS} />
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
        <SectionHeading eyebrow="HISTORY" title="活動の歩み（年表）" />
        <ol className="mx-auto mt-12 max-w-3xl border-l-2 border-brand-200 pl-8">
          {TIMELINE.map((t) => (
            <li key={t.year} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[41px] flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white ring-4 ring-cream">
                ●
              </span>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-900/5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
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
            backgroundImage={IMG.ctaBg}
            title="次の1頭を救うために。"
            body="あなたの支援が、次の保護とリトレーニングを可能にします。"
            primary={{ label: "応援する", href: SITE.donateUrl }}
            secondary={{ label: "馬たちを見る", href: "/horses" }}
          />
        </div>
      </Section>
    </>
  );
}
