# MYBBOR Personal Site

Personal landing page with contact links and QR code for easy sharing.

## Tech Stack

- Static HTML (single `index.html` file)
- Vanilla CSS (embedded in HTML)
- Vanilla JavaScript (no frameworks or build tools)

## Structure

```
├── index.html        # Main page with all styles and scripts
├── img/
│   └── Mybbor.jpg    # Background image
└── posts/
    ├── index.json    # Blog post manifest (must be updated when adding posts)
    └── *.md          # Markdown blog posts
```

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

Cyberpunk/neon aesthetic with:
- Dark background (#0a0a0f)
- Neon accent colors: cyan (#00f0ff), lime (#00ff88), magenta (#ff00ff)
- Animated gradient logo
- Rain effect and CRT scanlines
- QR code that links to current page URL

## Development

Run locally:
```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deployment

Static site - deploy to any web host by uploading files directly.
