# MYBBOR Personal Site

Personal landing page with contact links, QR code, blog, and tools/projects section.

## Tech Stack

- Static HTML, one file per page
- Vanilla CSS embedded in each HTML file
- Vanilla JavaScript
- No framework and no required build step

## Structure

```text
├── index.html                          # Main landing page
├── petaluma-sonoma-ham-radio.html      # Ham radio frequency guide
├── ham-dashboard.html                  # Live ham radio dashboard
├── build.js                            # Optional static generation/helper script
├── img/
│   ├── Mybbor.jpg                      # Hero background image
│   └── Petaluma Sonoma Radio Reference Icon.svg
├── data/
│   └── Petaluma Sonoma County.csv      # Baofeng memory channel export
└── posts/
    ├── index.json                      # Blog post manifest
    └── */                              # Generated post folders/pages
```

## Pages

### `index.html`

- Landing page: a cyberpunk masthead (centered anchor nav + animated glitch logo) over a background photo, fading into editorial About / Projects / AI-Assisted Writing sections; QR code in the footer.
- Blog list loads from `posts/index.json`; each card links to its standalone page at `/posts/<slug>/`.
- To add a project card, add an `<a class="project-quick">` entry in the `.project-grid` div.

### `petaluma-sonoma-ham-radio.html`

- Baofeng UV-5R memory channel plan for Petaluma and Sonoma County, CA.
- Includes ham repeaters, ACS emergency, ISS/APRS, NOAA weather, FRS/GMRS, and marine VHF.
- Data lives in `data/Petaluma Sonoma County.csv`.
- CSV is linked for download both in the hero subtitle and the footer.
- All hero chips, stat cards, and quick-scan cards link to their respective page sections.

### `ham-dashboard.html`

- Local static dashboard page for radio information.
- Keep it dependency-free unless the project deliberately adds a shared build path.

## Adding Blog Posts

1. Create or update the post source/content in `posts/`.
2. Include frontmatter when working from Markdown:

   ```markdown
   ---
   title: Post Title
   date: YYYY-MM-DD
   author: Robby McCullough
   tags: [tag1, tag2]
   ---
   ```

3. Update `posts/index.json` with matching metadata.
4. If using `build.js`, run the existing build flow and inspect the generated post output.

## Design Conventions

"Cyberpunk-editorial" hybrid (June 2026 redesign):

- Ground: warm near-black ink `#15171B`; text: paper-white `#F2F0E9`; metadata: slate `#9AA3B2`.
- Single flat accent: chartreuse `#C3E940` (links, tags, node dots, dividers). Avoid glowing gradient headings, neon-on-everything, and glass/frosted body panels — that "AI slop" look is what the redesign moved away from.
- Type: Archivo (display/headings), Schibsted Grotesk (body), Spline Sans Mono (metadata/labels).
- Neon is intentional, not a default: the homepage and radio hero keep a cyberpunk treatment (background photo, animated MYBBOR↔ROBBYM glitch logo, radar sweep) that fades into a calm editorial body below.
- Reusable accent: the animated `.glow-line` under the masthead and each section head.
- Respect `prefers-reduced-motion` (it gates the glitch, rain, radar, and flicker animations).
- The radio guide keeps its radar/command-center character; the dashboard keeps its tile layout — both on the new ink/paper/chartreuse system.

## Development

Run locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Optional build-related commands:

```bash
npm install
node build.js
```

## Deployment

Hosted on a self-managed Caddy server (DigitalOcean, "Andromeda"), served from `/var/www/mybbor.com`. **Not Netlify** — that was migrated away in May 2026.

Pushing to `main` triggers `.github/workflows/deploy.yml`, which SSHes into the server and runs `git pull origin main && npm ci --production && node build.js`.

- The generated post pages (`posts/<slug>/index.html`) are **build artifacts**: gitignored and produced on the server by `build.js`. Do **not** commit them — doing so makes the server's `git pull` abort on untracked-file conflicts.
- Caddy serves `index.html` as a catch-all for unknown paths. A repo `_redirects` file is inert here; URL redirects belong in the server's Caddyfile.

## Workflow Notes

- Prefer this `AGENTS.md` for agent-facing instructions. Harness-specific files should reference it instead of duplicating project guidance.
- Before editing, check `git status --short`; the worktree may contain user edits.
- Do not revert unrelated changes.
- Keep changes scoped. This is a mostly static site, so avoid adding dependencies or a framework for narrow edits.
- For visual page changes, run the local server and inspect the affected page in a browser before calling the work done.
