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
    <div className="fixed bottom-0 left-0 z-40 w-36 max-sm:max-w-[42vw] sm:w-[20.8rem] pb-[env(safe-area-inset-bottom)]">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="寄付バナーを閉じる"
        className="absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-base leading-none text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 sm:right-2 sm:top-2 sm:h-8 sm:w-8"
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
