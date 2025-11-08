import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // Use relative path from this config file
  schema: './src/infrastructure/db/schema.ts',
  url: process.env.DATABASE_URL,
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { connectionString: process.env.DATABASE_URL } as any
})