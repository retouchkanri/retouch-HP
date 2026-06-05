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
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
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
                className={`group relative px-2.5 py-2 text-center transition-colors ${
                  active ? "text-black" : "text-black/80 hover:text-black"
                }`}
              >
                <span className="block text-[12px] font-medium leading-none whitespace-nowrap">
                  {item.label}
                </span>
                <span className="mt-1 block text-[9px] tracking-[0.15em] text-black/50">
                  {item.labelEn}
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
          className="xl:hidden flex flex-col gap-1.5 p-2"
          aria-label="メニュー"
        >
          <span className={`h-0.5 w-6 bg-black transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-black transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-black transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* モバイルメニュー（全10メニュー） */}
      <div
        className={`xl:hidden overflow-hidden bg-white border-t border-brand-900/10 transition-[max-height] duration-500 ${
          open ? "max-h-[85vh] overflow-y-auto" : "max-h-0"
        }`}
      >
        <nav className="px-[5vw] py-4 flex flex-col">
          {NAV.map((item) => (
            <SiteLink
              key={item.href}
              href={item.href}
              className="flex items-baseline justify-between py-3 border-b border-brand-900/5"
            >
              <span className="text-base text-black">{item.label}</span>
              <span className="text-[10px] tracking-widest text-black/50">{item.labelEn}</span>
            </SiteLink>
          ))}
          <SiteLink href={SITE.membersUrl} className="btn-gold mt-5">応援する</SiteLink>
        </nav>
      </div>
    </header>
  );
}
