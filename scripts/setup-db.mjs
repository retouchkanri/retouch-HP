import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "supabase", "schema.sql");

const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error(
    "Set SUPABASE_DB_URL in .env.local (Supabase Dashboard → Settings → Database → Connection string)"
  );
  process.exit(1);
}

const sql = readFileSync(schemaPath, "utf8");
const db = postgres(dbUrl, { ssl: "require" });

try {
  await db.unsafe(sql);
  console.log("Schema applied successfully.");
} catch (error) {
  console.error("Failed to apply schema:", error);
  process.exit(1);
} finally {
  await db.end();
}
