import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    schema: './src/db/schema.ts',
    out: './src/db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'postgresql://alm:alm@localhost:5432/alm_platform',
    },
});
//# sourceMappingURL=drizzle.config.js.map