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
import SupportMinUnitsAppeal from "@/components/SupportMinUnitsAppeal";
import { salonHorseSupportUrl } from "@/lib/salon";
import { getHorseBySlugDb, getHorses } from "@/lib/content";
import {
  getHorseBySlug,
  getHorseSlugs,
  formatHorseMeta,
  formatHorseName,
  formatUnits,
  monthlyOf,
  supportersOf,
  TOTAL_SUPPORT_AMOUNT_LABEL,
  supportUnitsOf,
  hasSupport as horseHasSupport,
  canAcceptSupport,
  isOwnerHorse,
} from "@/lib/horses";

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
  const displayName = formatHorseName(horse);
  return {
    title: `${displayName}｜支援状況`,
    description: `${displayName}（${horse.sex}・${horse.age}）の支援状況と紹介。${horse.note ?? horse.story ?? ""}`,
  };
}

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export default async function HorseDetailPage({ params }: Props) {
  const { slug } = await params;
  const horse = (await getHorseBySlugDb(slug)) ?? getHorseBySlug(slug);
  if (!horse) notFound();

  const allHorses = await getHorses();
  // retouch.salon 共有DBの実支援データ
  const supporters = supportersOf(horse);
  const monthly = monthlyOf(horse);
  const units = supportUnitsOf(horse);
  const hasSupport = horseHasSupport(horse);
  const canSupport = canAcceptSupport(horse);
  const isOwner = isOwnerHorse(horse);

  const displayName = formatHorseName(horse);

  return (
    <>
      <PageHero
        eyebrow="HORSE PROFILE"
        title={displayName}
        subtitle={`${formatHorseMeta(horse)} ｜ ${horse.statusLabel}`}
        image={`${displayName}の写真`}
        backgroundImage={IMG.horsesHeroBg}
        crumbs={[
          { label: "馬たちの紹介", href: "/horses" },
          { label: "支援状況", href: "/support/status" },
          { label: displayName },
        ]}
      />

      <Section alt>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            {horse.photo ? (
              <Image
                src={horse.photo}
                alt={displayName}
                width={800}
                height={800}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            ) : (
              <Placeholder label={`${displayName}の写真`} className="aspect-square w-full rounded-2xl" />
            )}
          </div>

          <div>
            <p className="eyebrow">PROFILE</p>
            <h2 className="section-title mt-3">{displayName}</h2>
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
                  <SupportStatusBadge isSupportable={isOwner ? undefined : horse.isSupportable} />
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
          lead="retouch.salon の支援システムと連動した、現在の支援状況です。金額はすべての支援者からの合計を表示しています。"
        />

        <SupportMinUnitsAppeal className="mt-6" />

        {hasSupport ? (
          <div className="mt-8 max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand-900/5">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-bold text-brand-700">{supporters}<span className="ml-1 text-base font-normal text-ink/50">名</span></p>
                <p className="mt-1 text-xs text-ink/50">現在の支援者</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-700">{yen(monthly)}</p>
                <p className="mt-1 text-xs text-ink/50">{TOTAL_SUPPORT_AMOUNT_LABEL}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-700">{formatUnits(units)}<span className="ml-1 text-base font-normal text-ink/50">口</span></p>
                <p className="mt-1 text-xs text-ink/50">支援口数</p>
              </div>
            </div>
            <SupportMinUnitsAppeal variant="meter" horse={horse} className="mt-6" />
            {canSupport ? (
              <a href={salonHorseSupportUrl(horse)} target="_blank" rel="noopener noreferrer" className="btn-gold mt-8">
                この子を支援する
              </a>
            ) : isOwner ? (
              <p className="mt-8 text-sm text-ink/60">
                オーナーが決まっており、新規支援は不要です。これまでの支援に感謝しています。
              </p>
            ) : (
              <p className="mt-8 text-sm text-ink/60">
                現在、この馬の新規支援の受付を停止しています。
              </p>
            )}
          </div>
        ) : canSupport ? (
          <div className="mt-8 max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand-900/5">
            <p className="text-sm text-ink/70">
              この子はまだ支援者がいません。最初のサポーターになりませんか。
            </p>
            <SupportMinUnitsAppeal variant="meter" horse={horse} className="mt-5" />
            <a href={salonHorseSupportUrl(horse)} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6">
              この子を支援する
            </a>
          </div>
        ) : isOwner ? (
          <p className="mt-6 text-sm text-ink/60">
            オーナーが決まっており、新規支援は不要です。
          </p>
        ) : horse.isSupportable === false ? (
          <p className="mt-6 text-sm text-ink/60">現在、この馬の新規支援の受付を停止しています。</p>
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
