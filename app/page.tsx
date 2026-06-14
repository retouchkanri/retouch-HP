import Link from "next/link";
import SiteLink from "@/components/SiteLink";
import { SITE } from "@/lib/site";
import { IMG } from "@/lib/images";
import { HORSES, NEWS, MEDIA } from "@/lib/data";
import { Section, SectionHeading } from "@/components/Section";
import { HorseCard, CTA } from "@/components/Blocks";
import SupportRanking from "@/components/SupportRanking";
import { AdBanner, AdGrid } from "@/components/Ads";
import Image from "next/image";
import MediaCard from "@/components/MediaCard";
import Placeholder from "@/components/Placeholder";
import ScrollDownArrow from "@/components/ScrollDownArrow";

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
      <section data-hero className="relative h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] w-full overflow-hidden">
        {/* デスクトップ用背景 */}
        <Image
          src="/bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover sm:block"
        />
        {/* モバイル用背景（縦長） */}
        <Image
          src="/bg-m.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover sm:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-900/55 to-brand-900/30" aria-hidden />
        <div className="relative z-10 w-full h-full flex flex-col justify-between pt-4 pb-10 px-5 sm:justify-center sm:pl-[24vw] sm:pr-[8vw] lg:pl-[20vw] lg:pr-[10vw] sm:pb-10 sm:pt-0">
          {/* バッジ（モバイル：1行4列・約半分サイズ） */}
          <div className="grid grid-cols-4 gap-1.5 sm:hidden motion-safe:animate-fadeUp">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/badge-1.png" alt="53頭 累計保護馬" className="w-full rounded-md" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/badge-2.png" alt="600名超 支援者・会員" className="w-full rounded-md" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/badge-3.png" alt="2万人超 YouTube登録者" className="w-full rounded-md" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/badge-4.png" alt="5万人超 署名" className="w-full rounded-md" />
          </div>
          {/* テキスト＋バッジ（デスクトップ：縦並び） */}
          <div className="sm:max-w-2xl lg:max-w-3xl">
            <p className="eyebrow !text-gold animate-fadeUp sm:!text-sm lg:!text-base">RETOUCH ｜ 引退競走馬の保護団体</p>
            <h1 className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.35] text-white animate-fadeUp">
              命をつなぐ。
              <br />
              引退競走馬と、人と、
              <br />
              地域の未来へ。
            </h1>
            <p className="mt-5 text-sm sm:text-lg lg:text-xl leading-loose text-brand-100 motion-safe:animate-fadeUp">
              役目を終えた競走馬の多くは、肥育場で肉用馬として最期を迎えます。
              Retouch（リタッチ）は、その馬たちを救い出し、再調教を通じて
              人と共に生きる新しい道を切り拓きます。
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap animate-fadeUp">
              <SiteLink href={SITE.membersUrl} className="btn-gold w-full text-base sm:w-auto sm:px-8 sm:py-4 sm:text-base lg:text-lg">いますぐ応援する</SiteLink>
              <Link href="/issue" className="btn-white w-full text-base sm:w-auto sm:px-8 sm:py-4 sm:text-base lg:text-lg">引退馬の現実を知る</Link>
            </div>
            {/* バッジ（デスクトップ：テキスト下に4列） */}
            <div className="hidden sm:grid grid-cols-4 gap-x-4 lg:gap-x-6 mt-10 lg:mt-12 w-full animate-fadeUp">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/badge-1.png" alt="53頭 累計保護馬" className="w-full" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/badge-2.png" alt="600名超 支援者・会員" className="w-full" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/badge-3.png" alt="2万人超 YouTube登録者" className="w-full" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/badge-4.png" alt="5万人超 署名" className="w-full" />
            </div>
          </div>
        </div>
        <ScrollDownArrow />
      </section>

      <div data-stats aria-hidden />

      {/* ===== 私たちの想い ===== */}
      <Section alt>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Image
            src={IMG.ceoPhoto}
            alt="代表 野口佳槻と馬"
            width={IMG.ceoPhotoSize.width}
            height={IMG.ceoPhotoSize.height}
            className="w-full h-auto"
            sizes="(max-width: 1024px) 100vw, 50vw"
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
      <section className="relative overflow-hidden py-20 sm:py-28">
        <img src="/1_3bg.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-brand-950/75" aria-hidden />
        <div className="relative container-x text-white">
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
            lead="一頭ごとの月間支援の達成状況を公開しています。支援が手薄な子も、応援が集まっている子も、あなたの一歩で次の命へつながります。"
          />
          <Link href="/support/status" className="btn-outline">支援状況をすべて見る</Link>
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
                <li key={n.title} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:gap-4">
                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    <time className="text-sm text-ink/50">{n.date}</time>
                    <span className="rounded-full bg-brand-100 px-3 py-0.5 text-[11px] font-semibold text-brand-700">
                      {n.category}
                    </span>
                  </div>
                  <p className="min-w-0 text-sm leading-relaxed text-ink/80 sm:flex-1">{n.title}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="MEDIA ｜ メディア掲載" title="取材・掲載実績" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {MEDIA.slice(0, 4).map((m) => (
                <MediaCard key={`${m.date}-${m.title}`} item={m} />
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
