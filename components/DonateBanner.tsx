"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function DonateBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [pathname]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 z-40 w-[4.5rem] max-sm:max-w-[21vw] sm:w-[10.4rem] pb-[env(safe-area-inset-bottom)]">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="寄付バナーを閉じる"
        className="absolute right-0.5 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs leading-none text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 sm:right-1 sm:top-1 sm:h-6 sm:w-6 sm:text-sm"
      >
        ×
      </button>
      <a
        href="https://retouch.salon/donate"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="肥育場で過ごす馬たちに、新しい未来を。"
        className="block transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/donate-banner.png"
          alt="寄付バナー：肥育場で過ごす馬たちに、新しい未来を。"
          className="w-full mix-blend-multiply"
        />
      </a>
    </div>
  );
}
