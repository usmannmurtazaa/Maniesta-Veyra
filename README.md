# Maniesta Veyra

<div align="center">

<img src="./public/icons/icon-512.png" alt="Maniesta Veyra Logo" width="120" height="120" style="border-radius: 20px;">

## **Wear Your Identity.**

**Premium Clothing E-Commerce + Custom Print Studio**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)

</div>

---

## 🌟 Overview

Maniesta Veyra is a production-ready fashion e-commerce platform that combines a **ready-made clothing store** with a **Custom Print Studio**. Customers can browse premium apparel, upload their own designs, preview them on garments in real time, and order personalised products.

---

## ✨ Key Features

### 🛍️ Ready-Made Store
- Browse by category, collection, and search
- Advanced filtering (price, size, color, rating, availability)
- Product details with gallery, zoom, and variant selection
- Wishlist, cart, checkout (COD, Bank Transfer, optional Stripe)
- Customer accounts, order history, address book
- Reviews and ratings

### 🎨 Custom Print Studio
- Dedicated landing (`/custom-shirts`) and editor (`/customize`)
- Garments: T-Shirt, Oversized, Polo, Hoodie, Sweatshirt
- Per-location artwork (Front, Back, Left Sleeve, Right Sleeve)
- Upload PNG / JPG / WebP / SVG (max 10 MB) with magic-byte validation
- Interactive Konva.js editor — drag, resize, rotate, boundary constraints
- Server-authoritative dynamic pricing with quantity discounts
- Custom order status workflow with full history

### 🛠️ Admin Dashboard
- Sales analytics and trends
- Product, category, variant, inventory management
- Order and custom order management
- Customer, coupon, and review moderation
- Garment and print pricing configuration
- Store settings

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router), React 18, TypeScript 5 |
| Styling | Tailwind CSS 3, shadcn/ui, Radix UI, Lucide |
| State | Zustand 5 |
| Forms | React Hook Form 7 + Zod 3 |
| Database | PostgreSQL 16 (Supabase), Prisma 6 |
| Auth | Auth.js v5 (NextAuth beta), JWT sessions, bcryptjs |
| Canvas | Konva.js + react-konva |
| Storage | Vercel Blob (public + private) |
| Payments | COD, Bank Transfer, Stripe (optional, abstracted) |
| Email | Resend |
| Rate Limit | Upstash Redis |
| PWA | Serwist 9 |
| Monitoring | Sentry 10 |
| Analytics | Google Analytics 4 |
| Testing | Vitest 2, Testing Library, Playwright 1 |
| Deployment | Netlify (+ `@netlify/plugin-nextjs`) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20.18.x** (see `.nvmrc`)
- npm ≥ 10
- PostgreSQL (Supabase recommended)
- Vercel Blob storage
- Resend account (verified domain)
- Upstash Redis instance
- *(Optional)* Stripe, Sentry, GA4

### Installation

```bash
git clone <your-repo-url>
cd maniesta-veyra
npm install
cp .env.example .env.local
```

### Environment Variables

Fill in `.env.local`. See `.env.example` for the full list.

```bash
# ── Database (Supabase) ──────────────────────────────────
DATABASE_URL=postgresql://postgres:pw@db.xxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres:pw@db.xxx.supabase.co:5432/postgres

# ── Auth ─────────────────────────────────────────────────
AUTH_SECRET=generate-with: openssl rand -base64 64
AUTH_URL=http://localhost:3000

# ── Storage ──────────────────────────────────────────────
BLOB_READ_WRITE_TOKEN=

# ── Email ────────────────────────────────────────────────
RESEND_API_KEY=
EMAIL_FROM=orders@maniestaveyra.com

# ── Rate Limiting ────────────────────────────────────────
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# ── Payments (optional) ──────────────────────────────────
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLISHABLE_KEY=

# ── Public config ────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Maniesta Veyra
NEXT_PUBLIC_APP_TAGLINE=Wear Your Identity.
NEXT_PUBLIC_PORTFOLIO_URL=https://usmanmurtaza.netlify.app
NEXT_PUBLIC_CURRENCY=PKR
NEXT_PUBLIC_CURRENCY_SYMBOL=₨

# ── Analytics & Monitoring (optional) ────────────────────
NEXT_PUBLIC_GA_ID=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_RELEASE=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# ── Cron (production) ────────────────────────────────────
CRON_SECRET=

# ── Admin bootstrap (one-time, then remove) ──────────────
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations (local development)
npx prisma migrate dev

# Seed sample data
npm run db:seed
```

For **production**, use:

```bash
npx prisma migrate deploy
npm run db:seed-admin    # creates SUPER_ADMIN from env vars
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking only |
| `npm run check` | Run `typecheck` + `lint` together |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:coverage` | Unit tests + coverage report |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed development data |
| `npm run db:seed-admin` | Create the SUPER_ADMIN user from env |
| `npm run db:studio` | Open Prisma Studio |
| `npm run generate-icons` | Generate PWA icons from `icon-source.svg` |
| `npm run lighthouse` | Run Lighthouse CI |

---

## 📁 Project Structure

```
maniesta-veyra/
├── src/
│   ├── app/                  # App Router pages + API routes
│   │   ├── (public)/         # Homepage, shop, products, custom-shirts
│   │   ├── account/          # Customer account area
│   │   ├── admin/            # Admin dashboard
│   │   ├── api/              # REST endpoints
│   │   ├── auth/             # Login, register, password reset
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout + confirmation
│   │   ├── customize/        # Custom Print Studio editor
│   │   ├── wishlist/
│   │   ├── manifest.ts       # PWA manifest
│   │   ├── robots.ts         # robots.txt
│   │   ├── sitemap.ts        # dynamic sitemap
│   │   └── layout.tsx
│   ├── components/           # Reusable UI + feature components
│   ├── lib/
│   │   ├── auth/             # Auth.js config, guards
│   │   ├── db/               # Prisma client
│   │   ├── services/         # Business logic (cart, order, pricing, etc.)
│   │   ├── validation/       # Zod schemas
│   │   ├── payments/         # Payment provider abstraction
│   │   ├── storage/          # Blob upload helpers
│   │   ├── security/         # Upload validation, rate limiting
│   │   ├── email/            # Resend templates
│   │   ├── analytics/        # GA4 event helpers
│   │   └── env.ts            # Env validation
│   ├── stores/               # Zustand (cart, customizer, wishlist)
│   ├── hooks/
│   ├── types/
│   ├── instrumentation.ts        # Sentry server + edge
│   ├── instrumentation-client.ts # Sentry browser
│   ├── middleware.ts             # Route protection
│   └── sw.ts                     # Serwist service worker
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   ├── seed.ts
│   └── seed-admin.ts
├── public/
│   ├── icons/                # PWA icons + logo source
│   └── images/
├── scripts/
│   └── generate-icons.mjs
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── netlify/
│   └── functions/
│       └── cron-cleanup.mts
├── netlify.toml
├── next.config.mjs
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── lighthouserc.js
├── .nvmrc
├── .env.example
└── package.json
```

---

## 🔐 Security

- **Authentication**: Auth.js v5 with JWT sessions, HTTP-only `Secure` cookies, bcrypt cost 12
- **Authorization**: Server-side guards (`requireAuth`, `requireAdmin`, `requireSuperAdmin`) invoked in every sensitive route handler and server component
- **Rate Limiting**: Upstash Redis sliding-window limiter on login, registration, password reset, uploads, coupon validation, and order creation
- **Upload Validation**: MIME, extension, magic-byte (`file-type`), size and dimension checks; SVG sanitization via `isomorphic-dompurify`
- **Inventory Safety**: Atomic `UPDATE ... WHERE stock >= quantity` inside Prisma transactions — prevents overselling under concurrency
- **Idempotency**: Order creation accepts `Idempotency-Key` header; duplicate submissions return the existing order
- **Headers**: CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy (set in `next.config.mjs` and mirrored in `netlify.toml`)
- **Secrets**: Never exposed to the client. Only `NEXT_PUBLIC_*` variables reach the browser.

---

## 📱 PWA & Android Installability

- Web App Manifest (`src/app/manifest.ts`) with name, theme color, icons
- Service worker via **Serwist** for offline caching of public assets and product images
- Private routes (`/api/*`, `/account`, `/checkout`, `/cart`, `/admin`, `/wishlist`, `/auth`, `/customize`) are **never cached**

### Icons

Two options:

1. **Use your own PNG files** — place `icon-192.png`, `icon-512.png`, and `icon-maskable-512.png` directly in `public/icons/`.
2. **Generate from an SVG** — place your source at `public/icons/icon-source.svg` and run:

```bash
npm run generate-icons
```

---

## 🔍 SEO

- Dynamic metadata per route (title, description, Open Graph, Twitter cards)
- Structured data: `Organization`, `Product`, `BreadcrumbList`, `WebSite`
- Dynamic `sitemap.xml` (products + categories) and `robots.txt`
- Clean URLs: `/products/{slug}`, `/shop/{category-slug}`
- Admin, account, cart, checkout, and the editor are excluded from indexing
- Semantic HTML and descriptive alt text on all images

---

## 🧪 Testing

### Unit (Vitest)
- Custom pricing engine
- Coupon validation
- Customizer boundary constraints
- Zod validation schemas

### Integration
- Cart service (stock validation, merging)
- Order service (transactions, idempotency)

### E2E (Playwright)
- Customer: register → browse → add to cart → checkout
- Custom Studio: garment → upload → edit → add to cart
- Admin: dashboard, product management, order status updates

**E2E prerequisites:** dev server running (`npm run dev`), database seeded (`npm run db:seed`), and `.env.local` configured.

```bash
npm run test
npm run test:e2e
```

---

## 🚢 Deployment

**Production stack:**

- **Hosting**: Netlify (with `@netlify/plugin-nextjs`)
- **Database**: Supabase (PostgreSQL 16, transaction pooler)
- **Object Storage**: Vercel Blob (public + private buckets)
- **Email**: Resend
- **Rate Limiting**: Upstash Redis
- **Monitoring**: Sentry 10
- **Analytics**: Google Analytics 4
- **Cron**: Netlify Scheduled Functions (`netlify/functions/cron-cleanup.mts`)

### Netlify Configuration

- `netlify.toml` pins Node 20.18.1, defines security headers, and registers `@netlify/plugin-nextjs`
- All environment variables must be set in **Site configuration → Environment variables** (not in `netlify.toml`)
- A daily scheduled function prunes expired password-reset tokens, deactivated coupons, and idle guest carts

### Production Checklist

- [ ] Set all environment variables in Netlify (Production + Deploy previews scopes)
- [ ] Connect custom domain and verify SSL
- [ ] Run `npx prisma migrate deploy` against production database
- [ ] Run `npm run db:seed-admin` once, then remove `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Ensure PWA icons are present at `public/icons/`
- [ ] Verify `/api/health` returns `{ "status": "ok" }`
- [ ] Trigger a test order (COD) and confirm email delivery
- [ ] Confirm Sentry receives an event from a preview deploy
- [ ] Run Lighthouse on production URL (target: Perf ≥ 90, SEO ≥ 95, A11y ≥ 95)
- [ ] Verify CSP has no console violations

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

**Proprietary.** © Maniesta Veyra. All rights reserved.

If you intend this project to be open-sourced under MIT, add a `LICENSE` file at the repo root and update this section accordingly.

---

## 👨‍💻 Developer

**Designed & Developed by Usman Murtaza**

[Portfolio](https://usmanmurtaza.netlify.app)

---

*Maniesta Veyra — Wear Your Identity.*
```

---

## Files to add alongside the README

### `LICENSE` (if you're keeping MIT)

If you actually want MIT, create `LICENSE`:

```
MIT License

Copyright (c) 2025 Maniesta Veyra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Otherwise, if you want proprietary, **delete** the MIT badge and MIT text (the corrected README above already does).

---

## Summary

| Fix | Reason |
|-----|--------|
| `./public/...` for logo | GitHub markdown resolution |
| Netlify instead of Vercel | Actual deployment target |
| Removed Vercel Analytics | Not in `package.json` anymore |
| Added Sentry env vars | Sentry 10 requires them |
| Added `CRON_SECRET`, `ADMIN_*` | Used by cron + seed-admin |
| Added `typecheck`, `check`, `db:migrate:deploy`, `db:seed-admin`, `db:studio` | Missing from scripts table |
| Node version pinned to 20.18.x | Matches `.nvmrc` and `engines` |
| `migrate dev` vs `migrate deploy` clarified | Correct command per environment |
| License clarified as Proprietary | No `LICENSE` file at root |
| PWA icon section updated | You have your own PNG |
| Cron job documented | Was missing entirely |
| E2E prerequisites documented | Playwright needs server + DB |
