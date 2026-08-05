# GitHub Pages setup (free account)

## Your live site link (use this on iPad)

**https://yunusbashashaik.github.io/Global-Stores/**

Do **not** open only `yunusbashashaik.github.io` — that is your account root and has no site until you create a `yunusbashashaik.github.io` repository.

---

## If you see “404 File not found”

### 1. Make the repository public (required on free plan)

Private repos cannot publish public Pages on a free account.

1. **Settings** → **General** → **Danger zone**
2. **Change repository visibility** → **Public**

### 2. Turn on Pages (pick **one**)

**Option A — `gh-pages` branch (recommended)**

1. **Settings** → **Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` · **Folder:** `/ (root)` → **Save**

**Option B — `docs` folder on `main`**

1. **Settings** → **Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` · **Folder:** `/docs` → **Save**

Wait 1–3 minutes after saving.

### 3. Wait for the deploy workflow

After each push to `main`, **Actions** → **Deploy to GitHub Pages** should succeed and update `gh-pages`.

---

## Bookmark on iPad

Safari → open **https://yunusbashashaik.github.io/Global-Stores/** → Share → Add to Home Screen.
