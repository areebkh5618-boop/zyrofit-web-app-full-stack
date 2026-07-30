# Deploy ZyroFit to Netlify

## 1. Push code to GitHub

```bash
git init
git add .
git commit -m "ZyroFit ready for deploy"
# create a repo on github, then:
git remote add origin https://github.com/YOUR_USERNAME/zyrofit.git
git push -u origin main
```

## 2. Netlify setup

1. Go to https://app.netlify.com
2. **Add new site** → **Import an existing project** → connect GitHub repo
3. Build settings (auto from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Plugin: `@netlify/plugin-nextjs` (installs automatically)

## 3. Environment variables (Site settings → Environment variables)

Add these (same as your `.env.local`):

| Key | Value |
|-----|--------|
| `MONGODB_URI` | `mongodb+srv://zyrofit:...@cluster0....mongodb.net/zyrofit?retryWrites=true&w=majority` |
| `JWT_SECRET` | any long random string |
| `NEXT_PUBLIC_BASE_URL` | `https://YOUR-SITE-NAME.netlify.app` |
| `STRIPE_SECRET_KEY` | optional (only if using card payments) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | optional |
| `STRIPE_WEBHOOK_SECRET` | optional |

## 4. Deploy

Click **Deploy site**. Wait for build to finish.

## 5. Seed database (once)

From your **local** machine (with same `MONGODB_URI`):

```bash
npm run seed
```

This creates products + admin account in Atlas. Netlify and local share the same DB.

## 6. Login on live site

- Admin: `admin@zyrofit.com` / `admin123`
- Admin panel: `https://YOUR-SITE.netlify.app/admin`

## Notes

- **Images**: uploaded photos are stored in MongoDB as data-URLs (works on Netlify serverless). Keep images under **2MB**.
- **COD**: works without Stripe.
- **Card payments**: need Stripe keys + webhook pointing to `https://YOUR-SITE.netlify.app/api/webhooks/stripe`
- Atlas **Network Access** must allow `0.0.0.0/0` so Netlify can connect.
