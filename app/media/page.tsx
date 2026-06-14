import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { IMG } from "@/lib/images";
import { MEDIA, NEWS } from "@/lib/data";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { CTA } from "@/components/Blocks";
import { AdBanner } from "@/components/Ads";
import MediaCard from "@/components/MediaCard";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = {
  title: {
    absolute: "引退馬問題への取材依頼・メディア掲載／引退競走馬の問題・社会課題",
  },
  description:
    "引退馬に関する記事、取材依頼については、Retouch（リタッチ）として全面協力させて頂きます。現在の引退馬問題に関する取材・記事掲載をお願いいたします。大阪・千葉・東京での打ち合わせ可能。",
  keywords: [
    "取材",
    "記事",
    "プレスリリース",
    "引退馬",
    "競馬",
    "引退競走馬",
    "情報",
    "JRA",
  ],
};

const CAREER = [
  "小学生で乗馬と出会い、大阪・杉谷乗馬クラブで研鑽。全日本ジュニア選手権・国民体育大会に出場。",
  "日本大学法学部（政治経済学科）／日本大学馬術部。1996年、全日本学生馬術選手権大会・全日本学生総合馬術の両大会で優勝、学生ランキング2位。",
  "株式会社馬事学院を設立。東関東馬事専門学院・東関東馬事高等学院を運営し、馬産業の人材を育成・輩出。",
  "未経験からJRA騎手・厩務員を輩出。全国の牧場・乗馬クラブ・観光牧場へ多くの人材を送り出す。",
  "引退競走馬の再調教・乗馬転用に取り組み、年間60頭以上を乗馬クラブへ。引退馬保護団体 Retouch 代表に就任。",
];

export default function MediaPage() {
  return (
    <>
      <PageHero
        eyebrow="MEDIA"
        title="メディア・取材"
        subtitle="報道関係者の皆さまへ。取材・写真素材のご案内。"
        image={IMG.heroRacehorse}
        backgroundImage={IMG.mediaHeroBg}
        crumbs={[{ label: "メディア・取材" }]}
      />

      {/* メディア掲載実績 */}
      <Section id="メディア掲載実績" alt>
        <SectionHeading eyebrow="PRESS" title="メディア掲載実績" lead="新聞・テレビ・Web・専門誌など、多数のメディアで取り上げられています。" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEDIA.map((m) => (
            <MediaCard key={`${m.date}-${m.title}`} item={m} />
          ))}
        </div>
      </Section>

      {/* プレスリリース */}
      <Section id="プレスリリース">
        <SectionHeading eyebrow="NEWS RELEASE" title="プレスリリース" />
        <ul className="mt-8 divide-y divide-brand-900/10">
          {NEWS.map((n) => (
            <li key={n.title} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4">
              <time className="text-sm text-ink/50">{n.date}</time>
              <span className="rounded-full bg-brand-100 px-3 py-0.5 text-[11px] font-semibold text-brand-700">{n.category}</span>
              <p className="text-sm text-ink/80">{n.title}</p>
            </li>
          ))}
        </ul>
      </Section>

      <AdBanner
        badge="FOR MEDIA"
        title="特集・密着取材を歓迎しています。"
        body="保護の現場、再調教、見学会、代表インタビューなど。引退馬問題を社会に伝える取材にご協力します。"
        cta="取材を依頼する"
        href="#取材依頼"
        tone="dark"
      />

      {/* 取材依頼 & 写真素材 */}
      <Section alt>
        <div className="grid gap-8 lg:grid-cols-2">
          <div id="取材依頼" className="scroll-mt-28 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand-900/5">
            <p className="eyebrow">INTERVIEW</p>
            <h3 className="mt-3 section-title !text-2xl">取材依頼</h3>
            <p className="section-lead mt-4">
              引退馬問題、保護活動、代表・{SITE.ceo}へのインタビューなど、
              取材のご相談を承ります。現場での撮影や見学会の同行も可能です。
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ink/80">
              <li>・保護・再調教の現場取材（千葉・大阪）</li>
              <li>・代表インタビュー／専門的なコメント提供</li>
              <li>・見学会・イベントへの取材同行</li>
            </ul>
            <Link href="/contact" className="btn-primary mt-7">取材を依頼する</Link>
          </div>
          <div id="写真素材" className="scroll-mt-28 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand-900/5">
            <p className="eyebrow">PHOTO</p>
            <h3 className="mt-3 section-title !text-2xl">写真素材</h3>
            <p className="section-lead mt-4">
              報道目的での写真素材のご提供が可能です。保護馬・再調教・活動風景など、
              用途に応じてご相談ください（クレジット表記をお願いします）。
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[IMG.rescue, IMG.retrain, IMG.riding, IMG.pasture, IMG.training, IMG.heroField].map((src, i) => (
                <Placeholder key={i} label={src} className="aspect-square w-full" />
              ))}
            </div>
            <Link href="/contact" className="btn-outline mt-7">素材を請求する</Link>
          </div>
        </div>
      </Section>

      {/* 代表プロフィール */}
      <Section id="代表プロフィール">
        <SectionHeading eyebrow="PROFILE" title="代表プロフィール" />
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <Image
              src={IMG.ceoPhoto}
              alt={`代表 ${SITE.ceo}`}
              width={IMG.ceoPhotoSize.width}
              height={IMG.ceoPhotoSize.height}
              className="block w-full h-auto"
              sizes="(max-width: 1024px) 90vw, 280px"
            />
            <div className="bg-brand-800 p-5 text-center text-white">
              <p className="text-lg font-semibold">{SITE.ceo}</p>
              <p className="mt-1 text-xs text-brand-200">{SITE.ceoRole}</p>
            </div>
          </div>
          <div>
            <p className="section-lead">
              競馬・乗馬の両分野で人材を育成してきた、馬のプロフェッショナル。
              選手として日本一を経験し、指導者・経営者として馬産業を支えてきた
              知見を、いま引退馬を救う活動へと注いでいます。
            </p>
            <ol className="mt-8 space-y-5 border-l-2 border-brand-200 pl-6">
              {CAREER.map((c, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-gold ring-4 ring-cream" />
                  <p className="text-sm leading-relaxed text-ink/80">{c}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-14">
          <CTA
            backgroundImage={IMG.ctaBg}
            title="取材・お問い合わせはこちら"
            primary={{ label: "お問い合わせ", href: "/contact" }}
            secondary={{ label: "活動実績を見る", href: "/impact" }}
          />
        </div>
      </Section>
    </>
  );
}
