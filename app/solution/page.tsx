import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { IMG } from "@/lib/images";
import { Section } from "@/components/Section";
import { CTA } from "@/components/Blocks";
import Reveal from "@/components/Reveal";
import SolutionPillars from "@/components/SolutionPillars";

export const metadata: Metadata = {
  title: {
    absolute: "新しい引退馬支援／肥育場からの直接引退馬の保護へ",
  },
  description:
    "引退馬の保護で私たちが出来ること／引退馬の里親、引退馬への一口支援、引退馬への寄付など、一口馬主とはまた違う新しい引退馬支援のかたち。Retouch（リタッチ）",
  keywords: [
    "大阪府",
    "河内長野市",
    "会社",
    "Retouch",
    "リタッチ",
    "馬",
    "寄付",
    "ふるさと納税",
  ],
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
      <section data-hero className="relative min-h-[36vh] overflow-hidden py-16 sm:min-h-[360px] sm:py-32">
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
      <Section alt className="!py-10 sm:!py-28">
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
      <Section className="!py-10 sm:!py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">FOUR PILLARS</p>
            <h2 className="section-title mt-3">4つの観点から、未来をつくる</h2>
            <p className="section-lead mt-5">
              知る・支える・活かす・育てる。Retouchはこの4つの柱で、引退競走馬と人と地域がともに歩む仕組みを育てています。
            </p>
          </div>
        </Reveal>

        <SolutionPillars pillars={PILLARS} />

        {/* Quick nav pills */}
        <Reveal delay={120}>
          <div className="-mx-5 mt-16 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-20 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
            {PILLARS.map((pillar) => (
              <a
                key={pillar.id}
                href={`#${pillar.id}`}
                className="shrink-0 rounded-full border border-brand-200 bg-white px-4 py-2.5 text-xs font-semibold text-brand-800 transition-all duration-300 hover:border-gold hover:bg-brand-50 hover:text-brand-900 hover:shadow-md sm:px-5"
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
            backgroundImage={IMG.ctaBg}
            title="馬たちに、新しい未来を。"
            body={
              <>
                あなたの支援や連携が、救える馬の数を増やします。できることから、
                一緒に始めてください。
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
