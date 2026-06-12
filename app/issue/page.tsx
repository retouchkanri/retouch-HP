import type { Metadata } from "next";
import Image from "next/image";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/site";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { SplitBlock, CTA } from "@/components/Blocks";
import { AdBanner } from "@/components/Ads";

export const metadata: Metadata = {
  title: "引退競走馬の現実",
  description: "肥育場の現実、引退馬問題とは、署名活動、私たちが向き合う課題。引退競走馬が直面する厳しい現実を伝えます。",
};

const PETITION_DEMANDS = [
  "引退競走馬の「行方不明という実態」を解決すること",
  "引退馬の屠殺目的譲渡を禁止し、馬が安心して生きられる仕組みを",
  "引退馬の国の予算、約12億8千万円の使途と成果を明らかに。",
];

const CHALLENGES = [
  { t: "情報の少なさ", d: "引退後の馬たちがどこで、どのような生涯を送っているのか。その実態は十分に知られていません。まずは現状を知り、社会全体で考えることが課題解決の第一歩です。" },
  { t: "費用の負担", d: "馬1頭を維持するためには、飼料代や医療費など年間100万円以上の費用が必要です。引退馬を支える仕組みや、公的支援制度の充実が求められています。" },
  { t: "活躍の場の不足", d: "競走馬としての役目を終えても、馬たちには様々な可能性があります。教育、福祉、観光、スポーツなど、新たな役割を生み出す環境づくりが必要です。" },
  { t: "人材の育成", d: "引退馬の未来を支えるためには、馬を管理し、活用し、命に向き合える人材が欠かせません。次世代を担う人材の育成が持続可能な仕組みにつながります。" },
];

export default function IssuePage() {
  return (
    <>
      <PageHero
        eyebrow="ISSUE"
        title="引退競走馬の現実"
        subtitle="目をそらさないことから、すべては始まります。"
        image={IMG.issueFarm}
        backgroundImage={IMG.issueHeroBg}
        crumbs={[{ label: "引退競走馬の現実" }]}
      />

      {/* 肥育場の現実 */}
      <Section id="肥育場の現実" alt>
        <SectionHeading
          eyebrow="THE REALITY"
          title="肥育場の現実"
          lead="ターフを駆けた馬たちの多くが、引退後わずかな期間で肥育場へと送られます。"
        />
        <div className="mt-12">
          <SplitBlock image={IMG.issueStable} imageAlt="馬房で過ごす馬">
            <p className="accent-line eyebrow">FACT</p>
            <h3 className="section-title mt-2 !text-2xl">「肉用馬」として、出荷を待つ馬たち。</h3>
            <p className="section-lead mt-5">
              肥育場とは、馬を肉用として育て出荷する施設です。
              競走馬は引退後に行き場を失うと、ここへ送られることが少なくありません。
              限られた環境の中で、命の期限を待つ馬たちがいます。
            </p>
            <p className="section-lead mt-4">
              Retouchは、こうした肥育場から馬を直接引き取り、
              再調教を経て新しい役割へとつなぐ活動を続けています。
              一頭を救うことは、その馬の物語を変えることです。
            </p>
          </SplitBlock>
        </div>
      </Section>

      {/* 引退馬問題の数字 */}
      <Section id="引退馬問題の数字">
        <SectionHeading
          eyebrow="THE PROBLEM"
          title="引退馬問題の数字"
          lead="「かわいそう」だけでは解決できない、産業全体の構造的な課題です。"
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl bg-brand-700 p-8 text-white">
            <p className="text-5xl font-bold text-gold">屠殺5000頭</p>
            <p className="mt-2 text-sm text-brand-100">毎年、競走馬を引退し屠殺への向かう数といわれています。</p>
          </div>
          <div className="rounded-3xl bg-brand-800 p-8 text-white">
            <p className="text-5xl font-bold text-gold">年間100万円</p>
            <p className="mt-2 text-sm text-brand-100">概ね1頭の飼養にかかる費用。継続的な支援なしには救えません。</p>
          </div>
          <div className="rounded-3xl bg-brand-900 p-8 text-white">
            <p className="text-5xl font-bold text-gold">一生涯30年</p>
            <p className="mt-2 text-sm text-brand-100">競走馬としての現役。30年近い馬の寿命に対し、あまりに短いものです。</p>
          </div>
        </div>
      </Section>

      <AdBanner
        badge="ＰＲ｜一口支援馬"
        title="馬の未来支援"
        body="月額支援を通じ引退競走馬の命と新たな活躍の場を応援。月額支援で本来もうない命を支える。"
        cta="一口支援制度"
        href={SITE.membersUrl}
        tone="green"
      />

      {/* 署名活動 */}
      <Section id="署名活動" alt>
        <SectionHeading eyebrow="PETITION" title="署名活動" />
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold text-brand-900">引退馬競走馬の問題について</h3>
            <p className="mt-3 text-lg font-semibold text-brand-800">なぜ、今私たちは声を上げるのか？</p>
            <div className="mt-6 space-y-4 section-lead">
              <p>
                競走馬たちは、自ら望んで生まれてきたわけではありません。それでも私たちに夢や感動を与え、その役目を終えた後、多くの馬たちの行き先は十分に把握されていません。
              </p>
              <p>
                2022年、国会では引退競走馬対策やホースセラピー関連事業として約12億8,000万円の予算が示されました。しかし、その使途や成果は十分に見えているとは言えません。私たちは競馬を否定したいのではありません。競馬産業が社会から信頼され続けるために、引退後の馬たちにも責任を持つべきだと考えています。
              </p>
            </div>
            <h4 className="mt-8 text-lg font-semibold text-brand-900">私たちが求めること</h4>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
              {PETITION_DEMANDS.map((x) => (
                <li key={x} className="flex gap-3">
                  <svg className="shrink-0 mt-0.5 h-5 w-5 text-gold" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-lg font-semibold text-brand-900">
              夢を与えてくれた馬たちに、引退後の未来を。
            </p>
            <p className="mt-2 section-lead">あなたの署名が、その第一歩になります。</p>
            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-900/5">
              <div className="flex items-end justify-between">
                <span className="text-sm font-semibold text-brand-800">署名数</span>
                <span className="text-2xl font-bold text-brand-700">57,614<span className="text-sm">人</span></span>
              </div>
              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-brand-100">
                <div className="h-full w-[96%] rounded-full bg-gold" />
              </div>
              <p className="mt-2 text-xs text-ink/50">目標 60,000人に向けて、ご署名をお願いします。</p>
            </div>
          </div>
          <a
            href={SITE.petitionVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-opacity hover:opacity-90"
          >
            <Image
              src={IMG.issueSign}
              alt="署名活動の様子（日本人の参加者）"
              width={1200}
              height={900}
              className="w-full h-auto"
            />
          </a>
        </div>
      </Section>

      {/* 私たちが向き合う課題 */}
      <Section id="私たちが向き合う課題">
        <SectionHeading
          eyebrow="CHALLENGES"
          title="引退馬の未来を阻む4つの壁"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {CHALLENGES.map((c, i) => (
            <div key={c.t} className="flex gap-5 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-brand-900/5">
              <span className="text-3xl font-bold text-brand-200">0{i + 1}</span>
              <div>
                <h3 className="text-lg font-semibold text-brand-900">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <CTA
            backgroundImage={IMG.ctaBg}
            title="知ったあなたに、できることがあります。"
            body="現実を知ることは、変化の第一歩。次は、ぜひ「私たちの取り組み」をご覧ください。"
            primary={{ label: "取り組みを見る", href: "/solution" }}
            secondary={{ label: "署名・支援する", href: SITE.donateUrl }}
          />
        </div>
      </Section>
    </>
  );
}
