---
published: false
---

# Global-Stores

> **Open the website (iPad / phone):** [https://yunusbashashaik.github.io/Global-Stores/](https://yunusbashashaik.github.io/Global-Stores/)  
> Do **not** use `yunusbashashaik.github.io` alone — that is not your store URL.

GlobalStore.com — bilingual digital subscription marketplace for Kuwait (KWD).

## Development

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

- **Client:** http://localhost:5173 (Vite dev server; proxies `/api` to the backend)
- **API:** http://localhost:3001 (`GET /api/health`, `GET /api/services`, `POST /api/complaints`, `POST /api/admin/login`)

```bash
npm run lint
npm run test
npm run build
npm start   # serves built client + API on port 3001
```

### Admin panel

Open **http://localhost:5173/admin** (or `/admin` in production) to sign in and update service prices and bilingual descriptions. Changes are stored in `server/data/services.json` and shown on the homepage via `GET /api/services`.

Default local credentials (override in production):

- `ADMIN_USERNAME` (default: `admin`)
- `ADMIN_PASSWORD` (default: `globalstores`)
- `ADMIN_SESSION_SECRET` (optional; signs admin session tokens)

### Complaint email

Complaints are sent by **email only** (not WhatsApp) to **`global2stor2@gmail.com`**.

- **Static hosting (GitHub Pages, GoDaddy static/HTML, etc.):** the form emails via **FormSubmit** using a classic multipart POST (AJAX drops file attachments). The first submission sends an **Activate Form** link to that inbox — click it once, then later complaints arrive by email with:
  - **Subject** = the Subject field the user typed
  - **Body** = Full Name, Phone Number, Subject, Complaint Details, plus a Screenshot Link backup
  - **Screenshot** = file **attachment** (`attachment` field)
- **Node API + SMTP (optional, e.g. GoDaddy Node / VPS):** when `/api/complaints` is available, tickets go through the server with the screenshot embedded/attached. Without SMTP, they are logged under `server/data/` in local/dev.

FormSubmit works on **any domain** (including GoDaddy) after the one-time inbox activation — it does not depend on GitHub Pages.

Optional env:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `COMPLAINT_EMAIL` / `VITE_COMPLAINT_EMAIL` (default: `global2stor2@gmail.com`)

See `Tech. Document` for full product requirements.

## Deployment (GitHub Pages) — free account OK

You **do not need a paid GitHub plan** for a **public** repository. GitHub Pages is included on free accounts. This repo is public.

Pushes to **`main`** run [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml), which builds the site and pushes to the **`gh-pages`** branch (site files at both `/` and `/docs`).

### One-time setup (iPhone, iPad, or computer)

1. Open **https://github.com/Yunusbashashaik/Global-Stores/settings/pages**
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**
3. **Branch:** `gh-pages` · **Folder:** `/ (root)` or `/docs` · **Save**
4. Wait 1–2 minutes, then open on your iPad:

   **https://yunusbashashaik.github.io/Global-Stores/**

If the workflow has not run yet, go to **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

The homepage uses built-in catalog data if the API is unavailable. **Admin**, **live price edits**, and **complaint email** need the Node server (`npm start` on a free host such as Render’s free tier).
