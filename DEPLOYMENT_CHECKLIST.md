# Deployment Checklist

## Pre-deploy

- [ ] Create managed PostgreSQL database
- [ ] Set `DATABASE_URL` in Vercel
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Set `ADMIN_EMAIL`
- [ ] Set `ADMIN_PASSWORD`
- [ ] Run `npx prisma migrate dev --name init-postgres`
- [ ] Commit `prisma/migrations`

## Deploy

- [ ] Vercel build command is `prisma generate && prisma migrate deploy && next build`
- [ ] Deploy from main branch
- [ ] Run one-time seed `npm run db:seed` from trusted environment

## Verify

- [ ] Home page loads
- [ ] Products page loads
- [ ] Product detail pages load
- [ ] Admin login works at `/admin`
- [ ] Admin products CRUD works
- [ ] Admin orders page loads
- [ ] Session timeout logs out admin after 5 minutes

## Security

- [ ] Remove any default admin credentials
- [ ] Keep `/admin` link hidden from public navigation
- [ ] Rotate secrets if shared accidentally
- [ ] Enable DB backups in provider dashboard
