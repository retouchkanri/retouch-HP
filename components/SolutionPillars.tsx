import Image from "next/image";
import Reveal from "@/components/Reveal";

export type SolutionPillar = {
  id: string;
  no: string;
  title: string;
  image: string;
  imageAlt: string;
  body: string;
};

export default function SolutionPillars({ pillars }: { pillars: SolutionPillar[] }) {
  return (
    <div className="relative mx-auto mt-20 max-w-6xl">
      <div
        className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 -translate-x-1/2 bg-gradient-to-b from-gold via-brand-300 to-brand-100 lg:block animate-drawLine"
        aria-hidden
      />

      <div className="space-y-16 sm:space-y-24">
        {pillars.map((pillar, i) => {
          const isLeft = i % 2 === 0;
          return (
            <Reveal
              key={pillar.id}
              delay={i * 100}
              direction={isLeft ? "left" : "right"}
            >
              <div className="relative">
                <div
                  className="absolute left-1/2 top-10 z-20 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gold shadow-md ring-4 ring-white lg:block"
                  aria-hidden
                />
                <div
                  className={`absolute top-[2.6rem] hidden h-px bg-brand-200 lg:block ${
                    isLeft
                      ? "right-1/2 mr-4 w-[calc(50%-2.5rem-1rem)]"
                      : "left-1/2 ml-4 w-[calc(50%-2.5rem-1rem)]"
                  }`}
                  aria-hidden
                />

                <div
                  className="absolute left-3 top-0 bottom-0 w-px bg-brand-200 lg:hidden"
                  aria-hidden
                />
                <div
                  className="absolute left-3 top-10 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-gold ring-2 ring-white lg:hidden"
                  aria-hidden
                />

                <article
                  id={pillar.id}
                  className={`relative scroll-mt-28 pl-10 lg:w-[calc(50%-2.5rem)] lg:pl-0 ${
                    isLeft ? "lg:mr-auto" : "lg:ml-auto"
                  }`}
                >
                  <div className="group overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-brand-900/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    <div className={`px-6 pt-7 sm:px-8 sm:pt-8 ${isLeft ? "lg:text-right" : ""}`}>
                      <p className="text-xs font-semibold tracking-[0.3em] text-gold">
                        PILLAR {pillar.no}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-brand-900 sm:text-2xl">
                        <span className="text-gold">{pillar.no}</span>
                        <span className="mx-2 text-brand-300" aria-hidden>
                          ｜
                        </span>
                        {pillar.title}
                      </h3>
                    </div>

                    <div className="relative mx-6 mt-5 aspect-[16/10] overflow-hidden rounded-2xl sm:mx-8">
                      <Image
                        src={pillar.image}
                        alt={pillar.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 560px"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className={`px-6 py-6 sm:px-8 sm:pb-8 ${isLeft ? "lg:text-right" : ""}`}>
                      <p className="section-lead text-pretty">{pillar.body}</p>
                    </div>
                  </div>
                </article>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
