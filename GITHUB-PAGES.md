# GitHub Pages setup (free account)

## Your store URL (bookmark this on iPad)

### **https://yunusbashashaik.github.io/Global-Stores/**

The repository is **public** (required for free GitHub Pages).

---

## Fix: seeing README text or a 404 instead of the website

That happens when Pages uses the **`main`** branch **root** folder — GitHub can show `README.md` instead of the app — or when the folder path does not match the deploy.

### Change one setting

1. **https://github.com/Yunusbashashaik/Global-Stores/settings/pages**
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` (not `main`)
4. **Folder:** `/ (root)` **or** `/docs` (both are published)
5. **Save**, wait 2–3 minutes, then open the link above.

The `gh-pages` branch contains **only** the built website (no README), at both root and `docs/`.

### Wrong URLs

| URL | Result |
|-----|--------|
| `yunusbashashaik.github.io` | Not your store (404 or wrong page) |
| `yunusbashashaik.github.io/Global-Stores/` | **Correct — your homepage** |
