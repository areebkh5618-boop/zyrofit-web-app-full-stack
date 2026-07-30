# ZyroFit — Sports Apparel E-Commerce

Next.js 16 + MongoDB + JWT auth + Stripe checkout.

## What's already built

| Feature | Status |
|--------|--------|
| Shop, product pages, cart, wishlist | ✅ |
| User register / login / logout | ✅ |
| Customer dashboard (orders + profile) | ✅ |
| **Admin panel** at `/admin` | ✅ |
| Product CRUD (admin create + delete) | ✅ |
| Roles: `customer` and `admin` | ✅ |
| Contact form, newsletter UI | ✅ |
| Stripe checkout + webhook | ✅ |
| Dark / light theme | ✅ |

## Quick start (on your machine)

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env.local
# Edit .env.local:
#   MONGODB_URI=mongodb+srv://...   (free at mongodb.com/atlas)
#   JWT_SECRET=any-long-random-string
#   STRIPE_SECRET_KEY=sk_test_...   (optional until you test payments)
#   NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 3. Seed products + admin + demo user
npm run seed

# 4. Run
npm run dev
```

Open **http://localhost:3000**

### Default accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@zyrofit.com` | `admin123` |
| Customer | `demo@zyrofit.com` | `demo123` |

## Admin panel — where to control products

1. Log in as **admin@zyrofit.com** / **admin123**
2. Go to **http://localhost:3000/admin**  
   (or click **Admin Panel →** on the dashboard)
3. There you can:
   - **Add product** (name, category, price, sizes, colors, description, **Image Seed**)
   - **Delete** products from the catalog list

Only users with `role: "admin"` can open `/admin`. Regular customers are redirected to `/dashboard`.

## Product images (sports items)

Images currently use **placeholder photos** from [picsum.photos](https://picsum.photos), controlled by the **Image Seed** field on each product.

- In **Admin → Add Product**, set **Image Seed** to any string, e.g. `zf-running-shirt-blue`
- Different seeds → different random photos
- Example URL generated: `https://picsum.photos/seed/zf-running-shirt-blue/600/750`

To use **real product photos** later:

1. Host images (Cloudinary, S3, or `/public/products/...`)
2. Change `productImageUrl()` in `lib/data.ts` to return your real URLs, or add an `imageUrl` field on the Product model and use that in `ProductCard` / `ProductDetail` / `AdminClient`.

## User vs Admin

- **User (customer)** — register at `/register`, shop, cart, checkout, dashboard, wishlist
- **Admin** — same as customer + `/admin` product management  
  Created by the seed script, or set `role: "admin"` on a user document in MongoDB

## Main routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/shop` | Catalog + filters |
| `/product/[slug]` | Product detail |
| `/cart` | Cart |
| `/checkout` | Checkout (Stripe) |
| `/wishlist` | Wishlist |
| `/login` / `/register` | Auth |
| `/dashboard` | Customer account |
| `/admin` | **Admin product control** (admin only) |
| `/about` / `/contact` | Static pages |

## Notes

- Coupon on cart page: `ZYRO10` (10% off)
- Stripe test card: `4242 4242 4242 4242`
- Free shipping over $75
