# Stixs 3D Website

Next.js ecommerce site for Stixs 3D with:
- Product catalog
- Cart
- Admin login/dashboard
- Product and order admin CRUD

## Local development

1. Install dependencies:
```bash
npm install
```

2. Copy env file and edit values:
```bash
cp .env.example .env
```

3. Create/update local DB schema:
```bash
npm run db:push
```

4. Seed admin + starter products:
```bash
npm run db:seed
```

5. Start dev server:
```bash
npm run dev
```

Open http://localhost:3000

## Admin login

- URL: /admin
- Credentials are seeded from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`

## Production deployment (Vercel + Postgres)

Prisma is configured for PostgreSQL. Use a managed Postgres DB for production.

1. Create a managed Postgres database (Neon, Supabase, Railway, etc.)

2. In Vercel project settings, add environment variables:
- `DATABASE_URL` = your Postgres connection string
- `NEXTAUTH_URL` = your production domain (for example, `https://stixs3d.com`)
- `NEXTAUTH_SECRET` = long random secret
- `ADMIN_EMAIL` = initial admin email
- `ADMIN_PASSWORD` = initial admin password

3. For first migration from your local schema, create migration files locally:
```bash
npx prisma migrate dev --name init-postgres
```

4. Commit the generated `prisma/migrations` folder.

5. Set Vercel build command:
```bash
prisma generate && prisma migrate deploy && next build
```

6. Deploy.

7. After first deploy, seed admin user/products (one-time) from a trusted environment:
```bash
npm run db:seed
```

## Security checklist before launch

- Change default admin credentials
- Use a strong `NEXTAUTH_SECRET`
- Keep `/admin` URL private
- Keep short admin session timeout (currently 5 minutes)
