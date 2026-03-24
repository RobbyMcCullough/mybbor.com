# MYBBOR Personal Site

Personal landing page with contact links, QR code, blog, and tools/projects section.

## Tech Stack

- Static HTML (one file per page)
- Vanilla CSS (embedded in each HTML file)
- Vanilla JavaScript (no frameworks or build tools)

## Structure

```
├── index.html                          # Main landing page
├── Petaluma Sonoma Cheat Sheet.html    # Ham radio frequency guide
├── img/
│   ├── Mybbor.jpg                      # Hero background image
│   └── Petaluma Sonoma Radio Reference Icon.svg  # Radio guide favicon (Baofeng handheld)
├── data/
│   └── Petaluma Sonoma County.csv      # Baofeng memory channel export (CHIRP format)
└── posts/
    ├── index.json    # Blog post manifest (must be updated when adding posts)
    └── *.md          # Markdown blog posts
```

## Pages

### index.html — Main landing page
- Hero with parallax background photo, animated glitch logo, QR code, social links
- Tools & Projects section (amber accent, appears before blog)
- Blog section (loads posts dynamically from `posts/index.json` via fetch)
- To add a project card: add an `<a class="project-card">` entry in the `.projects-list` div

### Petaluma Sonoma Cheat Sheet.html — Ham Radio Frequency Guide
- Baofeng UV-5R memory channel plan for Petaluma and Sonoma County, CA
- 128 channels: ham repeaters, ACS emergency, ISS/APRS, NOAA weather, FRS/GMRS, marine VHF
- Data lives in `data/Petaluma Sonoma County.csv` (CHIRP-compatible export)
- CSV is linked for download both in the hero subtitle and the footer
- All hero chips, stat cards, and quick-scan cards link to their respective page sections

## Adding Blog Posts

1. Create a new markdown file in `posts/` with format `YYYY-MM-DD-slug.md`
2. Add frontmatter at the top:
   ```markdown
   ---
   title: Post Title
   date: YYYY-MM-DD
   author: Robby McCullough
   tags: [tag1, tag2]
   ---
   ```
3. Update `posts/index.json` with the new post metadata

## Design

Shared theme across all pages:
- Dark background (`#0a0a0f`)
- Primary accent: cyan (`#00f0ff`), secondary: green (`#00ff88`), tertiary: magenta (`#ff00ff`)
- CRT scanlines overlay (fixed, z-index 100)
- Glass/frosted panel effects (`backdrop-filter: blur`) on cards and panels

**index.html** — cyberpunk/neon:
- Animated gradient glitch logo, rain drop effect, parallax hero
- Tools & Projects uses amber (`#ffb800`) accent to contrast with cyan blog section

**Radio guide** — radar/command center flavor:
- Monospace font throughout, amber (`#ffb800`) for memory channel numbers (phosphor CRT feel)
- Animated radar sweep in the hero illustration panel
- Multi-point body background gradients (cyan top, magenta bottom-right)
- Glass cards with top-edge highlight lines and `backdrop-filter` blur

## Development

Run locally:
```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deployment

Static site - deploy to any web host by uploading files directly.
