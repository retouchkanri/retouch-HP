"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { NEWS, MEDIA } from "@/lib/data";
import { ALL_HORSES, slugFromName } from "@/lib/horses";
import { FAQ_FALLBACK } from "@/lib/content";

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

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "ファイルが選択されていません。" };

  const supabase = await createClient();
  const svc = createServiceClient();

  // Ensure bucket exists
  const { error: bucketErr } = await svc.storage.createBucket("news-images", { public: true });
  // Ignore "already exists" error (code 409 / message contains "already exists")
  if (bucketErr && !bucketErr.message.includes("already exists")) {
    return { error: bucketErr.message };
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const timestamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${timestamp}-${rand}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("news-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadErr) return { error: uploadErr.message };

  const { data } = supabase.storage.from("news-images").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function saveNews(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const date = String(formData.get("date") ?? "");
  const category = String(formData.get("category") ?? "");
  const title = String(formData.get("title") ?? "");
  const img = String(formData.get("img") ?? "") || null;
  const body = String(formData.get("body") ?? "") || null;
  const linkUrl = String(formData.get("linkUrl") ?? "") || null;

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
  const outlet = String(formData.get("outlet") ?? "");
  const date = String(formData.get("date") ?? "");
  const title = String(formData.get("title") ?? "");
  const img = String(formData.get("img") ?? "");
  const url = String(formData.get("url") ?? "") || null;
  const imgAlt = String(formData.get("imgAlt") ?? "") || null;
  const mediaType = String(formData.get("mediaType") ?? "") || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

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

export async function saveHorse(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const slug = String(formData.get("slug") ?? "") || slugFromName(name);
  const sex = String(formData.get("sex") ?? "") || null;
  const age = String(formData.get("age") ?? "") || null;
  const ageYears = Number(formData.get("ageYears") ?? 0) || null;
  const status = String(formData.get("status") ?? "protected");
  const statusLabel = String(formData.get("statusLabel") ?? "現在の保護馬");
  const orderNum = Number(formData.get("orderNum") ?? 0) || null;
  const personality = String(formData.get("personality") ?? "");
  const story = String(formData.get("story") ?? "");
  const beforeStory = String(formData.get("beforeStory") ?? "") || null;
  const photo = String(formData.get("photo") ?? "") || null;
  const ownerStory = String(formData.get("ownerStory") ?? "") || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const goal = Number(formData.get("goal") ?? 0);
  const raised = Number(formData.get("raised") ?? 0);
  const supporters = Number(formData.get("supporters") ?? 0);
  const note = String(formData.get("note") ?? "") || null;

  const supabase = await createClient();
  const payload = {
    name, slug, sex, age, age_years: ageYears, status, status_label: statusLabel,
    order_num: orderNum, personality, story, before_story: beforeStory,
    photo, owner_story: ownerStory, sort_order: sortOrder,
    goal, raised, supporters, note,
  };

  const { error } = id
    ? await supabase.from("horses").update(payload).eq("id", id)
    : await supabase.from("horses").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/horses");
  revalidatePath("/support/status");
  return { success: true };
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
  const question = String(formData.get("question") ?? "");
  const answer = String(formData.get("answer") ?? "");
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

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
  const supabase = createServiceClient();

  const { count: newsCount } = await supabase
    .from("news_items")
    .select("*", { count: "exact", head: true });

  if (!newsCount) {
    const { error } = await supabase.from("news_items").insert(
      NEWS.map((item) => ({
        date: item.date,
        category: item.category,
        title: item.title,
      }))
    );
    if (error) return { error: error.message };
  }

  const { count: mediaCount } = await supabase
    .from("media_items")
    .select("*", { count: "exact", head: true });

  if (!mediaCount) {
    const { error } = await supabase.from("media_items").insert(
      MEDIA.map((item, index) => ({
        outlet: item.outlet,
        date: item.date,
        title: item.title,
        img: item.img,
        url: item.url ?? null,
        img_alt: item.imgAlt ?? null,
        media_type: item.mediaType ?? null,
        sort_order: index,
      }))
    );
    if (error) return { error: error.message };
  }

  const { count: horseCount } = await supabase
    .from("horses")
    .select("*", { count: "exact", head: true });

  if (!horseCount) {
    const knownHorses = ALL_HORSES.filter((h) => !h.pendingDetails);
    const { error } = await supabase.from("horses").insert(
      knownHorses.map((h, index) => ({
        name: h.name,
        slug: h.slug,
        sex: h.sex ?? null,
        age: h.age ?? null,
        status: h.status,
        status_label: h.statusLabel,
        order_num: h.order ?? null,
        personality: h.personality ?? "",
        story: h.story ?? "",
        before_story: h.before ?? null,
        photo: h.photo ?? null,
        sort_order: index,
        goal: h.goal,
        raised: h.raised,
        supporters: h.supporters,
        note: h.note ?? null,
      }))
    );
    if (error) return { error: error.message };
  }

  const { count: faqCount } = await supabase
    .from("faq_items")
    .select("*", { count: "exact", head: true });

  if (!faqCount) {
    const { error } = await supabase.from("faq_items").insert(
      FAQ_FALLBACK.map((f, i) => ({ question: f.question, answer: f.answer, sort_order: i }))
    );
    if (error) return { error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/horses");
  revalidatePath("/media");
  revalidatePath("/contact");
  revalidatePath("/support/status");
  return { success: true };
}
