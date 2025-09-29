import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",   // путь к твоему schema (ты используешь @shared/schema?)
  out: "./drizzle",            // папка куда будут сохраняться миграции
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
