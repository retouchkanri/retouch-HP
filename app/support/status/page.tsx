import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import SupportRanking from "@/components/SupportRanking";
import SupportStatusExplorer from "@/components/SupportStatusExplorer";
import { CTA } from "@/components/Blocks";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/site";
import { TOTAL_PROTECTED_HORSES, HORSES_WITH_SUPPORT } from "@/lib/horses";

export const metadata: Metadata = {
  title: "馬ごとの支援状況",
  description:
    "引退競走馬53頭の支援状況一覧。月間支援の達成率・支援者数から、いま応援を必要としている馬を探せます。",
};

export default function SupportStatusPage() {
  return (
    <>
      <PageHero
        eyebrow="SUPPORT STATUS"
        title="馬ごとの支援状況"
        subtitle="一頭ごとの月間支援の達成状況を公開しています。"
        image="Retouchの保護馬と支援者"
        backgroundImage={IMG.supportHeroBg}
        crumbs={[
          { label: "応援する", href: "/support" },
          { label: "支援状況" },
        ]}
      />

      <Section alt>
        <SectionHeading
          eyebrow="OVERVIEW"
          title={`累計${TOTAL_PROTECTED_HORSES}頭の保護実績`}
          lead={`現在、支援データが登録されているのは ${HORSES_WITH_SUPPORT.length} 頭です。支援口数・金額は retouch.salon の実績を lib/data.ts に反映して更新します（ランキング順位・達成率はデータ更新時に自動計算）。`}
        />
        <div className="mt-10">
          <SupportRanking />
        </div>
      </Section>

      <Section id="すべての支援状況">
        <SectionHeading
          eyebrow="ALL HORSES"
          title="すべての馬の支援状況"
          lead="カテゴリーや並び替えから、応援したい馬を探してください。馬名をクリックすると個別ページへ移動します。"
        />
        <div className="mt-10">
          <SupportStatusExplorer />
        </div>
        <p className="mt-8 text-sm leading-relaxed text-ink/60">
          ※ 写真・コメントの登録方法：各馬の名前・性別・写真（photo）・紹介文（story / note）・支援数値（goal / raised / supporters）は
          <code className="mx-1 rounded bg-brand-50 px-1.5 py-0.5 text-xs">lib/data.ts</code>
          の <code className="mx-1 rounded bg-brand-50 px-1.5 py-0.5 text-xs">HORSES</code> および
          <code className="mx-1 rounded bg-brand-50 px-1.5 py-0.5 text-xs">SUPPORT_HORSES</code>
          に追記してください。馬たちの紹介ページ（/horses）と支援状況は同じデータから自動連動します。
        </p>
      </Section>

      <Section alt>
        <CTA
          backgroundImage={IMG.ctaBg}
          title="この子の、力になりませんか。"
          body="一口オーナー制度や会員支援で、馬の飼養・再調教を支えることができます。"
          primary={{ label: "この子を支援する", href: SITE.donateUrl }}
          secondary={{ label: "応援する方法を見る", href: "/support" }}
        />
        <p className="mt-6 text-center text-sm text-ink/60">
          <Link href="/horses" className="text-gold hover:underline">
            馬たちの紹介ページへ
          </Link>
        </p>
      </Section>
    </>
  );
}
