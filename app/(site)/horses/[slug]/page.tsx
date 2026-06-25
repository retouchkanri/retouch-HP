import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import Placeholder from "@/components/Placeholder";
import SupportStatusBadge from "@/components/SupportStatusBadge";
import { CTA } from "@/components/Blocks";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/site";
import { getHorseBySlugDb, getHorses, supportRate } from "@/lib/content";
import { getHorseBySlug, getHorseSlugs, formatHorseMeta } from "@/lib/horses";

type Props = { params: Promise<{ slug: string }> };

// retouch.salon 共有DBの支援ステータス等を定期的に再取得（ISR）。
export const revalidate = 600;

// Keep static params for build-time pre-rendering using static horse slugs
export async function generateStaticParams() {
  const horses = await getHorses();
  if (horses.length > 0) {
    return horses.map((h) => ({ slug: h.slug }));
  }
  return getHorseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Try DB first, fall back to static
  const horse = (await getHorseBySlugDb(slug)) ?? getHorseBySlug(slug);
  if (!horse) return { title: "馬が見つかりません" };
  return {
    title: `${horse.name}｜支援状況`,
    description: `${horse.name}（${horse.sex}・${horse.age}）の支援状況と紹介。${horse.note ?? horse.story ?? ""}`,
  };
}

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export default async function HorseDetailPage({ params }: Props) {
  const { slug } = await params;
  const horse = (await getHorseBySlugDb(slug)) ?? getHorseBySlug(slug);
  if (!horse) notFound();

  const allHorses = await getHorses();
  const rate = supportRate(horse);
  const hasSupport = horse.goal > 0;
  // salon DBで明示的に受付停止の馬は支援ボタンを出さない（未連携=undefinedは従来通り）
  const canSupport = hasSupport && horse.isSupportable !== false;

  return (
    <>
      <PageHero
        eyebrow="HORSE PROFILE"
        title={horse.name}
        subtitle={`${formatHorseMeta(horse)} ｜ ${horse.statusLabel}`}
        image={`${horse.name}の写真`}
        backgroundImage={IMG.horsesHeroBg}
        crumbs={[
          { label: "馬たちの紹介", href: "/horses" },
          { label: "支援状況", href: "/support/status" },
          { label: horse.name },
        ]}
      />

      <Section alt>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            {horse.photo ? (
              <Image
                src={horse.photo}
                alt={horse.name}
                width={800}
                height={800}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            ) : (
              <Placeholder label={`${horse.name}の写真`} className="aspect-square w-full rounded-2xl" />
            )}
          </div>

          <div>
            <p className="eyebrow">PROFILE</p>
            <h2 className="section-title mt-3">{horse.name}</h2>
            <dl className="mt-6 space-y-3 text-sm">
              {horse.sex && (
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 font-semibold text-brand-800">性別</dt>
                  <dd>{horse.sex}</dd>
                </div>
              )}
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 font-semibold text-brand-800">年齢</dt>
                <dd>{horse.age}</dd>
              </div>
              {horse.order && (
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 font-semibold text-brand-800">保護順</dt>
                  <dd>肥育場から{horse.order}番目</dd>
                </div>
              )}
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 font-semibold text-brand-800">状態</dt>
                <dd className="flex flex-wrap items-center gap-2">
                  {horse.statusLabel}
                  <SupportStatusBadge isSupportable={horse.isSupportable} />
                </dd>
              </div>
            </dl>

            {horse.personality && (
              <p className="mt-6 text-sm">
                <span className="font-semibold text-brand-700">性格・特徴：</span>
                {horse.personality}
              </p>
            )}

            {horse.pendingDetails ? (
              <p className="section-lead mt-6">
                この馬の詳細情報（写真・コメント・支援数値）は順次公開予定です。
              </p>
            ) : (
              <>
                {horse.before && (
                  <div className="mt-6 rounded-2xl bg-ink/5 p-5">
                    <span className="text-[11px] font-bold tracking-widest text-ink/50">BEFORE</span>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">{horse.before}</p>
                  </div>
                )}
                {(horse.story || horse.note) && (
                  <p className="section-lead mt-6">{horse.story ?? horse.note}</p>
                )}
              </>
            )}
          </div>
        </div>
      </Section>

      <Section id="支援状況">
        <SectionHeading
          eyebrow="SUPPORT STATUS"
          title="この子の支援状況"
          lead="月間支援の達成状況です。"
        />

        {hasSupport ? (
          <div className="mt-8 max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand-900/5">
            <div className="flex items-end justify-between">
              <span className="text-sm font-semibold text-brand-800">月間支援</span>
              <span className="text-2xl font-bold text-brand-700">
                {rate}%
                <span className="ml-1 text-sm font-normal text-ink/50">達成</span>
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-brand-100">
              <div className="h-full rounded-full bg-gold" style={{ width: `${rate}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm text-ink/70">
              <span>{yen(horse.raised)} / {yen(horse.goal)}</span>
              <span>支援者 {horse.supporters}名</span>
            </div>
            {canSupport ? (
              <a href={SITE.donateUrl} target="_blank" rel="noopener noreferrer" className="btn-gold mt-8">
                この子を支援する
              </a>
            ) : (
              <p className="mt-8 text-sm text-ink/60">
                現在、この馬の新規支援の受付を停止しています。
              </p>
            )}
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink/60">支援状況データは準備中です。</p>
        )}
      </Section>

      <Section alt>
        <CTA
          title="他の馬の支援状況も見る"
          body={`Retouchでは累計${allHorses.length}頭の引退競走馬を保護しています。`}
          primary={{ label: "支援状況一覧へ", href: "/support/status" }}
          secondary={{ label: "馬たちの紹介へ", href: "/horses" }}
        />
      </Section>
    </>
  );
}
