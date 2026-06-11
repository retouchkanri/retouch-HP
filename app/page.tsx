import Link from "next/link";
import SiteLink from "@/components/SiteLink";
import { SITE, STATS } from "@/lib/site";
import { IMG } from "@/lib/images";
import { HORSES, NEWS, MEDIA } from "@/lib/data";
import { Section, SectionHeading } from "@/components/Section";
import { StatGrid, HorseCard, CTA } from "@/components/Blocks";
import SupportRanking from "@/components/SupportRanking";
import { AdBanner, AdGrid } from "@/components/Ads";
import Image from "next/image";
import Placeholder, { ImageNote } from "@/components/Placeholder";

const SOLUTIONS = [
  { no: "01", image: "/1_1.jpg", title: "馬の保護", body: "肥育場・競馬場・牧場から、命の期限が迫る引退競走馬を直接引き取ります。", href: "/solution#馬の保護" },
  { no: "02", image: "/1_2.jpg", title: "リトレーニング", body: "一頭ごとの個性に合わせ、競走馬から乗用馬へ。時間をかけて信頼を育てます。", href: "/solution#リトレーニング" },
  { no: "03", image: "/1_3.jpg", title: "オーナー制度", body: "一口支援・オーナー制度で、馬と支援者をつなぎます。会える・乗れる支援。", href: "/solution#オーナー制度" },
  { no: "04", image: "/1_4.jpg", title: "教育事業", body: "馬事学院（バジガク）と連携し、馬産業を担う人材を育成・輩出します。", href: "/solution#教育事業" },
  { no: "05", image: "/1_5.jpg", title: "福祉・観光", body: "ホースセラピーやふれあい見学会で、馬が人と地域に癒やしを届けます。", href: "/solution#福祉事業", crop: true },
  { no: "06", image: "/1_6.jpg", title: "地域活性化", body: "馬を核に、観光・雇用・交流を生み、地域とともに歩む未来をつくります。", href: "/solution#地域活性化" },
];

export default function Home() {
  return (
    <>
      {/* ===== ヒーロー ===== */}
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
        <Image
          src={IMG.aboutHeroBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-900/55 to-brand-900/30" aria-hidden />
        <div className="relative z-10 container-x flex h-full flex-col justify-end pb-20 sm:pb-28">
          <p className="eyebrow !text-gold animate-fadeUp">RETOUCH ｜ 引退競走馬の保護団体</p>
          <h1 className="mt-4 max-w-4xl text-4xl sm:text-6xl font-semibold leading-[1.4] text-white animate-fadeUp">
            命をつなぐ。
            <br />
            引退競走馬と、人と、
            <br />
            地域の未来へ。
          </h1>
          <p className="mt-6 max-w-2xl text-sm sm:text-lg leading-loose text-brand-100 animate-fadeUp">
            役目を終えた競走馬の多くは、肥育場で肉用馬として最期を迎えます。
            Retouch（リタッチ）は、その馬たちを救い出し、再調教を通じて
            人と共に生きる新しい道を切り拓きます。
          </p>
          <div className="mt-9 flex flex-wrap gap-4 animate-fadeUp">
            <SiteLink href={SITE.membersUrl} className="btn-gold">いますぐ応援する</SiteLink>
            <Link href="/issue" className="btn-white">引退馬の現実を知る</Link>
          </div>
        </div>
      </section>

      {/* ===== 統計バー ===== */}
      <div className="bg-brand-900">
        <div className="container-x py-10">
          <StatGrid stats={STATS} dark />
        </div>
      </div>

      {/* ===== 私たちの想い ===== */}
      <Section alt>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Image
            src={IMG.ceoPhoto}
            alt="代表 野口佳槻と馬"
            width={800}
            height={1000}
            className="aspect-[4/3] w-full object-cover object-top"
          />
          <div>
            <p className="eyebrow">OUR MISSION ｜ 私たちの想い</p>
            <h2 className="section-title mt-3">
              一頭でも多くの命に、
              <br />
              「次（Re:touch）」を。
            </h2>
            <p className="section-lead mt-6">
              日本では年間数千頭の競走馬が引退し、その多くが行き場を失います。
              華やかなターフを駆けた馬たちが、わずか数年で「肉」として扱われる現実。
              私たちはこの現実から目をそらさず、馬たちにもう一度
              人と歩む人生（馬生）を届けたいと願っています。
            </p>
            <p className="section-lead mt-4">
              代表・{SITE.ceo}は、株式会社馬事学院（バジガク）を率い、
              競馬と乗馬の両分野で人材を育成してきた馬のプロフェッショナル。
              その知見を活かし、保護・再調教・人材育成・地域活性化を一体で進めます。
            </p>
            <Link href="/about" className="btn-outline mt-8">Retouchについて</Link>
          </div>
        </div>
      </Section>

      {/* ===== 広告：協賛グリッド ===== */}
      <AdGrid />

      {/* ===== 引退馬の現実（ISSUE） ===== */}
      <section className="relative overflow-hidden bg-brand-950 py-20 sm:py-28">
        <div className="relative container-x text-white">
          <ImageNote label={IMG.issueFarm} className="mb-6" />
          <p className="eyebrow !text-gold">THE REALITY ｜ 引退競走馬の現実</p>
          <h2 className="section-title mt-4 !text-white">
            引退した競走馬を、待つのは。
          </h2>
          <p className="mt-6 max-w-2xl text-sm sm:text-base leading-loose text-brand-100">
            引退した競走馬の多くは肥育場へ送られ、肉用馬として処分されます。
            これは「かわいそう」では終われない、産業全体の構造的な課題です。
            まずは、知ることから始めてください。
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
            {[
              { t: "肥育場の現実", d: "競走馬を引退した多くの馬たちが、食肉として出荷されるまでを過ごす場所です。" },
              { t: "引退馬問題とは", d: "年間多くの馬が行き場を失う一方で、受け入れ先や支援の仕組みが足りていない。" },
              { t: "署名活動", d: "国や地域への政策提言に向けた署名は5万人をも突破。声を、制度を変える力に。" },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <h3 className="text-lg font-semibold text-gold">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-100">{x.d}</p>
              </div>
            ))}
          </div>
          <Link href="/issue" className="btn-gold mt-10">私たちが向き合う課題を見る</Link>
        </div>
      </section>

      {/* ===== 私たちの取り組み（SOLUTION） ===== */}
      <Section alt>
        <SectionHeading
          eyebrow="OUR SOLUTION ｜ 私たちの取り組み"
          title="保護して終わり、ではない。"
          lead="救出から、再調教、譲渡、教育、福祉、観光、そして地域活性化まで。Retouchは馬の一生に寄り添い、馬と人と地域がともに幸せになる仕組みをつくります。"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <Link key={s.no} href={s.href} className="group block">
              <figure>
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={s.image}
                    alt={s.title}
                    className={`h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      s.crop ? "object-[50%_20%]" : ""
                    }`}
                  />
                  <span className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
                    {s.no}
                  </span>
                </div>
                <figcaption className="mt-4">
                  <h3 className="text-lg font-semibold text-black">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/80">{s.body}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-gold">詳しく →</span>
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>
      </Section>

      {/* ===== 広告：横長バナー ===== */}
      <AdBanner
        badge="SPONSORED ｜ 企業協賛募集"
        title="貴社のCSRに、馬と地域の未来を。"
        body="Retouchはともに「馬と人と地域の未来を創る企業スポンサー」を募集しています。"
        cta="協賛を相談する"
        href="https://item.rakuten.co.jp/f272167-kawachinagano/15152-40001192/"
        tone="gold"
      />

      {/* ===== 馬たちの紹介（HORSES） ===== */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="OUR HORSES ｜ 馬たちの紹介"
            title="救われた、それぞれの物語。"
          />
          <Link href="/horses" className="btn-outline">すべての馬を見る</Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HORSES.slice(0, 4).map((h) => (
            <HorseCard key={h.name} horse={h} />
          ))}
        </div>
      </Section>

      {/* ===== 馬ごとの支援状況ランキング（SUPPORT） ===== */}
      <Section alt>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="SUPPORT STATUS ｜ 馬ごとの支援状況"
            title="いま、応援を待っている子がいます。"
            lead="一頭ごとの月間支援の達成状況を、retouch.salon と連動して公開しています。支援が手薄な子も、応援が集まっている子も、あなたの一歩で次の命へつながります。"
          />
          <SiteLink href={SITE.membersUrl} className="btn-outline">支援状況をすべて見る</SiteLink>
        </div>
        <div className="mt-12">
          <SupportRanking />
        </div>
      </Section>

      {/* ===== お知らせ & メディア ===== */}
      <Section alt>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="NEWS ｜ お知らせ" title="新着情報" />
            <ul className="mt-8 divide-y divide-brand-900/10">
              {NEWS.slice(0, 5).map((n) => (
                <li key={n.title} className="flex gap-4 py-4">
                  <time className="shrink-0 text-sm text-ink/50">{n.date}</time>
                  <span className="shrink-0 rounded-full bg-brand-100 px-3 py-0.5 text-[11px] font-semibold text-brand-700 h-fit">
                    {n.category}
                  </span>
                  <p className="text-sm text-ink/80 hover:text-brand-700">{n.title}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="MEDIA ｜ メディア掲載" title="取材・掲載実績" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {MEDIA.slice(0, 4).map((m) => (
                <article key={m.title} className="card flex flex-col">
                  <Placeholder label={`${m.outlet}（掲載イメージ）`} className="h-28 w-full" />
                  <div className="p-4">
                    <div className="flex items-center justify-between text-[11px] text-ink/50">
                      <span className="font-semibold text-brand-600">{m.outlet}</span>
                      <span>{m.date}</span>
                    </div>
                    <p className="mt-2 text-sm leading-snug text-ink/85">{m.title}</p>
                  </div>
                </article>
              ))}
            </div>
            <Link href="/media" className="btn-outline mt-6">メディア情報を見る</Link>
          </div>
        </div>
      </Section>

      {/* ===== 最終CTA ===== */}
      <Section>
        <CTA
          backgroundImage={IMG.ctaBg}
          title="共に、馬たちの未来を創る。"
          body="月々1,000円台からの会員支援、一口オーナー、法人協賛、ふるさと納税。あなたに合った方法で、引退競走馬の命をつなぐことができます。"
          primary={{ label: "応援する（会員・寄付）", href: SITE.donateUrl }}
          secondary={{ label: "パートナーを相談する", href: "/partners" }}
        />
      </Section>
    </>
  );
}
