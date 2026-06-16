import { createClient } from "@supabase/supabase-js";
import { seedDatabaseContent } from "../lib/seed-database";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const result = await seedDatabaseContent(supabase);
  if (result.error) {
    console.error("Seed failed:", result.error);
    process.exit(1);
  }

  console.log("Content seed complete (empty tables only).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
