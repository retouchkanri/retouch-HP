// ============================================================================
// サイトコンテンツデータ / Site content data
// ============================================================================
import { IMG, mediaImg } from "./images";

export type Horse = {
  name: string;
  sex: "牡" | "牝" | "騙";
  age: string; // 表示用ラベル
  ageYears: number; // 絞り込み用
  status: "protected" | "graduated" | "owner";
  statusLabel: string;
  personality: string; // 性格
  story: string; // 現在の様子・物語
  before?: string; // 卒業馬：保護前の状況（Before→After用）
  photo?: string; // 卒業馬など：写真URL
  ownerStory?: string; // オーナー決定馬：オーナーストーリー
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
  {
    name: "カイト号",
    sex: "騙",
    age: "8歳",
    ageYears: 8,
    status: "graduated",
    statusLabel: "卒業馬",
    personality: "素直・働き者",
    photo: IMG.graduateKaito,
    before: "競走馬を引退し、行き先が決まらず肥育場へ送られる寸前でした。",
    story:
      "リトレーニングを修了し、提携乗馬クラブの乗用馬としてデビュー。多くの人を背に乗せ、第二の馬生を歩んでいます。",
  },
  {
    name: "ユキ号",
    sex: "牝",
    age: "10歳",
    ageYears: 10,
    status: "graduated",
    statusLabel: "卒業馬",
    personality: "温厚・癒やし系",
    photo: IMG.graduateYuki,
    before: "繁殖を引退後、活躍の場を失っていました。",
    story:
      "観光牧場のふれあい馬として卒業。温厚な性格を活かし、来場者に癒やしを届けています。",
  },
  {
    name: "テンマ号",
    sex: "牡",
    age: "6歳",
    ageYears: 6,
    status: "owner",
    statusLabel: "オーナー決定馬",
    personality: "負けず嫌い・運動神経抜群",
    ownerStory:
      "「もう一度この子の走る姿を見たい」というオーナー様の想いから支援が決定。馬術競技馬を目指して調教中です。",
    story:
      "一口オーナー制度を通じて支援者が決定。サポーターに見守られながら成長しています。",
  },
  {
    name: "コハク号",
    sex: "牝",
    age: "5歳",
    ageYears: 5,
    status: "owner",
    statusLabel: "オーナー決定馬",
    personality: "おっとり・マイペース",
    ownerStory:
      "クラウドファンディングで全国の支援者が集い、オーナーが決定。成長の様子をYouTubeで配信中です。",
    story:
      "多くの支援を受けて救出。オーナー決定後も穏やかに過ごしています。",
  },
  {
    name: "ミナト号",
    sex: "騙",
    age: "11歳",
    ageYears: 11,
    status: "graduated",
    statusLabel: "卒業馬",
    personality: "頼れる兄貴分",
    photo: IMG.graduateMinato,
    before: "高齢で引き取り手が見つからず、処分の対象となっていました。",
    story:
      "馬事学院（バジガク）の教育プログラムを経て、学生たちと共に乗馬へ転用。後進の指導馬として活躍しています。",
  },
];

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
