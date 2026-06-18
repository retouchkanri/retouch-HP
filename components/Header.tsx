"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import SiteLink from "@/components/SiteLink";
import { isExternalUrl, NAV, SITE } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-50">
      <div
        className={`max-xl:fixed max-xl:inset-x-0 max-xl:top-0 z-50 bg-white transition-shadow duration-300 xl:sticky xl:top-0 ${
          scrolled || open ? "shadow-sm" : ""
        }`}
      >
        <div className="flex h-16 sm:h-20 items-center justify-between px-[5vw]">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Retouch（リタッチ）"
              width={234}
              height={48}
              className="h-10 sm:h-12 w-auto"
              priority
            />
          </Link>

          {/* PCナビ（全10メニュー） */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV.map((item) => {
              const active = isExternalUrl(item.href)
                ? false
                : item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <SiteLink
                  key={item.href}
                  href={item.href}
                  className="group relative px-2.5 py-2 text-center text-black transition-colors"
                >
                  <span className="block text-[13px] font-semibold leading-none whitespace-nowrap">
                    {item.label}
                  </span>
                  <span
                    className={`absolute left-2.5 right-2.5 -bottom-0.5 h-px bg-gold transition-transform origin-left ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </SiteLink>
              );
            })}
          </nav>

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 p-3"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
          >
            <span className={`h-0.5 w-6 bg-black transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-black transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-black transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* 固定ヘッダー分のスペーサー（モバイル） */}
      <div className="h-16 sm:h-20 xl:hidden" aria-hidden />

      {/* モバイルメニュー（ヘッダー直下に固定・一覧のみスクロール） */}
      <div
        className={`xl:hidden fixed inset-x-0 top-16 sm:top-20 z-40 overflow-y-auto border-t border-brand-900/10 bg-white transition-[opacity,visibility] duration-300 ${
          open
            ? "visible max-h-[calc(100dvh-4rem)] opacity-100 sm:max-h-[calc(100dvh-5rem)]"
            : "invisible max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-[5vw] py-4">
          {NAV.map((item) => (
            <SiteLink
              key={item.href}
              href={item.href}
              className="block border-b border-brand-900/5 py-3 text-base font-semibold text-black"
            >
              {item.label}
            </SiteLink>
          ))}
          <SiteLink href={SITE.membersUrl} className="btn-gold mt-5 w-full">
            応援する
          </SiteLink>
        </nav>
      </div>
    </header>
  );
}
