import Image from "next/image";
import Link from "next/link";
import SiteLink from "@/components/SiteLink";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/site";
import Placeholder from "@/components/Placeholder";

// ============================================================================
// 広告コンポーネント群 / Advertisement components
// クライアント要望「広告を多めに」に対応。協賛・寄付・募集の各種広告枠。
// ============================================================================

const toneMap = {
  green: "from-brand-700 to-brand-900",
  gold: "from-[#c79a4f] to-[#9a6b22]",
  dark: "from-ink to-brand-950",
};

// 横長バナー広告（PR帯）
export function AdBanner({
  badge = "SPONSORED",
  title,
  body,
  cta,
  href,
  image = IMG.bannerWide,
  tone = "green",
}: {
  badge?: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  image?: string;
  tone?: keyof typeof toneMap;
}) {
  return (
    <aside className="container-x my-12" aria-label="広告">
      <SiteLink
        href={href}
        className={`group relative block overflow-hidden rounded-2xl bg-gradient-to-r ${toneMap[tone]} shadow-lg`}
      >
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-7 sm:p-9">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold tracking-[0.25em] text-white">
              {badge}
            </span>
            <h3 className="mt-3 text-xl sm:text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{body}</p>
          </div>
          <span className="btn-white shrink-0">{cta} →</span>
        </div>
      </SiteLink>
    </aside>
  );
}

// 小型広告カード（3枠グリッド）
export function AdGrid() {
  const imageAds = [
    {
      src: IMG.adSponsor,
      href: "/partners#企業スポンサー募集",
      alt: "貴社のロゴをここに — 企業協賛のご案内",
      width: 1312,
      height: 1199,
    },
    {
      src: IMG.adFurusato,
      href: SITE.membersUrl,
      alt: "1頭まるごと保護 — ふるさと納税のご案内",
      width: 1298,
      height: 1212,
    },
  ];

  const cardAd = {
    badge: "PR｜一口オーナー",
    title: "あなたが、馬のオーナーに",
    body: "月々の支援で引退馬の一口オーナーに。成長の様子をYouTubeや会員限定情報でお届けします。",
    cta: "オーナー制度",
      href: SITE.membersUrl,
    img: IMG.owner,
  };

  return (
    <aside className="container-x my-12" aria-label="広告">
      <p className="mb-4 text-center text-[10px] tracking-[0.3em] text-ink/40">
        — ADVERTISEMENT / 協賛・支援のご案内 —
      </p>
      <div className="grid gap-5 md:grid-cols-3">
        {imageAds.map((ad) => (
          <SiteLink key={ad.src} href={ad.href} className="block">
            <Image
              src={ad.src}
              alt={ad.alt}
              width={ad.width}
              height={ad.height}
              className="w-full h-auto"
            />
          </SiteLink>
        ))}
        <SiteLink href={cardAd.href} className="card group flex flex-col">
          <div className="relative h-40 overflow-hidden">
            <Placeholder label={cardAd.img} className="h-full w-full" />
            <span className="absolute top-3 left-3 rounded-full bg-brand-900/80 px-3 py-1 text-[10px] font-semibold tracking-wider text-white">
              {cardAd.badge}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="text-lg font-semibold text-brand-900">{cardAd.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">{cardAd.body}</p>
            <span className="mt-4 text-sm font-semibold text-gold">{cardAd.cta} →</span>
          </div>
        </SiteLink>
      </div>
    </aside>
  );
}

// 縦長サイドバー広告（記事横などに）
export function AdSidebar() {
  return (
    <aside className="space-y-5" aria-label="広告">
      <div className="card p-5 text-center">
        <span className="text-[10px] tracking-[0.3em] text-ink/40">ADVERTISEMENT</span>
        <Placeholder label={IMG.riding} className="mt-3 h-44 w-full rounded-xl" />
        <h4 className="mt-4 text-lg font-semibold text-brand-900">乗馬体験を、ここから</h4>
        <p className="mt-2 text-sm text-ink/70">
          保護馬が第二の馬生を歩む乗馬クラブ。見学会・体験乗馬を受付中です。
        </p>
        <Link href="/contact" className="btn-primary mt-4 w-full">体験を申し込む</Link>
      </div>
      <div className="card p-5 text-center bg-brand-800 text-brand-50">
        <span className="text-[10px] tracking-[0.3em] text-brand-300">SPONSORED</span>
        <h4 className="mt-3 text-lg font-semibold text-white">法人協賛 募集中</h4>
        <p className="mt-2 text-sm text-brand-100">
          年間協賛で、馬たちの飼養・治療費を継続支援。広報での掲出も。
        </p>
        <Link href="/partners" className="btn-gold mt-4 w-full">資料を請求</Link>
      </div>
    </aside>
  );
}
