import SiteLink from "@/components/SiteLink";

// 引退馬の森（提携牧場）への案内。各カードは公式サイトのヘッダー素材を表示する。
const INFO_LOCATIONS = [
  {
    href: "https://horserest.jp/",
    title: "引退馬の森　大阪府河内長野市",
    // 公式サイトのヘッダー動画（自動再生・ループ）
    video:
      "https://horserest.jp/wp-content/uploads/2021/09/dcadb41934ae50cf6d340f71f212583b.mp4",
  },
  {
    href: "https://xn--u9j871leggbx4bzdk.com/",
    title: "引退馬の森　千葉県八街市",
    // 公式サイトのヘッダー画像
    image:
      "https://xn--u9j871leggbx4bzdk.com/wp-content/uploads/2022/02/4e79275a8703164252659871ff6724b0-scaled-e1643898377121.jpg",
  },
] as const;

function CircleArrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      fill="currentColor"
      aria-hidden
    >
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.5 6.2 13 10l-4.5 3.8V6.2z" />
    </svg>
  );
}

export default function InfoLinks() {
  return (
    <section className="bg-white pt-6 pb-4 text-black sm:py-20">
      <div className="container-x">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-[0.15em] text-brand-700 sm:text-4xl">
            INFORMATION
          </h2>
          <p className="mt-3 text-sm tracking-[0.25em] text-black/70 sm:text-base">
            － インフォメーション －
          </p>
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl gap-5 sm:mt-14 sm:gap-10 md:grid-cols-2">
          {INFO_LOCATIONS.map((loc) => (
            <SiteLink
              key={loc.href}
              href={loc.href}
              className="group block text-center"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-brand-100 shadow-sm ring-1 ring-black/5">
                {"video" in loc ? (
                  <video
                    src={loc.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={loc.image}
                    alt={loc.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <p className="mt-4 flex items-center justify-center gap-1.5 font-semibold text-orange-600 transition-colors group-hover:text-orange-700">
                <CircleArrow />
                {loc.title}
              </p>
              <p className="mt-1 text-sm text-black/70">
                預託受入れの詳細はホームページをご覧ください。
              </p>
            </SiteLink>
          ))}
        </div>
      </div>
    </section>
  );
}
