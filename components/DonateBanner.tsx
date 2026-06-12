export default function DonateBanner() {
  return (
    <a
      href="https://retouch.salon/donate"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="肥育場で過ごす馬たちに、新しい未来を。"
      className="fixed bottom-0 left-0 z-40 w-40 sm:w-52 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/donate-banner.png"
        alt="寄付バナー：肥育場で過ごす馬たちに、新しい未来を。"
        className="w-full mix-blend-multiply"
      />
    </a>
  );
}
