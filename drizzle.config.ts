import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
