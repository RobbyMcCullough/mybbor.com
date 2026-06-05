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

- Main landing page with hero, QR code, social links, tools/projects, and blog.
- Blog data loads from `posts/index.json`.
- To add a project card, add an `<a class="project-card">` entry in the `.projects-list` div.

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

- Shared dark background: `#0a0a0f`.
- Core accents: cyan `#00f0ff`, green `#00ff88`, magenta `#ff00ff`, and amber `#ffb800`.
- CRT scanlines overlay is fixed with high z-index.
- Cards and panels commonly use glass/frosted effects with `backdrop-filter: blur`.
- Preserve the existing cyberpunk/neon landing-page style and radar/command-center radio-guide style unless the task explicitly changes direction.

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

Hosted on Netlify. Push to `main` on GitHub to deploy live.

## Workflow Notes

- Prefer this `AGENTS.md` for agent-facing instructions. Harness-specific files should reference it instead of duplicating project guidance.
- Before editing, check `git status --short`; the worktree may contain user edits.
- Do not revert unrelated changes.
- Keep changes scoped. This is a mostly static site, so avoid adding dependencies or a framework for narrow edits.
- For visual page changes, run the local server and inspect the affected page in a browser before calling the work done.
