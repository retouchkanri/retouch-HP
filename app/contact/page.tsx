import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { IMG } from "@/lib/images";
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

export default function ContactPage() {
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
          {[
            { q: "Retouchとはどのような活動をしていますか？", a: "引退競走馬や肥育場にいる馬たちに新たな役割や活躍の場をつくり、人と馬が支え合う社会の実現を目指しています。" },
            { q: "なぜ馬を保護しているのですか？", a: "引退後の進路が見つからず、肥育場へ向かう馬たちがいます。Retouchでは、そのような馬たちに新しい役割や活躍の場をつくり、第二の人生を支える活動を行っています。" },
            { q: "肥育場とは何ですか？", a: "肥育場とは、食肉用として出荷される前の馬が集められる施設です。Retouchでは、その中から新たな未来をつくれる可能性のある馬たちを受け入れています。" },
            { q: "保護された馬たちはその後どうなりますか？", a: "乗馬、教育活動、観光、セラピー、ふれあい活動など、それぞれの個性に合った新しい役割を見つけ、人と関わりながら暮らしています。" },
            { q: "会員になるにはどうすればよいですか？", a: "会員登録ページよりお申し込みいただけます。スマートフォンやパソコンから簡単にお手続きいただけます。" },
            { q: "支援する馬は選べますか？", a: "はい。一口・半口支援では応援したい馬を選んでご支援いただけます。" },
            { q: "複数の馬を支援できますか？", a: "はい。複数頭への支援や追加支援も可能です。" },
            { q: "支援金はどのように使われますか？", a: "馬たちの飼育費、医療費、輸送費、施設維持費、教育活動費などに活用しています。" },
            { q: "支援した馬に会うことはできますか？", a: "はい。見学会や交流イベントを定期的に開催しております。詳細は会員ページやお知らせをご確認ください。" },
            { q: "馬たちの近況は知ることができますか？", a: "会員ページや活動報告、動画配信などを通じて定期的にお知らせしています。" },
            { q: "見学会やイベントには参加できますか？", a: "はい。会員向けイベントや一般参加可能なイベントを開催しております。アプリや会員ページからお申し込みいただけます。" },
            { q: "支援内容の変更や追加はできますか？", a: "はい。マイページから支援内容の確認・変更・追加支援のお手続きが可能です。" },
            { q: "支援を停止・退会したい場合はどうすればよいですか？", a: "マイページまたはお問い合わせフォームよりお手続きいただけます。" },
            { q: "企業や団体として支援することはできますか？", a: "はい。企業・団体様からのご支援や協賛も受け付けております。お気軽にお問い合わせください。" },
            { q: "ボランティアとして参加できますか？", a: "イベント運営や環境整備など、活動内容に応じて募集を行っています。募集情報はお知らせページをご確認ください。" },
            { q: "Retouchの目指す未来は何ですか？", a: "馬を「救う」だけでなく、一頭一頭に新たな役割をつくり、人と馬が支え合う社会を実現することです。皆様のご支援が、その未来を支える大きな力になっています。" },
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
