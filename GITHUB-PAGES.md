# GitHub Pages setup (free account)

## Your store URL (bookmark this on iPad)

### **https://yunusbashashaik.github.io/Global-Stores/**

---

## Fix: seeing README text instead of the website

That happens when Pages uses the **`main`** branch **root** folder — GitHub can show `README.md` instead of the app.

### Change one setting

1. **https://github.com/Yunusbashashaik/Global-Stores/settings/pages**
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` (not `main`)
4. **Folder:** `/ (root)`
5. **Save**, wait 2–3 minutes, then open the link above.

The `gh-pages` branch contains **only** the built website (no README).

### Wrong URLs

| URL | Result |
|-----|--------|
| `yunusbashashaik.github.io` | Not your store (404 or wrong page) |
| `yunusbashashaik.github.io/Global-Stores/` | **Correct — your homepage** |
