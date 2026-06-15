import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { IMG } from "@/lib/images";
import { getFaq } from "@/lib/content";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import { AdSidebar } from "@/components/Ads";

export const metadata: Metadata = {
  title: {
    absolute: "引退馬支援団体リタッチ／お問い合わせ・質問Q&A",
  },
  description:
    "引退馬の引き取りや引退馬保護・引退馬支援へのお問い合わせはリタッチまでお気軽にお問い合わせください。Retouch事務局、大阪府河内長野市",
  keywords: ["質問", "リタッチ", "電話", "馬", "支援団体", "申し込み方法"],
};

export default async function ContactPage() {
  const faqItems = await getFaq();
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="お問い合わせ"
        subtitle="ご支援・ご連携・取材のご相談など、お気軽にご連絡ください。"
        image={IMG.nature}
        backgroundImage={IMG.contactHeroBg}
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
        <SectionHeading eyebrow="FAQ" title="よくある質問" />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {faqItems.map((f) => (
            <details key={f.question} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-900/5">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-brand-900">
                {f.question}
                <span className="ml-4 text-gold transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{f.answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
