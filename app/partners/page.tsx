import type { Metadata } from "next";
import Image from "next/image";
import { IMG } from "@/lib/images";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { CTA } from "@/components/Blocks";
import { AdBanner } from "@/components/Ads";

export const metadata: Metadata = {
  title: "共に未来を創る",
  description: "企業スポンサー募集、行政連携、乗馬クラブ募集、観光牧場募集、学校・教育機関との連携。Retouchのパートナーシップ。",
};

const PARTNERS = [
  { id: "企業スポンサー募集", title: "企業スポンサー募集", image: IMG.partnerSponsor, imageAlt: "企業スポンサー・CSR活動",
    body: "CSR・SDGsの取り組みとして、Retouchの活動をご支援ください。年間協賛で馬たちの飼養・治療・再調教を継続的に支えます。",
    benefits: ["公式サイト・SNS・動画でのロゴ掲出", "社員参加型の体験・見学プログラム", "活動報告・社会貢献実績の共有"] },
  { id: "行政連携", title: "行政連携", image: IMG.partnerGovernment, imageAlt: "行政連携・地域振興",
    body: "ふるさと納税や地域振興、動物福祉・教育施策での連携を進めています。馬を核とした地域づくりを、行政の皆さまとともに。",
    benefits: ["ふるさと納税の返礼・寄付メニュー", "地域イベント・観光誘客の協働", "動物福祉・教育プログラムの提供"] },
  { id: "乗馬クラブ募集", title: "乗馬クラブ募集", image: IMG.partnerRidingClub, imageAlt: "乗馬クラブ・再調教済み馬の譲渡",
    body: "再調教を終えた卒業馬の受け入れ先となる乗馬クラブを募集しています。馬事学院（バジガク）の調教ノウハウとともに、安心の譲渡を。",
    benefits: ["再調教済みの乗用馬の受け入れ", "調教・人材面でのサポート", "継続的なフォローアップ"] },
  { id: "観光牧場募集", title: "観光牧場募集", image: IMG.partnerTourism, imageAlt: "観光牧場・ふれあい体験",
    body: "ふれあい・観光の現場で活躍できる馬の受け入れ先を募集。馬のいる風景が、牧場の新たな魅力と集客につながります。",
    benefits: ["ふれあい・観光向きの馬の紹介", "見学会・体験イベントの共同開催", "集客・広報での相互連携"] },
  { id: "学校・教育機関との連携", title: "学校・教育機関との連携", image: IMG.partnerEducation, imageAlt: "学校・教育機関との連携",
    body: "命の教育、職業教育、馬術・厩務の実習など。馬事学院での実績を活かし、学校・教育機関との多彩な連携を行います。",
    benefits: ["出張授業・体験学習", "職業教育・インターンシップ", "馬術・厩務の実践プログラム"] },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="PARTNERS"
        title="共に未来を創る"
        subtitle="一団体だけでは、救える数に限りがあります。だから、あなたと。"
        image={IMG.community}
        backgroundImage={IMG.partnersHeroBg}
        crumbs={[{ label: "共に未来を創る" }]}
      />

      <Section alt>
        <SectionHeading
          eyebrow="PARTNERSHIP"
          title="馬と地域の未来を、ともに。"
          lead="企業・行政・乗馬クラブ・観光牧場・教育機関。さまざまな立場のパートナーと手を取り合い、引退馬が活きる社会の仕組みを広げていきます。"
        />
      </Section>

      {PARTNERS.map((p, i) => (
        <div key={p.id}>
          <Section id={p.id} alt={i % 2 === 1}>
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                <p className="eyebrow">{`PARTNER 0${i + 1}`}</p>
                <h3 className="mt-3 section-title !text-2xl sm:!text-3xl">{p.title}</h3>
                <p className="section-lead mt-5">{p.body}</p>
                <ul className="mt-6 space-y-3">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 rounded-xl bg-white p-4 text-sm text-ink/80 shadow-sm ring-1 ring-brand-900/5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
          {i === 1 && (
            <AdBanner
              badge="SPONSORED"
              title="まずは、お気軽にご相談を。"
              body="連携の形は一社ごとに異なります。資料請求・オンライン面談など、最適なご提案をいたします。"
              cta="パートナー相談はこちら"
              href="/contact"
              tone="gold"
            />
          )}
        </div>
      ))}

      <Section>
        <CTA
          title="その一歩が、馬たちの未来を変える。"
          body="協賛・連携に関するご相談、資料のご請求は、お問い合わせフォームよりお気軽にご連絡ください。"
          primary={{ label: "パートナーを相談する", href: "/contact" }}
          secondary={{ label: "活動実績を見る", href: "/impact" }}
        />
      </Section>
    </>
  );
}
