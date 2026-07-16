# Human Notes

## Last Accessed

- Date: 2026-07-15
- Agent harness: Claude Code
- Harness project/session name: `mybbor.com`
- Local path: `/Users/mybbor/Library/CloudStorage/Dropbox/websites/mybbor.com`

## Project Context

- Parent project: Personal websites
- Sub-project: `mybbor.com`
- Related folders: `posts/`, `img/`, `data/`, `dashboard/`, `radio/`

## Return Notes

- Cropped and optimized the three Desktop `ChatGPT*` project-card images into `img/projects/*.webp` at `900x480`; `index.html` now uses those WebP files instead of the SVG placeholders.
- Added `AGENTS.md` as the portable source of agent-facing project instructions.
- Replaced duplicated `CLAUDE.md` content with a pointer to `AGENTS.md`.
- Existing site files had unrelated uncommitted changes before this update; do not revert them without explicit direction.
- Added `WRITING-PROFILE.md` as a pointer to the canonical Dropbox AI writing profile, replacing the stale ignored local YAML copy.
- Added `BLOG-FEATURED-IMAGES.md` with the reusable featured-image workflow for cyberpunk-editorial blog images.
- Reworked the Super Beaver World post into a shorter, more focused account of the art, game mechanics, polish, and Beaver Builder MCP integration; removed the leaderboard outage section, corrected the super-jump description, and added a responsive pull quote plus a Beaver Builder editor screenshot for visual pacing.
- Added `admin/preview.css` and registered it with Sveltia CMS; trusted raw HTML is enabled for the Markdown preview so pull quotes render and position without rebuilding the site.
- **Fixed the radio reference CSV download** (reported broken by a visitor on Instagram). It had been serving homepage HTML instead of a CSV since the page launched, because `data/Petaluma Sonoma County.csv` was a symlink to Dropbox and never deployed. Now shipping two real committed files: `All Channels` (155) and `No AM` (140, for the UV-5R).
  - **If you update frequencies in CHIRP, the site does not update itself.** The CSVs in `data/` are copies of the Dropbox originals in `Radio/channel csvs/`. You have to copy them in and commit. Do not "fix" this with a symlink — that is the bug that broke it. Full steps are in `AGENTS.md` → *Frequency CSVs*.
  - Worth knowing: Caddy's catch-all means a missing file returns **200 with homepage HTML**, not a 404. Broken asset links look fine until you open the file. Check `content_type`, not just the status code.
  - Still open: the old `/data/Petaluma%20Sonoma%20County.csv` URL still serves HTML for anyone holding an old bookmark. Closing it needs a `redir` in the server's Caddyfile (server-side, not in this repo).
