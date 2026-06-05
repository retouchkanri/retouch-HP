import Link from "next/link";
import { ImageNote } from "@/components/Placeholder";

type Crumb = { label: string; href?: string };

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  crumbs = [],
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative h-[42vh] min-h-[320px] w-full overflow-hidden bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800">
      <div className="relative container-x flex h-full flex-col justify-center">
        <ImageNote label={image} className="mb-5 w-fit" />
        <p className="eyebrow !text-gold animate-fadeUp">{eyebrow}</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-semibold text-white animate-fadeUp">
          {title}
        </h1>
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
    </section>
  );
}
