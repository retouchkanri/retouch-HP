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
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/70 hover:text-white transition-colors duration-200 focus-visible:outline-none"
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
        className="animate-bounce drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
