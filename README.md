# nimbi-site

The landing page for **nimbi**, a family of small native Mac apps. Static files, no build step, hosted on Cloudflare Pages.

The brand and design system shared by every nimbi app lives in [DESIGN.md](DESIGN.md).

```
public/                 everything that gets deployed
  index.html            the page (head, meta, share tags)
  404.html              shown for unknown paths
  _headers              security and cache headers for Cloudflare Pages
  assets/site.css       styles
  assets/site.js        the cloud mascot, the playable stage, scroll motion
  assets/relay-demo.*   Relay demo as WebM + MP4 (+ poster), converted from Relay's docs/demo.gif
  vendor/               GSAP 3.15.0 + ScrollTrigger, served from the site itself
  favicon.svg, *.png    icons and the 1200x630 share image (og.png)
tools/
  make-icons.mjs        writes favicon.svg and the pages Chrome renders into PNGs
  render.sh             renders those pages with headless Chrome
```

## Preview locally

```bash
python3 -m http.server 8787 --directory public
```

Then open http://localhost:8787.

## Deploy to Cloudflare Pages

**Option A, connected to GitHub (deploys on every push):**

1. Push this folder to a GitHub repository.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git, and pick the repository.
3. Framework preset: **None**. Build command: leave empty. Build output directory: **`public`**.
4. Save and deploy. The site goes live at `<project>.pages.dev`.

**Option B, from the terminal:**

```bash
npx wrangler login
```

```bash
npx wrangler pages deploy public --project-name nimbi
```

## Custom domain

1. Register the domain in Cloudflare (Domain Registration), or add an existing one as a zone.
2. Pages project → Custom domains → Set up a custom domain → `nimbi.studio`. Cloudflare adds the DNS record and the certificate.
3. Add any second domain (for example `getnimbi.app`) the same way, then add a Redirect Rule from it to `https://nimbi.studio/$1` with status 301.

The canonical domain appears in `public/index.html` (canonical and share tags), `public/robots.txt` and `public/sitemap.xml`. To change it:

```bash
grep -rl "nimbi.studio" public | xargs sed -i '' 's/nimbi\.studio/NEW-DOMAIN/g'
```

## Regenerate icons and the share image

```bash
node tools/make-icons.mjs && sh tools/render.sh
```

## Adding the next app

The app family section is a log (`#apps` in `index.html`). Add a new `<li class="entry">` above the "Now" entry with the app's icon, release month and one line about it. "Now · The next cloud is forming" always stays after the released apps.
