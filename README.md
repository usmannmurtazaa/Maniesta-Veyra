# Maniesta Veyra

**Wear Your Identity.**

Maniesta Veyra is a premium clothing e-commerce platform with a fully integrated **Custom Print Studio**. Customers can browse and purchase ready-made fashion, or upload their own designs, preview them on garments, and order custom-printed shirts.

Built with modern web technologies, the platform is production-ready, secure, SEO-optimized, and installable on Android devices.

---

## ✨ Features

### Ready-Made Store
- Browse products by category, collection, and search
- Advanced filtering (price, size, color, rating, availability)
- Product details with gallery, zoom, variant selection (color/size)
- Wishlist, cart, checkout (COD, Bank Transfer, optional online payment)
- Customer accounts, order history, address book
- Product reviews and ratings

### Custom Print Studio
- Dedicated landing page (`/custom-shirts`) and editor (`/customize`)
- Garment selection: T-Shirt, Oversized, Polo, Hoodie, Sweatshirt
- Per-location artwork (Front, Back, Left Sleeve, Right Sleeve)
- Upload designs (PNG, JPG, WebP, SVG – max 10 MB)
- Interactive canvas editor using **Konva.js** (drag, resize, rotate, boundary constraints)
- Live preview and server-calculated dynamic pricing
- Custom order tracking with status workflow

### Admin Dashboard
- Sales analytics and trends
- Product, category, inventory management
- Order and custom order management (design review, status updates)
- Customer, coupon, review management
- Garment and print pricing configuration
- Store settings

---

## 🧰 Tech Stack

| Layer       | Technology |
|-------------|------------|
| Frontend    | Next.js 15 (App Router), React 18, TypeScript |
| Styling     | Tailwind CSS, shadcn/ui, Radix UI |
| State       | Zustand (cart, wishlist, customizer) |
| Forms       | React Hook Form + Zod |
| Database    | PostgreSQL (Supabase), Prisma ORM |
| Auth        | Auth.js (NextAuth v5), JWT sessions, bcrypt |
| Canvas      | Konva.js + react-konva |
| Payments    | COD, Bank Transfer, Stripe (optional, abstracted) |
| Email       | Resend |
| Rate Limit  | Upstash Redis |
| Storage     | Vercel Blob (public + private buckets) |
| PWA         | Serwist (service worker) |
| Analytics   | Google Analytics 4, Sentry |
| Testing     | Vitest, React Testing Library, Playwright |
| Deployment  | Vercel, Supabase |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20.x
- npm ≥ 10.x
- PostgreSQL database (Supabase recommended)
- Vercel Blob storage (or S3-compatible)
- Resend API key (for emails)
- Upstash Redis (for rate limiting)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd maniesta-veyra

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Fill in `.env.local` with your values. See `.env.example` for the complete list.

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres:password@db.example.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:password@db.example.supabase.co:5432/postgres

# Auth
AUTH_SECRET=your-secret-key-min-32-chars
AUTH_URL=http://localhost:3000

# Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_token

# Email
RESEND_API_KEY=resend_api_key
EMAIL_FROM=orders@maniestaveyra.com

# Rate Limiting
UPSTASH_REDIS_URL=upstash_redis_url
UPSTASH_REDIS_TOKEN=upstash_redis_token

# Payments (optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLISHABLE_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Maniesta Veyra
NEXT_PUBLIC_APP_TAGLINE=Wear Your Identity.
NEXT_PUBLIC_PORTFOLIO_URL=https://your-portfolio-url.com

# Currency
NEXT_PUBLIC_CURRENCY=PKR
NEXT_PUBLIC_CURRENCY_SYMBOL=₨

# Analytics
NEXT_PUBLIC_GA_ID=
SENTRY_DSN=
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (categories, products, garments, pricing)
npm run db:seed

# (Optional) Create an admin user
npx tsx prisma/seed-admin.ts
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📦 Scripts

| Command               | Description                          |
|-----------------------|--------------------------------------|
| `npm run dev`         | Start development server             |
| `npm run build`       | Production build                     |
| `npm run start`       | Start production server              |
| `npm run lint`        | Run ESLint                           |
| `npm run test`        | Run unit tests (Vitest)              |
| `npm run test:coverage` | Run tests with coverage report     |
| `npm run test:e2e`    | Run Playwright E2E tests             |
| `npm run db:generate` | Generate Prisma client               |
| `npm run db:migrate`  | Run database migrations              |
| `npm run db:seed`     | Seed database with sample data       |
| `npm run generate-icons` | Generate PWA icons from SVG source  |
| `npm run lighthouse`  | Run Lighthouse CI checks             |

---

## 📁 Project Structure

```
maniesta-veyra/
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   ├── components/       # Reusable UI components
│   ├── lib/              # Business logic, services, validation, etc.
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   ├── types/            # TypeScript types
│   └── middleware.ts     # Route protection & auth
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   ├── seed.ts           # Seed script
│   └── seed-admin.ts     # Admin bootstrap script
├── public/               # Static assets (images, icons)
├── scripts/              # Utility scripts (icon generation)
├── tests/                # Unit, integration, E2E tests
├── .env.example          # Environment variables template
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── vitest.config.ts      # Vitest configuration
├── playwright.config.ts  # Playwright configuration
└── package.json          # Dependencies and scripts
```

---

## 🔐 Security

- **Authentication**: Auth.js v5 with JWT sessions, HTTP-only cookies, bcrypt password hashing (cost 12)
- **Authorization**: Server-side guards (`requireAuth`, `requireAdmin`, `requireSuperAdmin`) on all sensitive routes
- **Rate Limiting**: Upstash Redis sliding window on login, registration, uploads, coupons, and order creation
- **Upload Validation**: Magic-byte checks, MIME validation, size limits, SVG sanitization with `isomorphic-dompurify`
- **Inventory Safety**: Atomic `UPDATE ... WHERE stock >= quantity` inside transactions to prevent overselling
- **Idempotency**: Order creation supports `Idempotency-Key` to prevent duplicate orders
- **Security Headers**: CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy

---

## 📱 PWA & Android Installability

The app is installable on Android devices.

- Web App Manifest configured with app name, theme color, and icons
- Service worker via **Serwist** for offline caching of public assets and product images
- Private routes (`/api/*`, `/account`, `/checkout`, `/cart`, `/admin`, etc.) are **never cached**

To generate icons from your logo SVG, run:

```bash
npm run generate-icons
```

Place your SVG as `public/icons/icon-source.svg` before running.

---

## 🔍 SEO

- Dynamic metadata for all pages (title, description, Open Graph, Twitter cards)
- Structured data: Organization, Product, BreadcrumbList, WebSite
- Dynamic sitemap (`/sitemap.xml`) and robots.txt
- Clean, crawlable URLs (`/products/slug`, `/shop/category-slug`)
- Admin, account, cart, and checkout pages are excluded from indexing
- Image alt texts and semantic HTML

---

## 🧪 Testing

### Unit Tests (Vitest)
- Pricing engine
- Coupon validation
- Boundary constraints (customizer)
- Input validation schemas

### Integration Tests
- Cart service (stock validation, merging)
- Order service (transactions, idempotency)

### E2E Tests (Playwright)
- Customer journey: register → browse → cart → checkout
- Custom Studio: garment selection → upload → edit → add to cart
- Admin: dashboard, product management, order status updates

Run all tests:

```bash
npm run test
npm run test:e2e
```

---

## 🚢 Deployment

The recommended production stack:

- **Frontend/API**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Object Storage**: Vercel Blob
- **Email**: Resend
- **Rate Limiting**: Upstash Redis
- **Monitoring**: Sentry
- **Analytics**: GA4 + Vercel Analytics (optional)

### Production Checklist
- [ ] Set all environment variables in Vercel
- [ ] Run database migrations with `npx prisma migrate deploy`
- [ ] Generate PWA icons
- [ ] Configure custom domain and SSL
- [ ] Verify security headers and CSP
- [ ] Run Lighthouse and resolve performance/accessibility issues
- [ ] Set up Sentry and GA4

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Designed & Developed by Usman Murtaza**

[Portfolio](https://usmanmurtaza.netlify.app)

---

*Maniesta Veyra — Wear Your Identity.*