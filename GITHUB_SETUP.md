# GitHub upload + 1-click CI/CD (Netlify)

## What you get

| Feature | How |
|---------|-----|
| Auto deploy on every `git push` | GitHub Actions + Netlify **or** Netlify Git integration |
| Auto scaling | Netlify serverless — scales traffic automatically |
| Auto healing | Failed deploys roll back; edge network retries healthy instances |
| No manual redeploy | Push to `main` → site updates |

Product / price changes still go through **Admin panel** (instant, no deploy).

---

## Step 1 — Upload to GitHub

```bash
cd zyrofit
git init
git add .
git commit -m "ZyroFit production ready"
```

GitHub.com → **New repository** → name `zyrofit` → then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/zyrofit.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Connect Netlify (easiest auto-deploy)

1. https://app.netlify.com → **Add new site** → **Import from Git** → GitHub → `zyrofit`
2. Build settings are in `netlify.toml` (auto-detected)
3. **Site settings → Environment variables** add:

| Key | Value |
|-----|--------|
| `MONGODB_URI` | your Atlas URI |
| `JWT_SECRET` | long random string |
| `NEXT_PUBLIC_BASE_URL` | `https://YOUR-SITE.netlify.app` |

4. Deploy once. After that: **every git push = auto deploy**.

This alone gives you continuous delivery + scaling + healing on Netlify.

---

## Step 3 (optional) — GitHub Actions secrets

Only needed if you want CI build checks + deploy from Actions (`.github/workflows/deploy.yml`).

GitHub repo → **Settings → Secrets and variables → Actions** → add:

| Secret | Where to get it |
|--------|------------------|
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → New access token |
| `NETLIFY_SITE_ID` | Netlify site → Site configuration → Site details → Site ID |
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | same as Netlify env |
| `NEXT_PUBLIC_BASE_URL` | your live URL |

Then every push to `main` runs: **build → deploy**.

---

## Daily workflow

```bash
# change code locally
git add .
git commit -m "fix or feature"
git push
# Netlify deploys automatically — no extra click
```

Admin changes (price, products, orders): open `/admin` only — no git needed.

---

## FormSubmit note (contact emails)

First contact form submission may send a confirmation email to  
**areebkh5618@gmail.com** — open it and confirm once so messages keep arriving.
