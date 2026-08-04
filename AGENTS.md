# AGENTS.md

## Cursor Cloud specific instructions

This repository implements **GlobalStores.com** from `Tech. Document` as an npm workspace (`client` + `server`).

### Services

| Service | Dev command | URL |
|---------|-------------|-----|
| Vite frontend | `npm run dev` (workspace root) | http://localhost:5173 |
| Express API | started with `npm run dev` | http://localhost:3001 (`/api/*`) |

Vite proxies `/api` to port **3001** during development. For production-style serving, run `npm run build` then `npm start` (API serves `client/dist` on port 3001).

### Standard commands (root)

- **Install:** `npm install`
- **Dev:** `npm run dev`
- **Lint:** `npm run lint`
- **Test:** `npm run test` (server API tests only)
- **Build:** `npm run build`

### Complaint email

Local dev works without SMTP: submissions are appended to `server/data/complaints.jsonl` and screenshots land in `server/data/uploads/`. Set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (and optional `COMPLAINT_EMAIL`) for real delivery.

### E2E notes

- WhatsApp buttons open `wa.me` in a new tab (external; no local WhatsApp service).
- Arabic mode toggles `body.rtl` and persists language in `localStorage` key `globalstores_lang`.
