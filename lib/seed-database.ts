import type { SupabaseClient } from "@supabase/supabase-js";
import { NEWS, MEDIA } from "@/lib/data";
import { ALL_HORSES } from "@/lib/horses";
import { FAQ_FALLBACK } from "@/lib/content";
import { createServiceClient } from "@/lib/supabase/server";

export async function seedDatabaseContent(
  supabase?: SupabaseClient
): Promise<{ success?: true; error?: string }> {
  const client = supabase ?? createServiceClient();

  const { count: newsCount, error: newsCountError } = await client
    .from("news_items")
    .select("*", { count: "exact", head: true });

  if (newsCountError) return { error: newsCountError.message };

  if (!newsCount) {
    const { error } = await client.from("news_items").insert(
      NEWS.map((item) => ({
        date: item.date,
        category: item.category,
        title: item.title,
        img: item.img ?? null,
        body: item.body ?? null,
        link_url: item.linkUrl ?? null,
      }))
    );
    if (error) return { error: error.message };
  }

  const { count: mediaCount } = await client
    .from("media_items")
    .select("*", { count: "exact", head: true });

  if (!mediaCount) {
    const { error } = await client.from("media_items").insert(
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

  const { count: horseCount } = await client
    .from("horses")
    .select("*", { count: "exact", head: true });

  if (!horseCount) {
    const { error } = await client.from("horses").insert(
      ALL_HORSES.map((h, index) => ({
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

  const { count: faqCount } = await client
    .from("faq_items")
    .select("*", { count: "exact", head: true });

  if (!faqCount) {
    const { error } = await client.from("faq_items").insert(
      FAQ_FALLBACK.map((f, i) => ({ question: f.question, answer: f.answer, sort_order: i }))
    );
    if (error) return { error: error.message };
  }

  return { success: true };
}
