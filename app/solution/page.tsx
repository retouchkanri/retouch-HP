import type { Metadata } from "next";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/site";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { SplitBlock, CTA } from "@/components/Blocks";

export const metadata: Metadata = {
  title: "私たちの取り組み",
  description:
    "馬の保護・リトレーニング・オーナー制度・教育事業・福祉事業・観光事業・地域活性化。Retouchの取り組み「馬たちに、新しい未来を。」",
};

const ITEMS = [
  { id: "馬の保護", no: "01", title: "馬の保護", image: IMG.solutionProtection, imageAlt: "保護された馬たちの写真", points: ["肥育場からの保護", "健康管理", "新しい環境への移行"] },
  { id: "リトレーニング", no: "02", title: "リトレーニング", image: IMG.solutionRetraining, imageAlt: "騎乗訓練風景", points: ["乗馬訓練", "基礎訓練", "個性に合わせた育成"] },
  { id: "オーナー制度", no: "03", title: "オーナー制度", image: IMG.solutionOwner, imageAlt: "支援者と馬が触れ合う風景", points: ["一口支援", "継続支援", "馬との交流"] },
  { id: "教育事業", no: "04", title: "教育事業", image: IMG.solutionEducation, imageAlt: "子どもたちと馬", points: ["命の教育", "学校連携", "体験学習"] },
  { id: "福祉事業", no: "05", title: "福祉事業", image: IMG.solutionWelfare, imageAlt: "高齢者と馬", points: ["ホースセラピー", "心のケア", "福祉施設連携"] },
  { id: "観光事業", no: "06", title: "観光事業", image: IMG.solutionTourism, imageAlt: "観光牧場の風景", points: ["乗馬体験", "牧場見学", "地域観光"] },
  { id: "地域活性化", no: "07", title: "地域活性化", image: IMG.solutionCommunity, imageAlt: "地域イベント", points: ["雇用創出", "地域連携", "観光振興"] },
];

export default function SolutionPage() {
  return (
    <>
      <PageHero
        eyebrow="SOLUTION"
        title="私たちの取り組み"
        subtitle="馬たちに、新しい未来を。"
        image="大自然の中で馬と触れ合うスタッフと支援者"
        backgroundImage={IMG.solutionHeroBg}
        crumbs={[{ label: "私たちの取り組み" }]}
      />

      <Section alt>
        <SectionHeading
          eyebrow="OUR APPROACH"
          title="保護して終わり、ではない。"
          lead="救出・再調教から、オーナー制度、教育・福祉・観光、そして地域活性化まで。Retouchは馬の一生に寄り添い、馬が社会の中で役割を持ち続けられる仕組みをつくります。"
        />
      </Section>

      {ITEMS.map((item, i) => (
        <div key={item.id}>
          <Section id={item.id} alt={i % 2 === 1}>
            <SplitBlock image={item.image} imageAlt={item.imageAlt} reverse={i % 2 === 1}>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-lg font-bold text-white">
                  {item.no}
                </span>
                <p className="eyebrow">{`SOLUTION ${item.no}`}</p>
              </div>
              <h3 className="section-title mt-4 !text-2xl sm:!text-3xl">{item.title}</h3>
              <ul className="mt-6 space-y-3">
                {item.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 rounded-xl bg-white p-4 text-sm font-medium text-ink/80 shadow-sm ring-1 ring-brand-900/5"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </SplitBlock>
          </Section>
        </div>
      ))}

      <Section>
        <CTA
          backgroundImage={IMG.ctaBg}
          title="馬たちに、新しい未来を。"
          body="あなたの支援や連携が、救える馬の数を増やします。できることから、一緒に始めてください。"
          primary={{ label: "私たちの活動を応援する", href: SITE.donateUrl }}
          secondary={{ label: "会員になる", href: SITE.loginUrl }}
        />
      </Section>
    </>
  );
}
