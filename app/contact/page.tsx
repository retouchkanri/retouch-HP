import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { IMG } from "@/lib/images";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import { AdSidebar } from "@/components/Ads";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "Retouch（リタッチ）へのお問い合わせ。会員・支援・協賛・連携・取材など、お気軽にご連絡ください。",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="お問い合わせ"
        subtitle="ご支援・ご連携・取材のご相談など、お気軽にご連絡ください。"
        image={IMG.nature}
        crumbs={[{ label: "お問い合わせ" }]}
      />

      <Section alt>
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="GET IN TOUCH"
              title="メッセージを送る"
              lead="下記フォームよりお問い合わせください。内容を確認のうえ、担当者よりご連絡いたします。"
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-brand-800 p-7 text-brand-50">
              <h3 className="text-lg font-semibold text-white">団体情報</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-brand-300">団体名</dt>
                  <dd>Retouch（リタッチ）</dd>
                </div>
                <div>
                  <dt className="text-brand-300">代表</dt>
                  <dd>{SITE.ceo}</dd>
                </div>
                <div>
                  <dt className="text-brand-300">所在地</dt>
                  <dd>{SITE.addresses.map((a) => <span key={a} className="block">{a}</span>)}</dd>
                </div>
                <div>
                  <dt className="text-brand-300">メール</dt>
                  <dd>{SITE.email}</dd>
                </div>
                <div>
                  <dt className="text-brand-300">公式YouTube</dt>
                  <dd>
                    <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                      @Retouch2023
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <AdSidebar />
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeading center eyebrow="FAQ" title="よくあるご質問" />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {[
            { q: "支援したお金は何に使われますか？", a: "会費・寄付の多くは、馬たちの飼養費・治療費・再調教・施設運営に充てられます。会員向けに会計報告も公開しています。" },
            { q: "支援した馬に会えますか？", a: "一口支援・オーナー制度では、見学会や体験を通じて馬に会える・乗れる機会をご用意しています。" },
            { q: "馬を引き取ってもらえますか？", a: "受け入れには状況に応じた調整が必要です。まずはお問い合わせフォームよりご相談ください。" },
            { q: "見学や体験はできますか？", a: "千葉・大阪の拠点で見学会＆懇談会を随時開催しています。日程はお問い合わせまたはYouTube・お知らせでご案内します。" },
          ].map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-900/5">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-brand-900">
                {f.q}
                <span className="ml-4 text-gold transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
