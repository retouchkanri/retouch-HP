import Image from "next/image";
import Link from "next/link";
import SiteLink from "@/components/SiteLink";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/site";

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
// 河内長野市ふるさと納税「Retouch 引退馬支援」ページの実画像・テキストを掲載。
const RAKUTEN_FURUSATO_URL =
  "https://item.rakuten.co.jp/f272167-kawachinagano/15152-40001191/";

export function AdGrid() {
  const cards = [
    {
      badge: "PR｜企業協賛",
      title: "協賛企業募集",
      body: "引退競走馬の未来を、企業の力で。CSR活動を通じて、馬と地域の未来づくりを応援できます。",
      cta: "協賛について",
      href: "/partners#企業スポンサー募集",
      img: "https://image.rakuten.co.jp/f272167-kawachinagano/cabinet/12758671/6954bb51ae4d09551771.jpg",
      alt: "ご寄附のお礼として救われた馬たちと触れ合う来場者",
    },
    {
      badge: "PR｜ふるさと納税",
      title: "個人納税支援",
      body: "大阪府河内長野市の「ふるさと納税」で引退競走馬の保護を直接支援。返礼として馬に会える。",
      cta: "詳しく見る",
      href: RAKUTEN_FURUSATO_URL,
      img: "https://image.rakuten.co.jp/f272167-kawachinagano/cabinet/12758671/6954bb23155cf6473940.jpg",
      alt: "ふるさと納税で引退馬を救う — 救われた馬とふれあう返礼",
    },
    {
      badge: "PR｜一口支援馬",
      title: "馬の未来支援",
      body: "月額支援を通じ引退競走馬の命と新たな活躍の場を応援。月額支援で本来もう無い命を支える。",
      cta: "一口支援制度",
      href: SITE.membersUrl,
      img: "https://image.rakuten.co.jp/f272167-kawachinagano/cabinet/12758671/6954bb41d90065029866.jpg",
      alt: "皆さまのご寄附が、馬たちを引き取る資金となります",
    },
  ];

  return (
    <aside className="container-x my-12" aria-label="広告">
      <p className="mb-4 text-center text-[10px] tracking-[0.3em] text-ink/40">
        — ADVERTISEMENT / 協賛・支援のご案内 —
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <SiteLink key={card.title} href={card.href} className="card group flex flex-col">
            <div className="relative overflow-hidden bg-brand-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.img}
                alt={card.alt}
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <span className="absolute top-2 left-2 max-w-[calc(100%-1rem)] rounded-full bg-brand-900/80 px-2 py-0.5 text-[9px] font-semibold leading-tight tracking-wider text-white sm:top-3 sm:left-3 sm:px-3 sm:py-1 sm:text-[10px]">
                {card.badge}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-semibold text-brand-900">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">{card.body}</p>
              <span className="mt-4 text-sm font-semibold text-gold">{card.cta} →</span>
            </div>
          </SiteLink>
        ))}
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
        <Image
          src={IMG.adRiding}
          alt="乗馬を楽しむ様子（日本人ライダーと馬）"
          width={800}
          height={600}
          className="mt-3 w-full h-auto"
        />
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
