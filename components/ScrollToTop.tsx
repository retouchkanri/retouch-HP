"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setVisible(false);

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      const onScroll = () => setVisible(window.scrollY > 400);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="ページトップへ戻る"
      title="ページトップへ戻る"
      className={`group fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 flex flex-col items-center transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 ${
        visible
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-3"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/top.png"
        alt=""
        aria-hidden="true"
        className="top-horse h-20 w-auto sm:h-24 drop-shadow-[0_6px_8px_rgba(20,40,25,0.25)]"
      />
    </button>
  );
}
