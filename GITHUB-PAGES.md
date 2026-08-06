# GitHub Pages setup (free account)

## Your store URL

### **https://yunusbashashaik.github.io/Global-Stores/**

---

## How deploy works

Pushing to `main` runs **Deploy to GitHub Pages**, which builds the client and publishes a clean orphan commit to the `gh-pages` branch (root only). GitHub then serves that branch.

Do **not** keep a “Deploy static content to Pages” workflow that uploads the whole repo — it fights the real deploy and can leave Pages stuck in `building`.

## If Actions shows “pages build and deployment” stuck / in progress

That workflow is GitHub’s **legacy branch deploy**. When it hangs or the site status is `errored` / stuck `building`, do this once:

1. Open **https://github.com/Yunusbashashaik/Global-Stores/settings/pages**
2. Under **Build and deployment** → **Source**, choose **GitHub Actions**
3. Save, then open **Actions** → **Deploy Pages (GitHub Actions)** → **Run workflow**
4. Wait 1–2 minutes, then hard-refresh the store URL above

### Fallback (keep branch deploy)

1. Same Pages settings page
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` · **Folder:** `/ (root)`
4. Click **Save** again (even if already selected) — this clears an `errored` / stuck `building` state
5. Cancel any hung **Deploy static content to Pages** / **Deploy Pages (GitHub Actions)** runs in the Actions tab
6. Wait for the new `pages-build-deployment` run to finish (often 2–8 minutes), or re-run **Deploy to GitHub Pages**

---

## Wrong URLs

| URL | Result |
|-----|--------|
| `yunusbashashaik.github.io` | Not your store |
| `yunusbashashaik.github.io/Global-Stores/` | **Correct homepage** |
