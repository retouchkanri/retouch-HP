import type { Metadata } from "next";
import Link from "next/link";
import { HORSES } from "@/lib/data";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/site";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { HorseCard, CTA } from "@/components/Blocks";
import Placeholder from "@/components/Placeholder";
import HorseExplorer from "@/components/HorseExplorer";

export const metadata: Metadata = {
  title: "馬たちの紹介",
  description:
    "現在の保護馬、卒業馬、オーナー決定馬、馬たちの物語、支援中の馬を探す。一頭一頭に、物語がある。",
};

const protectedHorses = HORSES.filter((h) => h.status === "protected");
const graduatedHorses = HORSES.filter((h) => h.status === "graduated");
const ownerHorses = HORSES.filter((h) => h.status === "owner");
const featured = graduatedHorses[0]; // 馬たちの物語の特集馬

const NAV = [
  { id: "現在の保護馬", label: "現在の保護馬" },
  { id: "卒業馬", label: "卒業馬" },
  { id: "オーナー決定馬", label: "オーナー決定馬" },
  { id: "馬たちの物語", label: "馬たちの物語" },
  { id: "支援中の馬を探す", label: "支援中の馬を探す" },
];

export default function HorsesPage() {
  return (
    <>
      <PageHero
        eyebrow="HORSES"
        title="馬たちの紹介"
        subtitle="一頭一頭に、物語がある。"
        image="Retouchの馬たちが牧場で過ごす風景"
        backgroundImage={IMG.horsesHeroBg}
        crumbs={[{ label: "馬たちの紹介" }]}
      />

      {/* カテゴリーナビ */}
      <div className="sticky top-16 sm:top-20 z-30 bg-cream/95 backdrop-blur border-b border-brand-900/10">
        <div className="container-x flex flex-wrap gap-2 py-3">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="rounded-full border border-brand-600/30 px-4 py-1.5 text-sm text-brand-800 hover:bg-brand-50"
            >
              {n.label}
            </a>
          ))}
        </div>
      </div>

      {/* 現在の保護馬 */}
      <Section id="現在の保護馬" alt>
        <SectionHeading
          eyebrow="PROTECTED"
          title={`現在の保護馬（${protectedHorses.length}頭）`}
          lead="いま、Retouchの拠点で再調教を進めている馬たち。名前・年齢・性格・現在の様子をご紹介します。"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {protectedHorses.map((h) => (
            <HorseCard key={h.name} horse={h} />
          ))}
        </div>
      </Section>

      {/* 卒業馬（Before → After） */}
      <Section id="卒業馬">
        <SectionHeading
          eyebrow="GRADUATES"
          title="卒業馬"
          lead="新しい生活を送る馬たち。保護前（Before）から現在（After）へ、歩んできた道のりをご紹介します。"
        />
        <div className="mt-10 space-y-6">
          {graduatedHorses.map((h) => (
            <article
              key={h.name}
              className="grid items-stretch gap-0 overflow-hidden rounded-3xl shadow-sm ring-1 ring-brand-900/5 lg:grid-cols-[300px_1fr]"
            >
              <Placeholder label={`${h.name} の写真`} className="min-h-[200px] w-full" />
              <div className="bg-white p-7">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold text-brand-900">{h.name}</h3>
                  <span className="text-xs text-ink/50">{h.sex}・{h.age}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-brand-600">性格：{h.personality}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-ink/5 p-5">
                    <span className="text-[11px] font-bold tracking-widest text-ink/50">BEFORE</span>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">{h.before}</p>
                  </div>
                  <div className="rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-200">
                    <span className="text-[11px] font-bold tracking-widest text-brand-600">AFTER</span>
                    <p className="mt-2 text-sm leading-relaxed text-brand-900">{h.story}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* オーナー決定馬 */}
      <Section id="オーナー決定馬" alt>
        <SectionHeading
          eyebrow="WITH OWNERS"
          title="オーナー決定馬"
          lead="一口オーナー制度を通じて、支援者に見守られながら成長する馬たち。それぞれのオーナーストーリーをご紹介します。"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {ownerHorses.map((h) => (
            <article key={h.name} className="grid gap-0 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-brand-900/5 sm:grid-cols-[200px_1fr]">
              <Placeholder label={`支援者と${h.name}の写真`} className="min-h-[180px] w-full" />
              <div className="p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-brand-900">{h.name}</h3>
                  <span className="text-xs text-ink/50">{h.sex}・{h.age}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-brand-600">性格：{h.personality}</p>
                <div className="mt-4 rounded-2xl bg-brand-50 p-4">
                  <span className="text-[11px] font-bold tracking-widest text-gold">OWNER STORY</span>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">{h.ownerStory}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* 馬たちの物語（特集記事形式：保護前 → 保護 → 現在） */}
      {featured && (
        <Section id="馬たちの物語">
          <SectionHeading
            eyebrow="THEIR STORIES"
            title="馬たちの物語"
            lead={`特集：${featured.name}が歩んだ、保護前から現在までの物語。`}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { step: "保護前", body: featured.before ?? "行き場を失い、命の期限が迫っていました。" },
              { step: "保護", body: "Retouchが引き取り、健康管理とリトレーニングを開始しました。" },
              { step: "現在", body: featured.story },
            ].map((s, i) => (
              <div key={s.step} className="relative rounded-3xl bg-white p-7 shadow-sm ring-1 ring-brand-900/5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-brand-900">{s.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="https://www.youtube.com/@Retouch2023"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              ▶ YouTubeで物語を見る
            </a>
          </div>
        </Section>
      )}

      {/* 支援中の馬を探す（検索機能） */}
      <Section id="支援中の馬を探す" alt>
        <SectionHeading
          eyebrow="SEARCH"
          title="支援中の馬を探す"
          lead="年齢・性別・カテゴリーから、応援したい馬を探せます。"
        />
        <div className="mt-10">
          <HorseExplorer horses={HORSES} />
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <CTA
          title="この子の、力になりませんか。"
          body="一口オーナー制度や会員支援で、馬の飼養・再調教を支えることができます。"
          primary={{ label: "この子を支援する", href: SITE.membersUrl }}
          secondary={{ label: "会員になる", href: SITE.membersUrl }}
        />
      </Section>
    </>
  );
}
