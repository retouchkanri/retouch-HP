import type { Metadata } from "next";
import { MAP_EMBED_URL } from "@/lib/site";
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
            <div className="overflow-hidden rounded-3xl shadow-sm ring-1 ring-brand-900/10">
              <iframe
                src={MAP_EMBED_URL}
                title="所在地マップ（ホースレスト）"
                className="aspect-[4/3] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
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
              <summary className="flex cursor-pointer items-start justify-between gap-3 text-sm font-semibold text-brand-900">
                <span className="min-w-0 flex-1 text-pretty">{f.question}</span>
                <span className="shrink-0 text-gold transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{f.answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
