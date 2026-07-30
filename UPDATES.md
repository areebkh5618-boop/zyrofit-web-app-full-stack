# Live updates & reliable hosting

## Important: 2 kinds of updates

### A) Product / price / order updates (NO redeploy, NO downtime)

Ye **MongoDB** se live aate hain. Admin panel se:

- naya product add
- price change
- product delete
- order status change

→ website **turant** update hoti hai. Docker / Netlify restart ki zaroorat nahi.

Bas `/admin` use karo — ye already “auto update” hai.

### B) Code / design updates (new features, UI change)

Is ke liye naya deploy chahiye. Options neeche.

---

## Option 1 — Netlify (easiest auto-deploy)

1. Code GitHub pe rakho  
2. Netlify ko GitHub se connect karo  
3. Jab bhi `git push` karo → Netlify **khud build + deploy** karta hai  

Downtime: usually **0–30 seconds** (Netlify atomic deploy — purani version chalti rehti hai jab tak nayi ready na ho).

Products/prices ab bhi admin se live change hote hain, bina push ke.

```bash
git add .
git commit -m "update"
git push
# Netlify automatically redeploys
```

---

## Option 2 — Docker (VPS / Railway / Render / DigitalOcean)

### Local test

```bash
# .env file (not .env.local) with:
# MONGODB_URI=...
# JWT_SECRET=...
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com

docker compose up -d --build
# Site: http://localhost:3000
```

### Update after code change

```bash
git pull
docker compose up -d --build
```

Container restart ~few seconds. MongoDB Atlas data safe rehti hai.

### Better zero-downtime on a VPS (optional)

Use two containers + reverse proxy (Caddy/Nginx) and switch traffic after healthcheck — advanced; for most shops Netlify atomic deploys are enough.

---

## Recommended setup for you

| Need | Use |
|------|-----|
| Price / product change | **Admin panel only** (already live) |
| Reliable hosting, easy | **Netlify + MongoDB Atlas** |
| Full control / own server | **Docker on VPS** + Atlas |
| Auto code update | **Git push → Netlify** or `docker compose up -d --build` |

**Don’t** put MongoDB inside Docker for production unless you know backups — Atlas already does that for you.

---

## Checklist for “always works”

1. MongoDB Atlas cluster **not paused**  
2. Network Access: `0.0.0.0/0`  
3. Env vars set on host (Netlify or Docker `.env`)  
4. `NEXT_PUBLIC_BASE_URL` = live site URL  
5. Admin se content manage karo — redeploy only for code  
