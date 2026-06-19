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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  const showShadow = mounted && (scrolled || open);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 xl:sticky ${
          showShadow ? "shadow-sm" : ""
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

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 p-3"
            aria-label="メニュー"
            aria-expanded={open}
          >
            <span className={`h-0.5 w-6 bg-black transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-black transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-black transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      {/* 固定ヘッダー分のスペーサー（モバイル・タブレット） */}
      <div className="h-16 sm:h-20 xl:hidden" aria-hidden />

      {/* モバイルメニュー */}
      {open && (
        <div className="xl:hidden fixed inset-x-0 top-16 sm:top-20 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-brand-900/10 bg-white sm:max-h-[calc(100dvh-5rem)]">
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
      )}
    </>
  );
}
