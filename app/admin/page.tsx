import AdminDashboard from "@/components/admin/AdminDashboard";
import {
  getAdminMedia,
  getAdminNews,
  getAdminHorses,
  getAdminFaq,
  isDatabaseReady,
} from "@/lib/content";

export default async function AdminPage() {
  const dbReady = await isDatabaseReady();
  let news: Awaited<ReturnType<typeof getAdminNews>> = [];
  let media: Awaited<ReturnType<typeof getAdminMedia>> = [];
  let horses: Awaited<ReturnType<typeof getAdminHorses>> = [];
  let faq: Awaited<ReturnType<typeof getAdminFaq>> = [];

  if (dbReady) {
    try {
      [news, media, horses, faq] = await Promise.all([
        getAdminNews(),
        getAdminMedia(),
        getAdminHorses(),
        getAdminFaq(),
      ]);
    } catch {
      // Tables exist but query failed — show empty state
    }
  }

  return (
    <AdminDashboard
      news={news}
      media={media}
      horses={horses}
      faq={faq}
      dbReady={dbReady}
    />
  );
}
