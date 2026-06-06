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

const CHALLENGES = [
  { t: "受け皿の不足", d: "毎年数千頭が引退する一方、引き取り先となる牧場や乗馬クラブは限られています。" },
  { t: "費用の負担", d: "馬1頭の飼養には月数万円。治療や輸送も加わり、継続的な資金が欠かせません。" },
  { t: "再調教の専門性", d: "競走馬を乗用馬へ転用するには高い技術と時間が必要。担い手の育成が課題です。" },
  { t: "情報の少なさ", d: "引退後の行方は表に出にくく、「知られていない」こと自体が大きな問題です。" },
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

      {/* 引退馬問題とは */}
      <Section id="引退馬問題とは">
        <SectionHeading
          eyebrow="THE PROBLEM"
          title="引退馬問題とは"
          lead="「かわいそう」だけでは解決できない、産業全体の構造的な課題です。"
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl bg-brand-700 p-8 text-white">
            <p className="text-5xl font-bold text-gold">数千頭</p>
            <p className="mt-2 text-sm text-brand-100">毎年引退するとされる競走馬。その多くの行方は知られていません。</p>
          </div>
          <div className="rounded-3xl bg-brand-800 p-8 text-white">
            <p className="text-5xl font-bold text-gold">月数万円</p>
            <p className="mt-2 text-sm text-brand-100">1頭の飼養にかかる費用。継続的な支援なしには救えません。</p>
          </div>
          <div className="rounded-3xl bg-brand-900 p-8 text-white">
            <p className="text-5xl font-bold text-gold">数年</p>
            <p className="mt-2 text-sm text-brand-100">競走馬としての現役期間。30年近い寿命に対し、あまりに短いものです。</p>
          </div>
        </div>
      </Section>

      <AdBanner
        badge="SUPPORT ｜ ふるさと納税"
        title="1頭まるごと保護、という選択。"
        body="大阪府河内長野市のふるさと納税で、引退馬の保護を直接応援できます。返礼として馬に会える・乗れる体験も。"
        cta="支援の方法を見る"
        href={SITE.membersUrl}
        tone="green"
      />

      {/* 署名活動 */}
      <Section id="署名活動" alt>
        <SectionHeading eyebrow="PETITION" title="署名活動" />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="section-lead">
              一団体が救える数には限りがあります。だからこそ私たちは、
              引退馬を守る社会の「仕組み」を変えるための署名活動に取り組んでいます。
              農林水産省・JRA・地方競馬への政策提言に向け、
              集まった声は<strong className="text-brand-700">5万人を突破</strong>しました。
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink/80">
              {["引退馬の追跡・登録の仕組みづくり", "受け皿となる施設・人材への支援", "再調教・福祉活用への助成"].map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {x}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-900/5">
              <div className="flex items-end justify-between">
                <span className="text-sm font-semibold text-brand-800">署名数</span>
                <span className="text-2xl font-bold text-brand-700">50,000<span className="text-sm">人超</span></span>
              </div>
              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-brand-100">
                <div className="h-full w-[83%] rounded-full bg-gold" />
              </div>
              <p className="mt-2 text-xs text-ink/50">目標 60,000人に向けて、ご署名をお願いします。</p>
            </div>
          </div>
          <Image
            src={IMG.issueSign}
            alt="署名活動の様子（日本人の参加者）"
            width={1200}
            height={900}
            className="w-full h-auto"
          />
        </div>
      </Section>

      {/* 私たちが向き合う課題 */}
      <Section id="私たちが向き合う課題">
        <SectionHeading
          eyebrow="CHALLENGES"
          title="私たちが向き合う課題"
          lead="ひとつずつ、しかし確実に。Retouchが取り組む4つの課題。"
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
