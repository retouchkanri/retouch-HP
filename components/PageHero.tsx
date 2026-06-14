import Image from "next/image";
import Link from "next/link";
import { ImageNote } from "@/components/Placeholder";

type Crumb = { label: string; href?: string };

const HERO_GRADIENT = "bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  backgroundImage,
  crumbs = [],
  imagePosition = "center",
  overlay = "default",
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  image: string;
  backgroundImage?: string;
  crumbs?: Crumb[];
  /** 背景画像の表示位置（焼き込み文字を避けるときに指定） */
  imagePosition?: string;
  /** default=通常 / strong=文字の可読性を優先 */
  overlay?: "default" | "strong";
}) {
  return (
    <section data-hero className="relative h-[36dvh] min-h-[260px] max-h-[400px] w-full overflow-hidden sm:h-[42vh] sm:min-h-[320px] sm:max-h-none">
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: imagePosition }}
          priority
        />
      ) : (
        <div className={`absolute inset-0 ${HERO_GRADIENT}`} aria-hidden />
      )}
      <div
        className={`absolute inset-0 ${
          overlay === "strong"
            ? "bg-gradient-to-r from-brand-950/92 via-brand-950/55 to-brand-950/15"
            : `${HERO_GRADIENT} opacity-30`
        }`}
        aria-hidden
      />
      <div className="relative z-10 container-x flex h-full flex-col justify-center">
        {!backgroundImage && <ImageNote label={image} className="mb-5 w-fit" />}
        {(eyebrow || title || subtitle) && (
          <div
            className={`max-w-xl ${
              overlay === "strong"
                ? "rounded-2xl bg-brand-950/35 px-5 py-4 backdrop-blur-[2px] sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none"
                : ""
            }`}
          >
            {eyebrow && <p className="eyebrow !text-gold animate-fadeUp">{eyebrow}</p>}
            {title && (
              <h1 className="mt-3 text-3xl sm:text-5xl font-semibold leading-tight text-white animate-fadeUp">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-5 max-w-2xl text-sm sm:text-base leading-loose text-brand-100 animate-fadeUp">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <nav className="mt-auto pb-1 pt-4 flex items-center gap-2 text-xs text-brand-200 sm:mt-6 sm:pb-0">
          <Link href="/" className="hover:text-white">HOME</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <span className="text-brand-400">/</span>
              {c.href ? (
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
