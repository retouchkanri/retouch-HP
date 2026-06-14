// ============================================================================
// 画像「説明テキスト」集約 / Centralized image DESCRIPTIONS (placeholder mode)
// ----------------------------------------------------------------------------
// 現在サイトは「画像なし・プレースホルダー表示」モードです。
// 各値は実画像URLではなく、その枠に入る画像の説明テキスト。
// <Placeholder label={IMG.xxx} /> で枠＋説明文として表示されます。
//
// ■ 実画像に切り替えるとき
//   ・retouch-members.com 等の画像URLに各値を置き換え、
//     表示側を <Placeholder> から <img> に戻すだけ。
// ■ ルール：人物が写る枠は必ず「日本人」の写真にすること。
// ============================================================================

export const IMG = {
  // ── ヒーロー / 大判（馬・風景：人物なしでOK）──────────────────────
  aboutHeroBg: "/2_1.png",
  aboutMessage: "/2_2.png",
  ceoPhoto: "/画像２.jpg",
  /** 代表写真（画像２.jpg）の実寸。表示時はこの比率を維持すること */
  ceoPhotoSize: { width: 2048, height: 1365 },
  adSponsor: "/2_4_1.png",
  adFurusato: "/2_4_2.png",
  contactCta: "/contact.png",
  ctaBg: "/contact2.png",
  aboutFuture: "/2_5.png",
  heroHorse: "メインビジュアル：夕陽の中を駆ける馬",
  heroField: "牧場で穏やかに過ごす馬",
  heroRacehorse: "ターフを駆ける現役時代の競走馬",

  // ── 代表・人物・現場（人物＝必ず日本人）──────────────────────────
  ceo: "代表・野口佳嗣（日本人男性）のポートレート",
  staff: "Retouchのスタッフ・会員（日本人）の集合写真",
  training: "再調教の様子（日本人ハンドラーと馬）",
  riding: "乗馬を楽しむ様子（日本人ライダーと馬）",

  // ── 課題（ISSUE）（馬・風景：人物なしでOK）──────────────────────
  issueHeroBg: "/3_h.png",
  issueFarm: "肥育場で出荷を待つ引退競走馬",
  issueStable: "/3_1.jpg",
  issueSign: "/3_2.png",

  // ── 取り組み（SOLUTION）──────────────────────────────────────────
  solutionHeroBg: "/4_h.png",
  solutionProtection: "/4_1.png",
  solutionRetraining: "/4_2.png",
  solutionOwner: "/4_3.png",
  solutionEducation: "/4_4.png",
  solutionWelfare: "/4_5.png",
  solutionTourism: "/4_6.png",
  solutionCommunity: "/4_7.png",
  impactHeroBg: "/5_h.png",
  impactProtected: "/5_1.png",
  impactSupporters: "/5_2.png",
  impactYoutube: "/5_3.png",
  impactPetition: "/5_4.png",
  graduateKaito: "/6_2_1.png",
  graduateYuki: "/6_2_2.png",
  graduateMinato: "/6_2_3.png",
  horsesHeroBg: "/6_h.png",
  partnersHeroBg: "/7_h.png",
  partnerSponsor: "/7_1.png",
  partnerGovernment: "/7_2.png",
  partnerRidingClub: "/7_3.png",
  partnerTourism: "/7_4.png",
  partnerEducation: "/7_5.png",
  mediaHeroBg: "/8_h.png",
  supportHeroBg: "/9_h.png",
  supportOneShare: "/9_1.png",
  supportPony: "/9_2.png",
  supportCorporate: "/9_3.png",
  supportDonation: "/9_4.png",
  contactHeroBg: "/10_h.png",
  adRiding: "/10_1.png",
  rescue: "肥育場から救出される馬",
  retrain: "パドックでのリトレーニング風景",
  owner: "一口オーナーと馬（日本人）",
  education: "教育事業：馬を学ぶ学生（日本人）",
  welfare: "福祉事業：馬とふれあう子ども・家族（日本人）",
  tourism: "観光事業：牧場を訪れる来場者（日本人）と馬",
  community: "馬のいる地域の風景",

  // ── 風景・地域（人物なしでOK）────────────────────────────────────
  ranch: "緑豊かな牧場の風景",
  pasture: "放牧地でくつろぐ馬",
  nature: "自然・緑あふれる風景",

  // ── バナー帯 ──────────────────────────────────────────────────────
  bannerWide: "力強く駆ける馬（横長バナー）",
  bannerSupport: "支援する人（日本人）と馬（横長バナー）",
};

// ── 保護馬の写真（馬：人物なしでOK）──────────────────────────────────
export const horseImg = (lock: number) => `保護馬の写真 #${lock}`;

// ── メディア掲載イメージ ────────────────────────────────────────────
export const mediaImg = (lock: number) => `掲載メディアのイメージ #${lock}`;
