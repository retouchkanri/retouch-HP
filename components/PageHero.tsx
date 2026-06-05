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
  imageOnly = false,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  image: string;
  backgroundImage?: string;
  crumbs?: Crumb[];
  imageOnly?: boolean;
}) {
  return (
    <section className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className={`absolute inset-0 ${HERO_GRADIENT}`} aria-hidden />
      )}
      <div className={`absolute inset-0 ${HERO_GRADIENT} opacity-30`} aria-hidden />
      {!imageOnly && (
        <div className="relative z-10 container-x flex h-full flex-col justify-center">
          {!backgroundImage && <ImageNote label={image} className="mb-5 w-fit" />}
          {eyebrow && <p className="eyebrow !text-gold animate-fadeUp">{eyebrow}</p>}
          {title && (
            <h1 className="mt-3 text-3xl sm:text-5xl font-semibold text-white animate-fadeUp">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-loose text-brand-100 animate-fadeUp">
              {subtitle}
            </p>
          )}
          <nav className="mt-6 flex items-center gap-2 text-xs text-brand-200">
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
      )}
    </section>
  );
}
