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
- **API:** http://localhost:3001 (`GET /api/health`, `GET /api/services`, `GET /api/settings`, `POST /api/complaints`, `POST /api/admin/login`)

```bash
npm run lint
npm run test
npm run build
npm start   # serves built client + API on port 3001
```

### Dynamic database (SQLite)

Admin edits and public catalog/settings are stored in **`server/data/globalstore.db`** (not GitHub-tracked static files). Every visitor hitting the Node API sees the same live data.

Optional env:

- `DATABASE_PATH` — custom SQLite file path
- `ADMIN_USERNAME` (default: `admin`)
- `ADMIN_PASSWORD` (default: `globalstores`)
- `ADMIN_SESSION_SECRET` — signs admin session tokens

### Admin panel

Click the **Admin** icon in the header. A modal prompts for credentials, then opens the Admin Dashboard:

- **Add Services** — JPEG image, name, EN/AR descriptions, 1-month and 1-year prices
- **Edit Services** — dropdown for Services, Complaint Email ID, Contact Details (WhatsApp), and About Us / social links

Out-of-stock services use price `0`, show an **Out of Stock** note, and disable Add to Cart.

### Complaint email

Complaints are sent by **email only** (not WhatsApp). The destination address is stored in the database (default `global2stor2@gmail.com`) and can be changed from the admin panel.

- **Static hosting (GitHub Pages):** FormSubmit classic multipart POST fallback
- **Node API + SMTP:** screenshot embedded + attached

Optional env: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `COMPLAINT_EMAIL` / `VITE_COMPLAINT_EMAIL`

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

The homepage uses built-in catalog data if the API is unavailable. **Admin**, **live price/settings edits**, and **complaint email via SMTP** need the Node server (`npm start` on a host such as Render or GoDaddy Node). Point that host at a persistent disk so `server/data/globalstore.db` survives restarts.
