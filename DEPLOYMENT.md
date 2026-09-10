# Maniesta Veyra — Deployment Guide

Production deployment of the Maniesta Veyra platform.

---

## Stack Overview

| Layer | Provider |
|-------|----------|
| Frontend + API | Vercel |
| Database | Supabase (PostgreSQL 16) |
| Object Storage | Vercel Blob |
| Email | Resend |
| Rate Limiting | Upstash Redis |
| Payments | Stripe (optional) / COD / Bank Transfer |
| Monitoring | Sentry |
| Analytics | Google Analytics 4 |

---

## 1. Prerequisites

- Node.js 20.18.x (see `.nvmrc`)
- Vercel account
- Supabase project
- Upstash Redis database
- Resend account and verified domain
- (Optional) Stripe account
- (Optional) Sentry project

---

## 2. Database Setup (Supabase)

1. Create a new Supabase project (region: Singapore / closest to your market).
2. From **Project Settings → Database**, copy:
   - **Connection string (Pooler)** → this is `DATABASE_URL` (port 6543, add `?pgbouncer=true&connection_limit=1`)
   - **Connection string (Direct)** → this is `DIRECT_URL` (port 5432)
3. Add both to your environment variables.
4. Enable **Point-in-Time Recovery** in the Supabase dashboard for backups.

---

## 3. Object Storage (Vercel Blob)

1. In the Vercel dashboard, create a new Blob Store.
2. Copy the **Read/Write Token** to `BLOB_READ_WRITE_TOKEN`.
3. Product images are uploaded with `access: 'public'`.
4. Customer artwork is uploaded with `access: 'private'` and served via signed URLs.

---

## 4. Rate Limiting (Upstash Redis)

1. Create a Redis database on [upstash.com](https://upstash.com).
2. Copy the **REST URL** and **REST Token**.
3. Add to `UPSTASH_REDIS_URL` and `UPSTASH_REDIS_TOKEN`.

Without Upstash, the app runs but rate limiting is disabled (development only).

---

## 5. Email (Resend)

1. Verify your sending domain in the Resend dashboard.
2. Create an API key and set `RESEND_API_KEY`.
3. Set `EMAIL_FROM` to a verified sender (e.g., `orders@maniestaveyra.com`).

---

## 6. Payments (Stripe — optional)

If you want to enable online card payments:

1. Add `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.
2. Configure a webhook at `https://maniestaveyra.com/api/webhooks/stripe` in the Stripe dashboard.

**COD and Bank Transfer work without Stripe.**

---

## 7. Vercel Deployment

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Add all environment variables from `.env.example` to Vercel → **Settings → Environment Variables**.
4. Set **Node.js version** to `20.x`.
5. Deploy.

### Post-deploy commands (run locally with production env)

```bash
# Apply database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed admin user (run ONCE)
npx tsx prisma/seed-admin.ts