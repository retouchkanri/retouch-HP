import Image from "next/image";
import Link from "next/link";
import InfoLinks from "@/components/InfoLinks";
import SiteLink from "@/components/SiteLink";
import SocialLinks from "@/components/SocialLinks";
import { IMG } from "@/lib/images";
import { NAV, SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-6 overflow-x-clip bg-brand-900 text-brand-100 sm:mt-24">
      {/* 引退馬の森 案内（提携牧場） */}
      <InfoLinks />

      {/* 上部CTA帯 */}
      <div className="relative h-[32dvh] min-h-[200px] max-h-[300px] w-full overflow-hidden sm:h-[50dvh] sm:min-h-[240px] sm:max-h-none">
        <Image
          src={IMG.contactCta}
          alt=""
          fill
          className="object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand-950/60 sm:bg-transparent" aria-hidden />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <p className="eyebrow !text-gold">JOIN US</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">
            あなたの応援が、一頭の命をつなぎます。
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <SiteLink href={SITE.membersUrl} className="btn-gold">会員になって支援する</SiteLink>
            <Link href="/contact" className="btn-white">お問い合わせ</Link>
          </div>
        </div>
      </div>

      <div className="container-x min-w-0 py-8 grid gap-8 sm:py-14 md:grid-cols-[1.3fr_2fr] md:gap-10">
        <div className="min-w-0">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Retouch（リタッチ）"
              width={195}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
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
          <div className="mt-6">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-400">FOLLOW US</p>
            <SocialLinks className="mt-3" />
          </div>
        </div>

        <nav className="grid min-w-0 grid-cols-1 gap-y-0.5 self-start text-sm sm:grid-cols-2 sm:gap-x-6">
          {NAV.map((item) => (
            <SiteLink
              key={item.href}
              href={item.href}
              className="block min-w-0 border-b border-white/5 py-2.5 text-brand-200 transition-colors hover:text-white"
            >
              {item.label}
            </SiteLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x min-w-0 py-5 flex flex-col items-center gap-3 text-center text-xs leading-relaxed text-brand-300 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="max-w-full break-words">© {new Date().getFullYear()} Retouch（リタッチ）All Rights Reserved.</p>
          <p className="max-w-full break-words text-balance sm:tracking-wider">命をつなぐ。引退競走馬と、人と、地域の未来へ。</p>
        </div>
      </div>
    </footer>
  );
}
