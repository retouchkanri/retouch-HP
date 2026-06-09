import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { Section } from "@/components/Section";
import { CTA } from "@/components/Blocks";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "私たちの取り組み",
  description:
    "伝える・支える・新しい役割・次世代を育てる。馬が社会の中で役割を持ち、人が馬から学び、支え合える仕組みをつくる Retouch の4つの取り組み。",
};

const PILLARS = [
  {
    id: "伝える・知ってもらう",
    no: "01",
    title: "伝える・知ってもらう",
    image: "/4_1.png",
    imageAlt: "YouTube・SNS・講演・署名活動による情報発信の様子",
    body: "引退馬の現状を一人でも多くの方に知っていただくため、YouTubeやSNS、講演活動、署名活動を通じて情報発信を行っています。まずは「知ること」から社会を変えていきます。",
  },
  {
    id: "支える仕組みをつくる",
    no: "02",
    title: "支える仕組みをつくる",
    image: "/4_2.png",
    imageAlt: "メンバー制度・一口支援・企業協賛・ふるさと納税による支援の仕組み",
    body: "Retouchメンバー制度、一口支援、企業協賛、ふるさと納税などを通じて、馬たちを継続的に支えられる仕組みづくりを進めています。",
  },
  {
    id: "新しい役割をつくる",
    no: "03",
    title: "新しい役割をつくる",
    image: "/4_3.png",
    imageAlt: "教育・福祉・観光・スポーツ・ホースセラピーでの馬の活躍",
    body: "保護した馬たちを再調教し、教育・福祉・観光・スポーツ・ホースセラピーなどの分野で活躍できる環境づくりに取り組んでいます。",
  },
  {
    id: "次世代を育てる",
    no: "04",
    title: "次世代を育てる",
    image: "/4_4.png",
    imageAlt: "東関東馬事高等学院・専門学院での馬の管理・調教・福祉活動の実践",
    body: "東関東馬事高等学院や東関東馬事専門学院の学生たちとともに、馬の管理や調教、福祉活動を実践しながら、引退馬の未来を支える人材育成を行っています。",
  },
];

export default function SolutionPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[42vh] overflow-hidden py-24 sm:min-h-[360px] sm:py-32">
        <Image
          src="/4_h.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-950/92 via-brand-900/78 to-brand-900/35"
          aria-hidden
        />

        <div className="container-x relative z-10">
          <p className="eyebrow !text-gold animate-fadeUp">SOLUTION</p>
          <h1 className="mt-4 max-w-3xl text-3xl sm:text-5xl font-semibold leading-snug text-white animate-fadeUp">
            私たちの取り組み
          </h1>
          <p
            className="mt-6 max-w-2xl text-sm sm:text-lg leading-loose text-brand-100 animate-fadeUp"
            style={{ animationDelay: "0.15s" }}
          >
            馬たちが社会の中で役割を持ち、
            <br className="hidden sm:block" />
            人が馬から学び、支え合える仕組みをつくること。
          </p>
          <nav
            className="mt-8 flex items-center gap-2 text-xs text-brand-200 animate-fadeUp"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/" className="hover:text-white">
              HOME
            </Link>
            <span className="text-brand-400">/</span>
            <span className="text-white">私たちの取り組み</span>
          </nav>
        </div>
      </section>

      {/* Mission statement */}
      <Section alt className="!py-20 sm:!py-28">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">OUR MISSION</p>
            <p className="mt-6 text-xl sm:text-2xl font-semibold leading-[1.8] text-brand-900">
              馬たちが社会の中で役割を持ち、
              <br />
              人が馬から学び、支え合える仕組みをつくること。
            </p>
            <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </Reveal>
      </Section>

      {/* 4 pillars — tree layout */}
      <Section className="!py-16 sm:!py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">FOUR PILLARS</p>
            <h2 className="section-title mt-3">4つの観点から、未来をつくる</h2>
            <p className="section-lead mt-5">
              知る・支える・活かす・育てる。Retouchはこの4つの柱で、引退競走馬と人と地域がともに歩む仕組みを育てています。
            </p>
          </div>
        </Reveal>

        <div className="relative mx-auto mt-20 max-w-6xl">
          {/* Center trunk */}
          <div
            className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 -translate-x-1/2 bg-gradient-to-b from-gold via-brand-300 to-brand-100 lg:block animate-drawLine"
            aria-hidden
          />

          <div className="space-y-16 sm:space-y-24">
            {PILLARS.map((pillar, i) => {
              const isLeft = i % 2 === 0;
              return (
                <Reveal
                  key={pillar.id}
                  delay={i * 100}
                  direction={isLeft ? "left" : "right"}
                >
                  <div className="relative">
                    {/* Center node + branch (desktop) */}
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

                    {/* Mobile spine */}
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
                        {/* Title */}
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

                        {/* Image */}
                        <div className="relative mx-6 mt-5 aspect-[16/10] overflow-hidden rounded-2xl sm:mx-8">
                          <Image
                            src={pillar.image}
                            alt={pillar.imageAlt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 560px"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>

                        {/* Body */}
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

        {/* Quick nav pills */}
        <Reveal delay={120}>
          <div className="mt-16 flex flex-wrap justify-center gap-3 sm:mt-20">
            {PILLARS.map((pillar) => (
              <a
                key={pillar.id}
                href={`#${pillar.id}`}
                className="rounded-full border border-brand-200 bg-white px-5 py-2.5 text-xs font-semibold text-brand-800 transition-all duration-300 hover:border-gold hover:bg-brand-50 hover:text-brand-900 hover:shadow-md"
              >
                {pillar.no}｜{pillar.title}
              </a>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section alt className="!pb-24">
        <Reveal direction="scale">
          <CTA
            title="馬たちに、新しい未来を。"
            body={
              <>
                あなたの支援や連携が、救える馬の数を増やします。できることから、
                <span className="whitespace-nowrap">一緒に始めてください。</span>
              </>
            }
            primary={{ label: "私たちの活動を応援する", href: SITE.donateUrl }}
            secondary={{ label: "会員になる", href: SITE.loginUrl }}
          />
        </Reveal>
      </Section>
    </>
  );
}
