# Eat Me First

A one-page guide to household food waste with a working "fridge finder": tick the ingredients you have and get recipes ranked by how many of them each one uses. 40 recipes across 50 ingredients. Plain HTML, one CSS file, one JS file. No build step, no dependencies, no tracking. Installable as an offline PWA.

## Put it on GitHub Pages
1. Create a new public repository on GitHub (for example `eat-me-first`).
2. Upload everything in this folder to the **root** of the repository (drag the files in, including the `icons` folder and the hidden `.nojekyll` file if your system shows it).
3. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then Save.
4. After a minute or two your link appears at the top of that page: `https://<your-username>.github.io/<repo-name>/`

Everything uses relative paths, so it works from a project sub-folder URL like that.

## Offline and updates
The service worker (`sw.js`) saves the page on first visit, so it opens with no connection. When you change any file, edit `VERSION` at the top of `sw.js` (for example `v1` to `v2`) so returning visitors get the new files.

## Files
- `index.html`, `styles.css`, `app.js`: the page
- `sw.js`, `manifest.webmanifest`, `icons/`: offline and install support
- Recipes live in the `RECIPES` list near the top of `app.js`

Sources: UNEP Food Waste Index Report 2024 (with WRAP). Recipes are general guidance, not food-safety advice.
