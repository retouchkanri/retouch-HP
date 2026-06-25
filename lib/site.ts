// ============================================================================
// Retouch (リタッチ) — サイト基本設定 / Site configuration
// 引退競走馬保護団体 Retouch 公式サイト
// 代表：野口佳嗣（株式会社馬事学院 代表取締役）
// ============================================================================

export const SITE = {
  name: "Retouch",
  nameJa: "リタッチ",
  tagline: "命をつなぐ。引退競走馬と、人と、地域の未来へ。",
  seoTitle: "Retouch（公式）リタッチサイト／肥育場で過ごす引退馬の保護へ",
  description:
    "引退競走馬の支援や保護。肥育場から屠殺される馬を保護し、人と共に生きる新しい道へ。引退馬の保護・支援団体Retouch（リタッチ）寄付・支援・企業協賛受付中です",
  keywords: [
    "引退馬",
    "Retouch",
    "リタッチ",
    "馬",
    "支援",
    "引退競走馬",
    "寄付",
    "協賛",
    "競馬",
    "引き取り",
  ],
  ceo: "野口 佳槻",
  ceoRole: "株式会社　リタッチ　代表",
  orgName: "引退馬支援団体　Retouch（リタッチ）",
  founded: "令和5年11月（代表交代に伴い再始動）",
  email: "info@retouch-members.com",
  tel: "050-6875-3336",
  telNote: "リタッチ担当者をお呼び出しください",
  hq: "〒586-0031 大阪府河内長野市高向2001 ホースレスト内",
  activityBases: "千葉県八街市・山武市／大阪府河内長野市",
  activityBasesNote: "※山武市雨坪10番地　東関東馬事高等学院内",
  mapQuery: "大阪府河内長野市高向2001 ホースレスト",
  membersUrl: "https://retouch.salon/",
  donateUrl: "https://retouch.salon/donate",
  loginUrl: "https://retouch.salon/login",
  youtube: "https://www.youtube.com/@Retouch2023",
  youtubeSubscribeUrl:
    "https://www.youtube.com/channel/UCXFZsW4-dvsAr0-JbEIXPdQ/?sub_confirmation=1",
  petitionUrl:
    "https://www.change.org/p/%E5%BC%95%E9%80%80%E7%AB%B6%E8%B5%B0%E9%A6%AC%E3%81%AE%E6%9C%AA%E6%9D%A5%E3%82%92%E5%AE%88%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AB-%E3%81%82%E3%81%AA%E3%81%9F%E3%81%AE%E7%BD%B2%E5%90%8D%E3%81%8C%E5%BF%85%E8%A6%81%E3%81%A7%E3%81%99",
  petitionVideoUrl: "https://www.youtube.com/watch?v=aOg5jTScgIQ",
  instagram: "https://www.instagram.com/bajigakuin/",
  line: "https://line.me/ti/p/%40410yxdcp",
  x: "https://x.com/retouch_menbers",
  tiktok: "https://www.tiktok.com/@retouch_00",
  addresses: [
    "〒586-0031 大阪府河内長野市高向2001 ホースレスト内",
    "活動拠点：千葉県八街市・山武市／大阪府河内長野市",
    "※山武市雨坪10番地　東関東馬事高等学院内",
  ],
};

export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&hl=ja&z=15&output=embed`;
export const MAP_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}`;

export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export function isExternalUrl(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export type NavItem = {
  label: string;
  labelEn: string;
  href: string;
  sections?: string[];
};

export const NAV: NavItem[] = [
  { label: "ホーム", labelEn: "HOME", href: "/" },
  {
    label: "Retouchとは",
    labelEn: "ABOUT",
    href: "/about",
    sections: ["私たちの想い", "代表メッセージ", "会社概要", "目指す未来"],
  },
  {
    label: "引退競走馬の現実",
    labelEn: "ISSUE",
    href: "/issue",
    sections: ["肥育場の現実", "引退馬問題とは", "署名活動", "私たちが向き合う課題"],
  },
  {
    label: "私たちの取り組み",
    labelEn: "SOLUTION",
    href: "/solution",
    sections: [
      "伝える・知ってもらう",
      "支える仕組みをつくる",
      "新しい役割をつくる",
      "次世代を育てる",
    ],
  },
  {
    label: "活動実績",
    labelEn: "IMPACT",
    href: "/impact",
    sections: ["保護馬53頭", "支援者600名超", "YouTube登録者2万人超", "署名5万人超", "Youtube配信活動"],
  },
  {
    label: "馬たちの紹介",
    labelEn: "HORSES",
    href: "/horses",
    sections: ["現在の保護馬", "卒業馬", "オーナー決定馬", "馬たちの物語"],
  },
  {
    label: "共に未来を創る",
    labelEn: "PARTNERS",
    href: "/partners",
    sections: [
      "企業スポンサー募集",
      "行政連携",
      "乗馬クラブ募集",
      "観光牧場募集",
      "学校・教育機関との連携",
    ],
  },
  {
    label: "メディア・取材",
    labelEn: "MEDIA",
    href: "/media",
    sections: ["メディア掲載実績", "プレスリリース", "取材依頼", "写真素材", "代表プロフィール"],
  },
  {
    label: "応援する",
    labelEn: "SUPPORT",
    href: "/support",
    sections: ["会員になる", "一口支援", "ポニーチーム", "法人協賛", "寄付・支援"],
  },
  { label: "お問い合わせ", labelEn: "CONTACT", href: "/contact" },
];

/** ヘッダー用の簡略ナビ（日本語のみ） */
export const HEADER_NAV = [
  { label: "ホーム", href: "/" },
  { label: "私たちについて", href: "/about" },
  { label: "取り組み", href: "/solution" },
  { label: "活動実績", href: "/impact" },
  { label: "馬たち", href: "/horses" },
  { label: "お問い合わせ", href: "/contact" },
];

// トップレベル統計（クライアント指定の表示数値）
export const STATS = [
  { value: "53", unit: "頭", label: "累計保護馬", sub: "肥育場・牧場から救出" },
  { value: "600", unit: "名超", label: "支援者・会員", sub: "全国の応援メンバー" },
  { value: "2", unit: "万人超", label: "YouTube登録者", sub: "@Retouch2023" },
  { value: "5", unit: "万人超", label: "署名", sub: "引退馬政策の提言へ" },
];
