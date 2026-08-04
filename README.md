# Global-Stores

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

### Complaint email (optional)

Without SMTP, complaints are logged under `server/data/` and the API still returns success (suitable for local dev).

Set for production-like email delivery:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `COMPLAINT_EMAIL` (default: `global2stor2@gmail.com`)

See `Tech. Document` for full product requirements.
