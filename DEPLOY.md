# Deploy: GitHub + Vercel + Supabase

## 1. Supabase (Postgres)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **Project Settings → Database** and copy the **connection string** (URI), or use **Connect** in the dashboard ([docs](https://supabase.com/docs/guides/database/connecting-to-postgres)).
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
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` (same project as the DB) |
   | `SUPABASE_STORAGE_BUCKET` | Bucket name you created (e.g. `media`) |
   | `SUPABASE_STORAGE_REGION` | From Supabase **Storage → Configuration → S3** |
   | `SUPABASE_STORAGE_ENDPOINT` | From the same page: `https://<project-ref>.storage.supabase.co/storage/v1/s3` ([auth docs](https://supabase.com/docs/guides/storage/s3/authentication)) |
   | `SUPABASE_STORAGE_ACCESS_KEY_ID` | S3 access key from that page |
   | `SUPABASE_STORAGE_SECRET_ACCESS_KEY` | S3 secret key from that page |
   | `CRON_SECRET` | Random string if you use cron-authenticated jobs |
   | `PREVIEW_SECRET` | Random string if you use draft preview |

4. Deploy. After the first deploy, open `/admin`, create the first admin user, and run migrations if your workflow requires them.

## 4. Local development

```bash
docker compose up -d
cp .env.example .env
# Edit .env: set PAYLOAD_SECRET; DATABASE_URL for local Postgres; optional Supabase Storage vars
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin](http://localhost:3000/admin).

## 5. Images (Supabase Storage)

Payload uploads must **not** rely on ephemeral server disk on Vercel. This project uses [**@payloadcms/storage-s3**](https://payloadcms.com/docs/upload/storage-adapters) pointed at **Supabase’s S3-compatible Storage API** ([S3 authentication](https://supabase.com/docs/guides/storage/s3/authentication)).

1. In Supabase: **Storage** → create a bucket (e.g. `media`). For direct public URLs used by the site, set the bucket to **public** (or tune policies to match how you generate URLs).
2. **Storage → Configuration → S3**: enable S3 protocol if needed, copy **endpoint**, **region**, and generate **access key + secret**.
3. Set **`NEXT_PUBLIC_SUPABASE_URL`** to `https://<project-ref>.supabase.co` so generated file URLs match the [public object URL](https://supabase.com/docs/guides/storage/serving/downloads) pattern.
4. Add all Storage-related env vars to Vercel and **redeploy**.

Without Storage env vars, local/production falls back to **`public/media`** on disk (fine for local dev only).

Supabase does **not** implement S3 ACL headers on upload ([compatibility](https://supabase.com/docs/guides/storage/s3/compatibility)); visibility is controlled by **bucket / RLS**, not `acl` on the client.
