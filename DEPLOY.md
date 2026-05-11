# Deploy: GitHub + Vercel + Supabase

## 1. Supabase (Postgres)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **Project Settings → Database** and copy the **connection string** (URI).
3. Prefer the **connection pooler** for serverless (Vercel) if Supabase’s docs recommend it for your driver.
4. If connections from Vercel fail, check Supabase docs for **IPv4** options for external providers.

Set this as `DATABASE_URL` in Vercel (and locally in `.env`).

## 2. GitHub

1. Create a repository and push **this folder** as the repo root (if your machine has a parent git repo, run these commands inside `eming` only):

   ```bash
   cd /path/to/eming
   git init
   git add .
   git commit -m "Initial Payload blog"
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   git push -u origin main
   ```

## 3. Vercel

1. **Import** the GitHub repo in the Vercel dashboard.
2. Framework: **Next.js** (auto-detected).
3. **Environment variables** (Production + Preview):

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | Supabase Postgres URI |
   | `PAYLOAD_SECRET` | Strong random string (`openssl rand -base64 32`) |
   | `NEXT_PUBLIC_SERVER_URL` | `https://your-project.vercel.app` or your custom domain (no trailing slash) |
   | `CRON_SECRET` | Random string if you use cron-authenticated jobs |
   | `PREVIEW_SECRET` | Random string if you use draft preview |

4. Deploy. After the first deploy, open `/admin`, create the first admin user, and run **Migrate** from the admin UI or run `npm run payload migrate` locally against the same `DATABASE_URL` if your workflow uses SQL migrations.

## 4. Local development

```bash
docker compose up -d
cp .env.example .env
# Edit .env: set PAYLOAD_SECRET, keep DATABASE_URL for local Postgres above
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin](http://localhost:3000/admin).

## 5. Optional: Supabase Storage for uploads

This template stores uploads on disk under `public/media` by default. For production, configure an S3-compatible adapter (Supabase Storage exposes an S3 API) in `src/payload.config.ts` per [Payload storage docs](https://payloadcms.com/docs/upload/storage-adapters).
