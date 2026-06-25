import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import SupportRanking from "@/components/SupportRanking";
import SupportStatusExplorer from "@/components/SupportStatusExplorer";
import { CTA } from "@/components/Blocks";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/site";
import { getHorses } from "@/lib/content";
import { TOTAL_PROTECTED_HORSES, monthlyOf, supportersOf } from "@/lib/horses";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export const metadata: Metadata = {
  title: "馬ごとの支援状況",
  description:
    "引退競走馬の支援状況一覧。retouch.salon の支援システムと連動した支援者数・月額支援から、いま応援を必要としている馬を探せます。",
};

export default async function SupportStatusPage() {
  const allHorses = await getHorses();
  const withSupport = allHorses.filter((h) => supportersOf(h) > 0);
  // retouch.salon 共有DBの実支援データの合計
  const totalMonthly = allHorses.reduce((sum, h) => sum + monthlyOf(h), 0);
  const totalSupporters = allHorses.reduce((sum, h) => sum + supportersOf(h), 0);

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
          lead={`現在 ${withSupport.length} 頭に、合計 ${totalSupporters} 件・月額 ${yen(totalMonthly)} のご支援をいただいています。（retouch.salon の支援システムと連動・リアルタイム表示）`}
        />
        <dl className="mt-8 grid grid-cols-3 gap-4">
          {[
            { label: "支援を受けている馬", value: `${withSupport.length}頭` },
            { label: "支援件数（のべ）", value: `${totalSupporters}件` },
            { label: "毎月の支援額", value: yen(totalMonthly) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-brand-900/5">
              <dd className="text-2xl font-bold text-brand-700 sm:text-3xl">{s.value}</dd>
              <dt className="mt-1 text-xs text-ink/55">{s.label}</dt>
            </div>
          ))}
        </dl>
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
          <SupportStatusExplorer horses={allHorses} />
        </div>
        <p className="mt-8 text-sm leading-relaxed text-ink/60">
          ※ 支援者数・月額支援・募集状況は
          <span className="mx-1 font-semibold text-brand-700">retouch.salon の支援システム</span>
          と連動して自動表示しています。写真・紹介文は
          <Link href="/admin" className="mx-1 text-gold hover:underline">管理画面</Link>
          から編集できます。
        </p>
      </Section>

      <Section alt>
        <CTA
          backgroundImage={IMG.ctaBg}
          title="この子の、力になりませんか。"
          body="一口オーナー制度や会員支援で、馬の飼養・再調教を支えることができます。"
          primary={{ label: "この子を支援する", href: SITE.horsesSupportUrl }}
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
