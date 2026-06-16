import type { NewsItem, MediaItem } from "@/lib/data";
import { NEWS, MEDIA } from "@/lib/data";
import { ALL_HORSES, supportRate, type HorseProfile } from "@/lib/horses";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export type DbNewsItem = NewsItem & { id: string };
export type DbMediaItem = MediaItem & { id: string };

type NewsRow = {
  id: string;
  date: string;
  category: string;
  title: string;
  img: string | null;
  body: string | null;
  link_url: string | null;
};

type MediaRow = {
  id: string;
  outlet: string;
  date: string;
  title: string;
  img: string;
  url: string | null;
  img_alt: string | null;
  media_type: string | null;
  sort_order: number;
};

function mapNews(row: NewsRow): DbNewsItem {
  return {
    id: row.id,
    date: row.date,
    category: row.category,
    title: row.title,
    img: row.img ?? undefined,
    body: row.body ?? undefined,
    linkUrl: row.link_url ?? undefined,
  };
}

function mapMedia(row: MediaRow): DbMediaItem {
  return {
    id: row.id,
    outlet: row.outlet,
    date: row.date,
    title: row.title,
    img: row.img,
    url: row.url ?? undefined,
    imgAlt: row.img_alt ?? undefined,
    mediaType: row.media_type ?? undefined,
  };
}

export async function isDatabaseReady(): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("news_items").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news_items")
      .select("id, date, category, title, img, body, link_url")
      .order("date", { ascending: false });

    if (error || !data?.length) return NEWS;
    return data.map(mapNews);
  } catch {
    return NEWS;
  }
}

export async function getMedia(): Promise<MediaItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("media_items")
      .select("id, outlet, date, title, img, url, img_alt, media_type, sort_order")
      .order("sort_order", { ascending: true })
      .order("date", { ascending: false });

    if (error || !data?.length) return MEDIA;
    return data.map(mapMedia);
  } catch {
    return MEDIA;
  }
}

export async function getAdminNews(): Promise<DbNewsItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_items")
    .select("id, date, category, title, img, body, link_url")
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapNews);
}

export async function getAdminMedia(): Promise<DbMediaItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_items")
    .select("id, outlet, date, title, img, url, img_alt, media_type, sort_order")
    .order("sort_order", { ascending: true })
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMedia);
}

// ============================================================================
// Horses
// ============================================================================

export type DbHorse = {
  id: string;
  name: string;
  slug: string;
  sex?: "牡" | "牝" | "騙";
  age?: string;
  ageYears?: number;
  status: "protected" | "graduated" | "owner";
  statusLabel: string;
  orderNum?: number;
  personality: string;
  story: string;
  before?: string;
  photo?: string;
  ownerStory?: string;
  sortOrder: number;
  goal: number;
  raised: number;
  supporters: number;
  note?: string;
  pendingDetails?: boolean;
};

type HorseRow = {
  id: string;
  name: string;
  slug: string;
  sex: string | null;
  age: string | null;
  age_years: number | null;
  status: string;
  status_label: string;
  order_num: number | null;
  personality: string;
  story: string;
  before_story: string | null;
  photo: string | null;
  owner_story: string | null;
  sort_order: number;
  goal: number;
  raised: number;
  supporters: number;
  note: string | null;
};

function mapHorse(row: HorseRow): DbHorse {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sex: (row.sex as "牡" | "牝" | "騙") ?? undefined,
    age: row.age ?? undefined,
    ageYears: row.age_years ?? undefined,
    status: row.status as "protected" | "graduated" | "owner",
    statusLabel: row.status_label,
    orderNum: row.order_num ?? undefined,
    personality: row.personality,
    story: row.story,
    before: row.before_story ?? undefined,
    photo: row.photo ?? undefined,
    ownerStory: row.owner_story ?? undefined,
    sortOrder: row.sort_order,
    goal: row.goal,
    raised: row.raised,
    supporters: row.supporters,
    note: row.note ?? undefined,
  };
}

export function dbHorseToProfile(h: DbHorse): HorseProfile {
  return {
    slug: h.slug,
    name: h.name,
    sex: h.sex ?? "牡",
    age: h.age ?? "不明",
    status: h.status,
    statusLabel: h.statusLabel,
    order: h.orderNum,
    personality: h.personality,
    story: h.story,
    before: h.before,
    photo: h.photo,
    note: h.note,
    goal: h.goal,
    raised: h.raised,
    supporters: h.supporters,
    pendingDetails: h.pendingDetails ?? h.name.includes("登録待ち"),
  };
}

function horsesFallback(): HorseProfile[] {
  return ALL_HORSES;
}

export async function getHorses(): Promise<HorseProfile[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("horses")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error || !data?.length) return horsesFallback();
    return data.map((row: HorseRow) => dbHorseToProfile(mapHorse(row)));
  } catch {
    return horsesFallback();
  }
}

export async function getHorseBySlugDb(slug: string): Promise<HorseProfile | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("horses")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data) return undefined;
    return dbHorseToProfile(mapHorse(data as HorseRow));
  } catch {
    return undefined;
  }
}

export async function getAdminHorses(): Promise<DbHorse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("horses")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: HorseRow) => mapHorse(row));
}

// ============================================================================
// FAQ
// ============================================================================

export type DbFaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
};

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

function mapFaq(row: FaqRow): DbFaqItem {
  return { id: row.id, question: row.question, answer: row.answer, sortOrder: row.sort_order };
}

export const FAQ_FALLBACK: { question: string; answer: string }[] = [
  { question: "Retouchとはどのような活動をしていますか？", answer: "引退競走馬や肥育場にいる馬たちに新たな役割や活躍の場をつくり、人と馬が支え合う社会の実現を目指しています。" },
  { question: "なぜ馬を保護しているのですか？", answer: "引退後の進路が見つからず、肥育場へ向かう馬たちがいます。Retouchでは、そのような馬たちに新しい役割や活躍の場をつくり、第二の人生を支える活動を行っています。" },
  { question: "肥育場とは何ですか？", answer: "肥育場とは、食肉用として出荷される前の馬が集められる施設です。Retouchでは、その中から新たな未来をつくれる可能性のある馬たちを受け入れています。" },
  { question: "保護された馬たちはその後どうなりますか？", answer: "乗馬、教育活動、観光、セラピー、ふれあい活動など、それぞれの個性に合った新しい役割を見つけ、人と関わりながら暮らしています。" },
  { question: "会員になるにはどうすればよいですか？", answer: "会員登録ページよりお申し込みいただけます。スマートフォンやパソコンから簡単にお手続きいただけます。" },
  { question: "支援する馬は選べますか？", answer: "はい。一口・半口支援では応援したい馬を選んでご支援いただけます。" },
  { question: "複数の馬を支援できますか？", answer: "はい。複数頭への支援や追加支援も可能です。" },
  { question: "支援金はどのように使われますか？", answer: "馬たちの飼育費、医療費、輸送費、施設維持費、教育活動費などに活用しています。" },
  { question: "支援した馬に会うことはできますか？", answer: "はい。見学会や交流イベントを定期的に開催しております。詳細は会員ページやお知らせをご確認ください。" },
  { question: "馬たちの近況は知ることができますか？", answer: "会員ページや活動報告、動画配信などを通じて定期的にお知らせしています。" },
  { question: "見学会やイベントには参加できますか？", answer: "はい。会員向けイベントや一般参加可能なイベントを開催しております。アプリや会員ページからお申し込みいただけます。" },
  { question: "支援内容の変更や追加はできますか？", answer: "はい。マイページから支援内容の確認・変更・追加支援のお手続きが可能です。" },
  { question: "支援を停止・退会したい場合はどうすればよいですか？", answer: "マイページまたはお問い合わせフォームよりお手続きいただけます。" },
  { question: "企業や団体として支援することはできますか？", answer: "はい。企業・団体様からのご支援や協賛も受け付けております。お気軽にお問い合わせください。" },
  { question: "ボランティアとして参加できますか？", answer: "イベント運営や環境整備など、活動内容に応じて募集を行っています。募集情報はお知らせページをご確認ください。" },
  { question: "Retouchの目指す未来は何ですか？", answer: "馬を「救う」だけでなく、一頭一頭に新たな役割をつくり、人と馬が支え合う社会を実現することです。皆様のご支援が、その未来を支える大きな力になっています。" },
];

export async function getFaq(): Promise<{ question: string; answer: string }[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faq_items")
      .select("question, answer, sort_order")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return FAQ_FALLBACK;
    return data.map((r: { question: string; answer: string }) => ({ question: r.question, answer: r.answer }));
  } catch {
    return FAQ_FALLBACK;
  }
}

export async function getAdminFaq(): Promise<DbFaqItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("id, question, answer, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: FaqRow) => mapFaq(row));
}

export { supportRate };
