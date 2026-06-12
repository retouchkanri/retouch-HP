"use client";

export default function ScrollDownArrow() {
  const handleClick = () => {
    const next = document.querySelector<HTMLElement>("[data-stats]");
    if (next) {
      next.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="次のセクションへスクロール"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden min-h-11 min-w-11 flex-col items-center justify-center text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-none sm:bottom-8 sm:flex"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="motion-safe:animate-bounce drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
