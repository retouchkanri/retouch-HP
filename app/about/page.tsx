import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { IMG } from "@/lib/images";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { CTA } from "@/components/Blocks";
import { AdGrid } from "@/components/Ads";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Retouchとは",
  description:
    "引退競走馬保護団体 Retouch（リタッチ）の想い・代表メッセージ・会社概要・目指す未来。「引退馬に、もう一度役割を。」",
};

const POINTS = ["馬を守る", "馬の可能性を広げる", "人と馬をつなぐ", "次世代へ命をつなぐ"];

const PROFILE: [string, string][] = [
  ["団体名", "Retouch（リタッチ）"],
  ["代表", SITE.ceo],
  [
    "活動内容",
    "引退競走馬の保護 / リトレーニング / 乗馬事業 / 観光事業 / 教育事業 / 福祉事業 / オーナー制度運営 / 馬とのふれあい活動",
  ],
  ["活動拠点", "大阪府河内長野市　Horse Rest"],
  ["支援会員数", "600名以上"],
  ["保護実績", "53頭以上"],
];

const FUTURE_FIELDS = ["観光", "教育", "福祉", "地域活性化", "乗馬", "ホースセラピー"];

const VISION = [
  "引退馬問題の認知向上",
  "保護頭数の拡大",
  "全国への活動展開",
  "教育・福祉分野との連携",
  "持続可能な支援モデル構築",
  "人と馬が共生する社会の実現",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT RETOUCH"
        title="Retouch（リタッチ）とは"
        subtitle="引退馬に、もう一度役割を。"
        image={IMG.heroField}
        crumbs={[{ label: "Retouchとは" }]}
      />

      {/* ===== SECTION 01 私たちの想い ===== */}
      <Section id="私たちの想い" alt>
        <SectionHeading eyebrow="SECTION 01" title="私たちの想い" lead="「引退馬に、もう一度役割を。」" />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Placeholder
            label="代表と引退競走馬が見つめ合う写真／牧場で馬と触れ合う風景"
            className="aspect-[4/3] w-full rounded-3xl shadow-lg"
          />
          <div>
            <p className="accent-line eyebrow">MESSAGE</p>
            <h3 className="section-title mt-2 !text-2xl sm:!text-3xl leading-relaxed">
              引退競走馬に、
              <br />
              もう一度輝ける未来を。
            </h3>
            <p className="section-lead mt-6">
              Retouch（リタッチ）は、競走馬としての役目を終えた馬たちに、新たな生きる場所と役割を提供することを目的として活動する支援団体です。
            </p>
            <p className="section-lead mt-4">
              「Retouch」という名前には、<strong className="text-brand-700">『もう一度、手を差しのべる』</strong>
              という想いが込められています。私たちは、引退後に肥育場へ送られてしまう馬たちの現実と向き合いながら、一頭でも多くの馬たちが新たな人生（馬生）を歩める社会を目指しています。
            </p>
          </div>
        </div>

        {/* ポイント表示 */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {POINTS.map((p, i) => (
            <div
              key={p}
              className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-brand-900/5"
            >
              <span className="text-2xl font-bold text-brand-200">0{i + 1}</span>
              <p className="mt-2 text-base font-semibold text-brand-900">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== SECTION 02 代表メッセージ ===== */}
      <Section id="代表メッセージ">
        <SectionHeading eyebrow="SECTION 02" title="代表メッセージ" lead="「走れなかったから価値がないのでしょうか。」" />
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="overflow-hidden rounded-3xl shadow-xl">
            <Placeholder
              label="代表 野口佳槻氏と馬／自然の中で馬と歩くシーン"
              className="aspect-[4/5] w-full"
            />
            <div className="bg-brand-800 p-5 text-center text-white">
              <p className="text-lg font-semibold">{SITE.ceo}</p>
              <p className="mt-1 text-xs text-brand-200">{SITE.ceoRole}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-sm ring-1 ring-brand-900/5">
            <p className="text-2xl font-semibold leading-relaxed text-brand-900">
              走れなかったから、
              <br />
              価値がないのでしょうか。
            </p>
            <div className="mt-6 space-y-4 text-sm sm:text-base leading-loose text-ink/80">
              <p>私はRetouch代表の野口佳槻です。</p>
              <p>
                日本では毎年7,000頭以上のサラブレッドが誕生し、多くの人々に夢や感動を与えています。しかしその一方で、競走馬として結果を残せなかった馬や、引退後の行き先が見つからない馬たちが、肥育場へ送られているという現実があります。
              </p>
              <p>
                私は長年この現実に強い違和感を抱いてきました。「走れなかった＝価値がない」。本当にそうなのでしょうか。
              </p>
              <p>
                馬たちにはそれぞれ個性があります。乗馬として活躍できる馬、教育活動に向いている馬、人を癒やす力を持つ馬、観光や地域活動で活躍できる馬。私たちは、その可能性を信じています。
              </p>
              <p>
                Retouchは、馬たちが新しい人生を歩むためのスタート地点でありたいと考えています。
              </p>
            </div>
            <p className="mt-8 text-right text-sm text-ink/60">
              Retouch 代表　{SITE.ceo}
            </p>
          </div>
        </div>
      </Section>

      <AdGrid />

      {/* ===== SECTION 03 会社概要 ===== */}
      <Section id="会社概要" alt>
        <SectionHeading eyebrow="SECTION 03" title="会社概要" lead="Retouchについて" />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-2xl ring-1 ring-brand-900/10">
            <table className="w-full text-left text-sm">
              <tbody>
                {PROFILE.map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-white" : "bg-brand-50/50"}>
                    <th className="w-32 align-top px-5 py-4 font-semibold text-brand-800">{k}</th>
                    <td className="px-5 py-4 leading-relaxed text-ink/80">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-5">
            <Placeholder label="牧場全景／スタッフ集合写真" className="aspect-[4/3] w-full rounded-2xl" />
            <div className="rounded-2xl bg-brand-700 p-7 text-white">
              <p className="eyebrow !text-gold">OUR PHILOSOPHY</p>
              <h3 className="mt-3 text-xl font-semibold">私たちの活動理念</h3>
              <p className="mt-3 text-sm leading-loose text-brand-100">
                「保護する」だけではなく、馬たちが自らの役割を持ちながら生き続けられる環境を創ること。それがRetouchの使命です。
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== SECTION 04 目指す未来 ===== */}
      <Section id="目指す未来">
        <SectionHeading
          center
          eyebrow="SECTION 04"
          title="目指す未来"
          lead="人と馬が共に幸せになれる社会へ"
        />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Placeholder
            label="子どもたちと馬／観光牧場／乗馬体験／高齢者とのふれあい（未来を象徴する明るい写真）"
            className="aspect-[4/3] w-full rounded-3xl shadow-lg"
          />
          <div>
            <p className="section-lead">
              私たちは、「かわいそうだから助ける」だけでは活動は続かないと考えています。だからこそ、観光・教育・福祉・地域活性化・乗馬・ホースセラピーなど、馬たちが社会の中で役割を持ち続けられる仕組みづくりを進めています。
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {FUTURE_FIELDS.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700"
                >
                  {f}
                </span>
              ))}
            </div>
            <p className="section-lead mt-6">
              人が馬を支え、馬が人を癒やし、お互いが支え合う。そんな循環を日本中へ広げていくことが、Retouchの目指す未来です。
            </p>
          </div>
        </div>

        {/* Future Vision */}
        <div className="mt-14">
          <p className="eyebrow text-center">FUTURE VISION</p>
          <div className="mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VISION.map((v, i) => (
              <div
                key={v}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-900/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-brand-900">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <CTA
            title="引退競走馬の未来を、私たちと一緒に支えてください。"
            primary={{ label: "会員になる", href: "/support#会員になる" }}
            secondary={{ label: "一口支援する", href: "/support#一口支援" }}
          />
          <div className="mt-4 text-center">
            <Link href="/support" className="btn-outline">活動を応援する</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
