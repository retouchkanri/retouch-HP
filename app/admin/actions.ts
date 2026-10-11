"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import {
  MAX_HORSE_PHOTOS,
  horseStatusLabel,
  isYouTubeUrl,
  normalizeHorseStatus,
  normalizeRescuedAt,
  slugFromName,
} from "@/lib/horses";
import {
  HORSE_CSV_COLUMNS,
  HORSE_CSV_MAX_ROWS,
  HORSE_SLUG_PATTERN,
  matchHorseCsvRow,
  toHorsePatch,
  type HorseCsvPatch,
  type HorseCsvRow,
  type HorseCsvValues,
} from "@/lib/horse-csv";
import { seedDatabaseContent } from "@/lib/seed-database";
import { UPLOAD_BUCKETS, UPLOAD_IMAGE_TYPES } from "@/lib/uploads";

const PLACEHOLDER_MEDIA_IMG = "/media/media-postseven.jpg";
const PLACEHOLDER_FAQ_ANSWER = "（回答を準備中です）";

function todayDateLabel() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export async function signIn(
  _prev: { error?: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!isAdminEmail(email)) {
    return { error: "管理者権限がありません。" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const NOT_ADMIN_ERROR = "ログインの有効期限が切れました。再度ログインしてください。";
const MIGRATION_ERROR =
  "データベースの更新が必要です。Supabase の SQL Editor で supabase/migrations/20261011_horse_profile_fields.sql を実行してから、もう一度保存してください。";

/**
 * 管理者としてログイン中ならセッション付きクライアントを返す。
 * Server Action は公開エンドポイントなので、service role を使う処理は必ずこれを通す。
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user && isAdminEmail(user.email) ? supabase : null;
}

/** horses への書き込みエラーを管理画面向けの文言に。 */
function horseDbError(error: { code?: string; message: string }): string {
  if (error.code === "PGRST204" || error.code === "42703") return MIGRATION_ERROR;
  if (error.code === "23505") return "このスラッグは既に使われています。別のスラッグを指定してください。";
  return error.message;
}

/**
 * 画像アップロード用の署名付きURLを発行する。
 * ファイル本体はブラウザから Supabase Storage へ直接送るため、Vercel の
 * リクエストサイズ上限（4.5MB）や Storage の RLS 設定に左右されない。
 */
export async function createImageUpload(input: { bucket: string; contentType: string }) {
  try {
    if (!(await requireAdmin())) return { error: NOT_ADMIN_ERROR };

    const bucket = UPLOAD_BUCKETS.find((b) => b === input?.bucket);
    const ext = UPLOAD_IMAGE_TYPES[String(input?.contentType)];
    if (!bucket) return { error: "アップロード先が正しくありません。" };
    if (!ext) return { error: "JPEG・PNG・WebP・GIF の画像を選択してください。" };

    const svc = createServiceClient();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    let signed = await svc.storage.from(bucket).createSignedUploadUrl(path);
    if (signed.error) {
      // バケットが未作成の環境では、公開バケットとして作成してからやり直す。
      const { error: bucketErr } = await svc.storage.createBucket(bucket, { public: true });
      if (bucketErr && !bucketErr.message.includes("already exists")) {
        return { error: `画像の保存先を準備できませんでした（${bucketErr.message}）` };
      }
      signed = await svc.storage.from(bucket).createSignedUploadUrl(path);
    }
    if (signed.error) return { error: `アップロードを開始できませんでした（${signed.error.message}）` };

    const { data } = svc.storage.from(bucket).getPublicUrl(path);
    return { signedUrl: signed.data.signedUrl, publicUrl: data.publicUrl };
  } catch (e) {
    return { error: `アップロードを開始できませんでした（${e instanceof Error ? e.message : "不明なエラー"}）` };
  }
}

export async function saveNews(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const date = String(formData.get("date") ?? "").trim() || todayDateLabel();
  const category = String(formData.get("category") ?? "").trim() || "お知らせ";
  const title = String(formData.get("title") ?? "").trim();
  const img = String(formData.get("img") ?? "") || null;
  const body = String(formData.get("body") ?? "") || null;
  const linkUrl = String(formData.get("linkUrl") ?? "") || null;

  if (!title) return { error: "タイトルは必須です。" };

  const supabase = await createClient();
  const payload = { date, category, title, img, body, link_url: linkUrl };

  const { error } = id
    ? await supabase.from("news_items").update(payload).eq("id", id)
    : await supabase.from("news_items").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/media");
  return { success: true };
}

export async function deleteNews(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("news_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/media");
  return { success: true };
}

export async function saveMedia(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const outlet = String(formData.get("outlet") ?? "").trim() || "（媒体名未設定）";
  const date = String(formData.get("date") ?? "").trim() || todayDateLabel();
  const title = String(formData.get("title") ?? "").trim();
  const img = String(formData.get("img") ?? "").trim() || PLACEHOLDER_MEDIA_IMG;
  const url = String(formData.get("url") ?? "") || null;
  const imgAlt = String(formData.get("imgAlt") ?? "") || null;
  const mediaType = String(formData.get("mediaType") ?? "") || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!title) return { error: "タイトルは必須です。" };

  const supabase = await createClient();
  const payload = {
    outlet,
    date,
    title,
    img,
    url,
    img_alt: imgAlt,
    media_type: mediaType,
    sort_order: sortOrder,
  };

  const { error } = id
    ? await supabase.from("media_items").update(payload).eq("id", id)
    : await supabase.from("media_items").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/media");
  return { success: true };
}

export async function deleteMedia(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("media_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/media");
  return { success: true };
}

// ============================================================================
// Horse CRUD
// ============================================================================

const isImageRef = (v: string) => /^https?:\/\//i.test(v) || v.startsWith("/");

/** フォームから届いた写真URL一覧（JSON配列）を検証する。 */
function parsePhotos(raw: FormDataEntryValue | null): { photos?: string[]; error?: string } {
  let list: unknown;
  try {
    list = JSON.parse(String(raw ?? "[]") || "[]");
  } catch {
    return { error: "写真の一覧を読み取れませんでした。" };
  }
  if (!Array.isArray(list)) return { error: "写真の一覧を読み取れませんでした。" };

  const photos = [...new Set(list.map((v) => String(v ?? "").trim()).filter(Boolean))];
  if (photos.length > MAX_HORSE_PHOTOS) return { error: `写真は1頭につき${MAX_HORSE_PHOTOS}枚までです。` };
  if (!photos.every(isImageRef)) return { error: "写真のURLは https:// で始まるものを指定してください。" };
  return { photos };
}

export async function saveHorse(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  let name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();

  const supabase = await createClient();

  if (id && !name) {
    const { data: existing } = await supabase
      .from("horses")
      .select("name, slug")
      .eq("id", id)
      .single();
    if (existing) {
      name = existing.name;
      slug = slug || existing.slug;
    }
  }

  if (!id && !name) {
    const { count } = await supabase
      .from("horses")
      .select("*", { count: "exact", head: true });
    const n = (count ?? 0) + 1;
    name = `第${n}頭（登録待ち）`;
    slug = slug || `horse-${String(n).padStart(2, "0")}`;
  }

  slug = slug || slugFromName(name);
  const sex = String(formData.get("sex") ?? "") || null;
  const age = String(formData.get("age") ?? "") || null;
  const status = normalizeHorseStatus(String(formData.get("status") ?? ""));
  const personality = String(formData.get("personality") ?? "");
  const story = String(formData.get("story") ?? "");
  const beforeStory = String(formData.get("beforeStory") ?? "") || null;
  const officeMessage = String(formData.get("officeMessage") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const goal = Number(formData.get("goal") ?? 0) || 0;
  const raised = Number(formData.get("raised") ?? 0) || 0;
  const supporters = Number(formData.get("supporters") ?? 0) || 0;
  const note = String(formData.get("note") ?? "") || null;

  // 肥育場番号は 0 番（最初の1頭）があるため、空欄と 0 を区別する。
  const orderRaw = String(formData.get("orderNum") ?? "").trim();
  if (orderRaw && !/^\d+$/.test(orderRaw)) return { error: "肥育場番号は数字で入力してください。" };
  const orderNum = orderRaw ? Number(orderRaw) : null;

  const { photos, error: photosError } = parsePhotos(formData.get("photos"));
  if (!photos) return { error: photosError };

  const rescuedAt = normalizeRescuedAt(String(formData.get("rescuedAt") ?? ""));
  if (rescuedAt === null) return { error: "肥育場からの保護年月を正しく選択してください。" };

  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim() || null;
  if (youtubeUrl && !isYouTubeUrl(youtubeUrl)) {
    return { error: "YouTubeプレイリストURLは https://www.youtube.com/ で始まるURLを入力してください。" };
  }

  const payload = {
    name, slug, sex, age, status, status_label: horseStatusLabel(status),
    order_num: orderNum, personality, story, before_story: beforeStory,
    photo: photos[0] ?? null, photos, youtube_url: youtubeUrl, rescued_at: rescuedAt || null,
    owner_story: officeMessage, sort_order: sortOrder,
    goal, raised, supporters, note,
  };

  const { error } = id
    ? await supabase.from("horses").update(payload).eq("id", id)
    : await supabase.from("horses").insert(payload);

  if (error) return { error: horseDbError(error) };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/horses");
  revalidatePath("/support/status");
  return { success: true };
}

// ── CSV 取り込み（画像以外のテキスト項目）──────────────────────────────────

const CSV_FIELDS = new Set<string>(HORSE_CSV_COLUMNS.map((c) => c.field));
const CSV_CELL_MAX = 5000;

/** クライアントから届いた行データを、既知の列・文字列だけに絞る。 */
function sanitizeCsvValues(values: unknown): HorseCsvValues {
  const out: HorseCsvValues = {};
  if (!values || typeof values !== "object") return out;
  for (const [key, value] of Object.entries(values)) {
    if (CSV_FIELDS.has(key) && typeof value === "string") {
      out[key as keyof HorseCsvValues] = value.slice(0, CSV_CELL_MAX);
    }
  }
  return out;
}

/** CSV の項目 → horses テーブルのカラム（スラッグは照合キーなので更新しない）。 */
function csvPatchToColumns(patch: HorseCsvPatch) {
  const columns: Record<string, string | number | null> = {};
  if (patch.name !== undefined) columns.name = patch.name;
  if (patch.sex !== undefined) columns.sex = patch.sex;
  if (patch.age !== undefined) columns.age = patch.age;
  if (patch.status !== undefined) {
    columns.status = patch.status;
    columns.status_label = horseStatusLabel(patch.status);
  }
  if (patch.orderNum !== undefined) columns.order_num = patch.orderNum;
  if (patch.rescuedAt !== undefined) columns.rescued_at = patch.rescuedAt;
  if (patch.personality !== undefined) columns.personality = patch.personality;
  if (patch.story !== undefined) columns.story = patch.story;
  if (patch.beforeStory !== undefined) columns.before_story = patch.beforeStory;
  if (patch.note !== undefined) columns.note = patch.note;
  if (patch.officeMessage !== undefined) columns.owner_story = patch.officeMessage;
  if (patch.youtubeUrl !== undefined) columns.youtube_url = patch.youtubeUrl;
  if (patch.sortOrder !== undefined) columns.sort_order = patch.sortOrder;
  return columns;
}

type CsvStep =
  | { line: number; kind: "update"; id: string; columns: Record<string, string | number | null> }
  | { line: number; kind: "insert"; columns: Record<string, string | number | null> };

/**
 * CSV の内容で馬情報を一括更新・新規登録する。
 * 全行を先に検証し、1行でも問題があれば何も書き込まずにエラー一覧を返す。
 */
export async function importHorsesCsv(rows: HorseCsvRow[]) {
  const supabase = await requireAdmin();
  if (!supabase) return { error: NOT_ADMIN_ERROR };
  if (!Array.isArray(rows) || rows.length === 0) return { error: "取り込むデータがありません。" };
  if (rows.length > HORSE_CSV_MAX_ROWS) return { error: `一度に取り込めるのは${HORSE_CSV_MAX_ROWS}行までです。` };

  const { data: existing, error: loadError } = await supabase
    .from("horses")
    .select("id, slug, name, sort_order");
  if (loadError) return { error: loadError.message };

  const horses = (existing ?? []) as { id: string; slug: string; name: string; sort_order: number }[];
  const usedSlugs = new Set(horses.map((h) => h.slug));
  const touched = new Set<string>();
  let nextSortOrder = horses.reduce((max, h) => Math.max(max, h.sort_order), -1) + 1;

  const steps: CsvStep[] = [];
  const rowErrors: string[] = [];

  for (const row of rows) {
    const line = Number(row?.line) || 0;
    const fail = (message: string) => rowErrors.push(`${line}行目：${message}`);

    const { patch, errors } = toHorsePatch(sanitizeCsvValues(row?.values));
    errors.forEach(fail);

    const { match, error: matchError } = matchHorseCsvRow(patch, horses);
    if (matchError) {
      fail(matchError);
      continue;
    }

    if (match) {
      if (touched.has(match.id)) {
        fail(`「${match.name}」が複数の行に入力されています。`);
        continue;
      }
      touched.add(match.id);
      const columns = csvPatchToColumns(patch);
      if (Object.keys(columns).length) steps.push({ line, kind: "update", id: match.id, columns });
      continue;
    }

    // 新規登録
    if (!patch.name) {
      fail(`スラッグ「${patch.slug}」の馬が見つかりません。新規登録する場合は馬名を入力してください。`);
      continue;
    }
    if (patch.slug && !HORSE_SLUG_PATTERN.test(patch.slug)) {
      fail("新規登録のスラッグは半角の英小文字・数字・ハイフンで入力してください（空欄なら自動で付きます）。");
      continue;
    }
    const slug =
      patch.slug ??
      (patch.orderNum != null ? `horse-${String(patch.orderNum).padStart(2, "0")}` : slugFromName(patch.name));
    if (usedSlugs.has(slug)) {
      fail(`スラッグ「${slug}」は既に使われています。スラッグ列に別の値を入力してください。`);
      continue;
    }
    usedSlugs.add(slug);

    const status = patch.status ?? "protected";
    steps.push({
      line,
      kind: "insert",
      columns: {
        personality: "",
        story: "",
        ...csvPatchToColumns(patch),
        slug,
        status,
        status_label: horseStatusLabel(status),
        sort_order: patch.sortOrder ?? nextSortOrder++,
      },
    });
  }

  if (rowErrors.length) return { rowErrors };

  let updated = 0;
  let created = 0;
  const CHUNK = 10;
  for (let i = 0; i < steps.length; i += CHUNK) {
    const results = await Promise.all(
      steps.slice(i, i + CHUNK).map(async (step) => {
        const { error } =
          step.kind === "update"
            ? await supabase.from("horses").update(step.columns).eq("id", step.id)
            : await supabase.from("horses").insert(step.columns);
        return { step, error };
      })
    );
    const failed = results.find((r) => r.error);
    updated += results.filter((r) => !r.error && r.step.kind === "update").length;
    created += results.filter((r) => !r.error && r.step.kind === "insert").length;
    if (failed?.error) {
      revalidatePath("/admin");
      return {
        error: `${failed.step.line}行目で保存に失敗したため中断しました（${horseDbError(failed.error)}）。ここまでに 更新${updated}頭・新規${created}頭 を保存済みです。`,
      };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/horses");
  revalidatePath("/support/status");
  return { success: true, updated, created };
}

export async function deleteHorse(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("horses").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/horses");
  revalidatePath("/support/status");
  return { success: true };
}

// ============================================================================
// FAQ CRUD
// ============================================================================

export async function saveFaq(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim() || PLACEHOLDER_FAQ_ANSWER;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!question) return { error: "質問は必須です。" };

  const supabase = await createClient();
  const payload = { question, answer, sort_order: sortOrder };

  const { error } = id
    ? await supabase.from("faq_items").update(payload).eq("id", id)
    : await supabase.from("faq_items").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/contact");
  return { success: true };
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/contact");
  return { success: true };
}

// ============================================================================
// Database seeding
// ============================================================================

export async function seedDatabase() {
  if (!(await requireAdmin())) return { error: NOT_ADMIN_ERROR };
  const result = await seedDatabaseContent();
  if (result.error) return { error: result.error };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/horses");
  revalidatePath("/media");
  revalidatePath("/contact");
  revalidatePath("/support/status");
  return { success: true };
}
