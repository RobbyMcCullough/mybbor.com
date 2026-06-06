# mybbor.com

![Mybbor](img/Mybbor.jpg)

Personal site of **Robby McCullough** — entrepreneur, photographer, digital nomad, and co-founder of [Beaver Builder](https://www.wpbeaverbuilder.com). Handle: Mybbor.

**Live site:** [mybbor.com](https://mybbor.com)

---

## Pages

**[mybbor.com](https://mybbor.com)** — Landing page with social links, blog, and projects.

**[Petaluma-Sonoma Ham Radio Guide](https://mybbor.com/petaluma-sonoma-ham-radio.html)** — A personal, opinionated ham radio frequency reference for the North Bay. Includes a [CHIRP](https://chirpmyradio.com)-compatible CSV for programming most amateur radios.

---

## Stack

Static HTML, vanilla CSS, vanilla JS. No framework. A small Node script (`build.js`) generates the standalone blog-post pages from Markdown.

```
├── index.html                        # Main landing page
├── petaluma-sonoma-ham-radio.html    # Ham radio frequency guide
├── ham-dashboard.html                # Live ham radio dashboard
├── build.js                          # Generates blog-post pages from Markdown
├── img/                              # Images and SVG favicon
├── data/                             # CHIRP-compatible radio CSV
└── posts/                            # Markdown sources + generated pages
```

---

## Deployment

Self-hosted on a **Caddy** server (DigitalOcean). Pushing to `main` triggers a GitHub Action (`.github/workflows/deploy.yml`) that SSHes into the server, runs `git pull` + `node build.js`, and Caddy serves the result. **Not Netlify** (migrated off in May 2026), so there's no `netlify deploy` step and a Netlify-style `_redirects` file does nothing — URL redirects live in the server's Caddyfile.

