"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DONATE_URL = "https://retouch.salon/donate";

export default function DonateBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [pathname]);

  if (dismissed) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-0 left-0 z-40 pb-[env(safe-area-inset-bottom)]"
      aria-hidden={false}
    >
      <div className="pointer-events-auto relative w-[4.5rem] max-sm:max-w-[21vw] sm:w-[10.4rem]">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="寄付バナーを閉じる"
          className="absolute -right-1.5 -top-1.5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-brand-950/85 text-sm leading-none text-white shadow-md transition-colors hover:bg-brand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:h-7 sm:w-7"
        >
          ×
        </button>

        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group card block cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-brand-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          aria-label="肥育場で過ごす馬たちの保護・救済寄付をする"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/donate-banner.png"
            alt=""
            className="block w-full transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
          />
          <span className="sr-only">肥育場で過ごす馬たちの保護・救済寄付をする</span>
        </a>
      </div>
    </div>
  );
}
