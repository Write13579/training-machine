import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/database/scheme.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.TRAINING_MACHINE_DB_PASSWORD!,
  },
});
