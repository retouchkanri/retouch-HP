import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 bg-brand-900 text-brand-100">
      {/* 上部CTA帯 */}
      <div className="relative overflow-hidden bg-brand-950">
        <div className="relative container-x py-14 text-center">
          <p className="eyebrow !text-gold">JOIN US</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">
            あなたの応援が、一頭の命をつなぎます。
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href="/support" className="btn-gold">会員になって支援する</Link>
            <Link href="/contact" className="btn-white">お問い合わせ</Link>
          </div>
        </div>
      </div>

      <div className="container-x py-14 grid gap-10 md:grid-cols-[1.3fr_2fr]">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-[0.15em] text-white">Retouch</span>
            <span className="text-xs text-brand-300">リタッチ</span>
          </div>
          <p className="mt-4 text-sm leading-loose text-brand-200">
            {SITE.tagline}
            <br />
            肥育場で過ごす引退競走馬を救出し、再調教を通じて
            <br className="hidden sm:block" />
            人と共に生きる新しい道へ。
          </p>
          <dl className="mt-6 space-y-1 text-sm text-brand-200">
            <div>代表：{SITE.ceo}（{SITE.ceoRole}）</div>
            <div>設立：{SITE.founded}</div>
            {SITE.addresses.map((a) => (
              <div key={a}>{a}</div>
            ))}
          </dl>
          <a
            href={SITE.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-sm text-gold hover:underline"
          >
            ▶ 公式YouTubeチャンネル
          </a>
        </div>

        <nav className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-brand-200 hover:text-white transition-colors"
            >
              {item.label}
              <span className="block text-[10px] tracking-widest text-brand-400">
                {item.labelEn}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-300">
          <p>© {new Date().getFullYear()} Retouch（リタッチ）All Rights Reserved.</p>
          <p className="tracking-wider">命をつなぐ。引退競走馬と、人と、地域の未来へ。</p>
        </div>
      </div>
    </footer>
  );
}
