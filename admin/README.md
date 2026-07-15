# Content Manager (Sveltia CMS)

The blog is edited through [Sveltia CMS](https://sveltiacms.app) — a modern, Git-based
successor to Decap/Netlify CMS. It lives at **https://mybbor.com/admin/** and commits
Markdown straight to the `main` branch, which triggers the normal Caddy deploy.

- `admin/index.html` — loads Sveltia from the CDN.
- `admin/config.yml` — the collection schema (one entry per blog post).
- `admin/preview.css` — mirrors the generated post styles inside Sveltia's preview pane.

## How content flows

1. You create/edit a post in the CMS UI.
2. Sveltia commits a Markdown file to `posts/` (frontmatter + body) on `main`.
3. The push fires `.github/workflows/deploy.yml`, which runs `node build.js` on the server.
4. `build.js` regenerates the post page **and** `posts/index.json` (the blog list) from the
   frontmatter. The Markdown files are the single source of truth; `posts/index.json` and
   `posts/<slug>/` are generated artifacts (gitignored).

Each post's frontmatter carries `title`, `date`, `author`, `slug`, `image`, `excerpt`, and
`tags`. Keep `excerpt` to a single line — `build.js` uses a lightweight frontmatter parser,
so a multi-line/block value won't be picked up for the blog-list card.

## Editor preview

Sveltia's preview pane loads `admin/preview.css`, so typography, images, blockquotes, and
`<aside class="pullquote">` elements closely match the generated post without running
`node build.js`. The Markdown body has `sanitize_preview: false` because Sveltia otherwise
removes the raw HTML used by pull quotes. Keep this setting limited to trusted authors.

After changing `admin/config.yml` or `admin/preview.css`, reload the CMS tab. A full site
build is still required to update the actual local post page.

## One-time sign-in setup

Because the site is self-hosted on Caddy (not Netlify), there's no Git Gateway. Pick one:

### Option A — Personal Access Token (fastest, solo use)

1. Go to **https://mybbor.com/admin/** and click **Sign In with Token**.
2. Create a GitHub [fine-grained PAT](https://github.com/settings/tokens) scoped to the
   `RobbyMcCullough/mybbor.com` repo with **Contents: Read and write** permission.
3. Paste it when prompted. The token is stored locally in your browser only.

No config change is needed for this path.

### Option B — GitHub OAuth (nicer login, shareable)

1. Deploy the [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth)
   to Cloudflare Workers (free) and note the Worker URL.
2. Register a GitHub OAuth app whose callback points at that Worker.
3. Uncomment `base_url:` in `admin/config.yml` and set it to the Worker URL.

## Local testing

```bash
python3 -m http.server 8000
# open http://localhost:8000/admin/
```

The GitHub backend authenticates against the live repo even from localhost, so edits you
save while testing will commit to `main`. Use a throwaway draft if you just want to poke
around.
