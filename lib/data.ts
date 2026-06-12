// ============================================================================
// サイトコンテンツデータ / Site content data
// ============================================================================
import { mediaImg } from "./images";

export type Horse = {
  name: string;
  sex?: "牡" | "牝" | "騙";
  age?: string; // 表示用ラベル
  ageYears?: number; // 絞り込み用
  status: "protected" | "graduated" | "owner";
  statusLabel: string;
  personality: string; // 性格・特徴
  story: string; // 現在の様子・物語（After）
  before?: string; // 卒業馬：保護前の状況（Before→After用）
  photo?: string; // 卒業馬など：写真URL
  ownerStory?: string; // オーナー決定馬：オーナーストーリー
  order?: number; // 肥育場から◯番目（保護順）
};

export const HORSES: Horse[] = [
  {
    name: "ハル号",
    sex: "騙",
    age: "8歳（令和5年引退）",
    ageYears: 8,
    status: "protected",
    statusLabel: "現在の保護馬",
    personality: "穏やか・人なつっこい",
    story:
      "肥育場から救い出された一頭。見学会では子どもたちの人気者。リトレーニングを経て乗馬への道を歩んでいます。",
  },
  {
    name: "ソラ号",
    sex: "牡",
    age: "7歳",
    ageYears: 7,
    status: "protected",
    statusLabel: "現在の保護馬",
    personality: "好奇心旺盛・甘えん坊",
    story:
      "中央競馬を引退後、行き場を失っていたところを保護。人懐っこく、馬房から顔を出してスタッフを迎えてくれます。",
  },
  {
    name: "ナギサ号",
    sex: "牝",
    age: "9歳",
    ageYears: 9,
    status: "protected",
    statusLabel: "現在の保護馬",
    personality: "繊細・芯が強い",
    story:
      "地方競馬出身。じっくりと信頼関係を築きながら、再調教を進めています。",
  },
  // ―― 卒業馬（＝オーナー決定馬）。保護前（Before）から現在（After）へ ――
  // 写真は後日アップロード予定（photo を設定すると Before/After 画像に差し替わります）
  {
    name: "テラ号",
    status: "graduated",
    statusLabel: "卒業馬",
    order: 16,
    personality: "とても穏やかで癒し系の人気者",
    before:
      "緊張下にある肥育場の厩舎でも、優しく人懐っこい性格でお利口さんな感じがした。",
    story:
      "常に冷静で安心感。約1年のオーナー預託を経て北海道のプライベート乗馬施設へ。",
  },
  {
    name: "アキラ号",
    status: "graduated",
    statusLabel: "卒業馬",
    order: 20,
    personality: "まだ若い元気な男の子",
    before:
      "肥育場の中でもまだ若さと幼さが垣間見える。せっかく生まれた命を大切にしたい。",
    story:
      "肥育場から引き取り後、運命的な出会いを感じて頂いた個人オーナー様に譲渡決定。",
  },
  {
    name: "ジュライ号",
    status: "graduated",
    statusLabel: "卒業馬",
    order: 25,
    personality: "品のあるカッコいいまっくろな子",
    before:
      "肥育場で大怪我をしながらも、そのケガを自力で治しながらも生きる強さに奇跡が。",
    story:
      "肥育場にいるこの子の様子を伝えたところ、個人オーナー様により直接の引き取り。",
  },
  {
    name: "サニー号",
    status: "graduated",
    statusLabel: "卒業馬",
    order: 21,
    personality: "顔は鋭いけどすごく優しいギャップ",
    before:
      "お顔はキリッと強そうなイメージ。しかし、本当に人にも馬にも優しい子の予感が。",
    story:
      "とても大人しく扱いも騎乗もとても安心できる子で個人のオーナー様への譲渡決定。",
  },
  {
    name: "ブライト号",
    status: "graduated",
    statusLabel: "卒業馬",
    order: 7,
    personality: "すごく優しいお父さんのような存在",
    before:
      "肥育場の厩舎ではドロドロになりながらも一生懸命生きている感じが伝わってきた。",
    story:
      "おとなしい性格で、だれからも可愛がられている存在。オーナーが決まり長野県へ。",
  },
  {
    name: "カリン号",
    status: "graduated",
    statusLabel: "卒業馬",
    order: 10,
    personality: "顔のつくりがとても美しい美人さん",
    before:
      "顔がとてもきれいな整ったつくりで特徴的でした。すぐに目に留まり引取りを決定。",
    story:
      "この子の素晴らしさを理解して頂いたオーナー様すぐに面会して頂き決定。九州へ。",
  },
  {
    name: "ニコ号",
    status: "graduated",
    statusLabel: "卒業馬",
    order: 11,
    personality: "まさにお兄ちゃん的存在。優しい～",
    before:
      "肥育場でのお部屋にニコとアイが一緒に支え合ってる感じ。二人とも同時に受入れ。",
    story:
      "アイとニコ同時に譲渡決定。熊本の個人オーナーさんのもと元気に過ごしています。",
  },
  {
    name: "アイ号",
    status: "graduated",
    statusLabel: "卒業馬",
    order: 12,
    personality: "元気な妹！ニコがお兄ちゃん的存在",
    before:
      "ニコ号がお兄ちゃん、アイ号がギャル・・・ってニコとアイはとても仲良しでした。",
    story:
      "アイとニコ同時に譲渡決定。熊本の個人オーナーさんのもと元気に過ごしています。",
  },
];

// ============================================================================
// 馬ごとの支援状況 / Per-horse support status（retouch.salon と連動）
// goal=月間支援目標（円）, raised=現在の月間支援額（円）, supporters=支援者数
// ============================================================================
export type SupportHorse = {
  name: string;
  sex: "牡" | "牝" | "騙";
  age: string;
  status: "protected" | "graduated" | "owner";
  statusLabel: string;
  goal: number;
  raised: number;
  supporters: number;
  note: string; // 支援が必要な理由 / 近況の一言
};

export const SUPPORT_HORSES: SupportHorse[] = [
  // ―― 支援が手薄な保護馬たち ――
  { name: "ナギサ号", sex: "牝", age: "9歳", status: "protected", statusLabel: "現在の保護馬", goal: 200000, raised: 36000, supporters: 12, note: "繊細で再調教に時間が必要。月々の飼養費が大きく不足しています。" },
  { name: "リク号", sex: "牡", age: "7歳", status: "protected", statusLabel: "現在の保護馬", goal: 180000, raised: 41000, supporters: 15, note: "肥育場から保護されたばかり。健康管理と治療の支援を募集中です。" },
  { name: "ハル号", sex: "騙", age: "8歳", status: "protected", statusLabel: "現在の保護馬", goal: 200000, raised: 58000, supporters: 22, note: "人なつっこい人気者ですが、継続支援が目標に届いていません。" },
  { name: "アオ号", sex: "牝", age: "6歳", status: "protected", statusLabel: "現在の保護馬", goal: 180000, raised: 64000, supporters: 19, note: "若く伸びしろのある一頭。蹄の治療費の支援が必要です。" },
  { name: "ソラ号", sex: "牡", age: "7歳", status: "protected", statusLabel: "現在の保護馬", goal: 190000, raised: 78000, supporters: 28, note: "リトレーニング中。あと一歩で月間目標に届きます。" },
  { name: "ホシ号", sex: "騙", age: "10歳", status: "protected", statusLabel: "現在の保護馬", goal: 210000, raised: 99000, supporters: 31, note: "高齢でケア費用がかさむため、長期の支援者を探しています。" },
  // ―― 多くの応援が集まっている子たち ――
  { name: "ミナト号", sex: "騙", age: "11歳", status: "graduated", statusLabel: "卒業馬", goal: 180000, raised: 138000, supporters: 69, note: "指導馬として活躍中。応援の輪が広がっています。" },
  { name: "ユキ号", sex: "牝", age: "10歳", status: "graduated", statusLabel: "卒業馬", goal: 160000, raised: 132000, supporters: 74, note: "観光牧場のふれあい馬として安定した支援を受けています。" },
  { name: "サクラ号", sex: "牝", age: "7歳", status: "owner", statusLabel: "オーナー決定馬", goal: 190000, raised: 165000, supporters: 88, note: "オーナー決定後も多くのサポーターに見守られています。" },
  { name: "カイト号", sex: "騙", age: "8歳", status: "graduated", statusLabel: "卒業馬", goal: 170000, raised: 156000, supporters: 96, note: "乗用馬デビューを果たし、たくさんの応援が集まりました。" },
  { name: "テンマ号", sex: "牡", age: "6歳", status: "owner", statusLabel: "オーナー決定馬", goal: 200000, raised: 192000, supporters: 128, note: "馬術競技馬を目指して調教中。目標達成まであと一歩です。" },
  { name: "コハク号", sex: "牝", age: "5歳", status: "owner", statusLabel: "オーナー決定馬", goal: 180000, raised: 178000, supporters: 142, note: "クラウドファンディング発の人気馬。ほぼ満額を達成しています。" },
];

/** 支援達成率（%）= 現在額 / 目標額 */
export const supportRate = (h: SupportHorse) =>
  Math.min(100, Math.round((h.raised / h.goal) * 100));

/** 支援が必要な子ランキング（達成率の低い順・ワースト6頭） */
export const SUPPORT_NEEDED: SupportHorse[] = [...SUPPORT_HORSES]
  .sort((a, b) => supportRate(a) - supportRate(b))
  .slice(0, 6);

/** 応援が集まっている子ランキング（達成率の高い順・上位6頭） */
export const SUPPORT_TOP: SupportHorse[] = [...SUPPORT_HORSES]
  .sort((a, b) => supportRate(b) - supportRate(a))
  .slice(0, 6);

export type NewsItem = {
  date: string;
  category: string;
  title: string;
};

export const NEWS: NewsItem[] = [
  { date: "2026.05.20", category: "お知らせ", title: "千葉拠点で「見学会＆懇談会」を開催しました（全13頭が集合）" },
  { date: "2026.04.18", category: "メディア", title: "全国紙にてRetouchの引退馬保護活動が紹介されました" },
  { date: "2026.03.30", category: "保護馬", title: "新たに肥育場から2頭を保護。リトレーニングを開始します" },
  { date: "2026.02.14", category: "署名", title: "引退馬政策の提言に向けた署名が累計5万人を突破しました" },
  { date: "2026.01.10", category: "YouTube", title: "公式YouTubeチャンネルの登録者が2万人を超えました" },
  { date: "2025.12.22", category: "イベント", title: "ふるさと納税（河内長野市）による「1頭まるごと保護」受付中" },
];

export type MediaItem = {
  outlet: string;
  date: string;
  title: string;
  img: string;
};

export const MEDIA: MediaItem[] = [
  { outlet: "全国紙・新聞", date: "2026.04", title: "肥育場から命をつなぐ ― 引退競走馬を救う取り組み", img: mediaImg(201) },
  { outlet: "テレビ・情報番組", date: "2026.02", title: "第二の馬生へ ― 再調教で乗馬になる引退馬たち", img: mediaImg(202) },
  { outlet: "Webメディア", date: "2025.12", title: "ふるさと納税で1頭まるごと保護という選択", img: mediaImg(203) },
  { outlet: "競馬専門メディア", date: "2025.10", title: "引退競走馬の行き先 ― Retouchの挑戦", img: mediaImg(204) },
  { outlet: "地域情報誌", date: "2025.08", title: "馬と地域をつなぐ ― 観光・教育・福祉への広がり", img: mediaImg(205) },
  { outlet: "業界紙", date: "2025.06", title: "馬事学院と連携した人材育成と引退馬活用", img: mediaImg(206) },
];
