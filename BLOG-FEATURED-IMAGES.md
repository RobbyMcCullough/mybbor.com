# Blog Featured Image Playbook

This site uses cyberpunk-editorial featured images for personal project posts. Images should feel like artifacts from Robby's AI lab: tangible scenes, moody lighting, real texture, and a little analog weirdness. Avoid generic tech gradients, glass panels, abstract AI swirls, and fake UI dashboards unless the post is actually about a dashboard.

## Output

- Primary format: `.jpg` in `img/`, referenced from post frontmatter as `/img/<slug>.jpg`.
- Optional optimized copy: `.webp` sibling for future use, but the current post frontmatter pattern usually points at the `.jpg`.
- Recommended canvas: landscape 16:9 or close to it, at least `1600x900`.
- Keep important subjects inside the center 70% because homepage thumbnails may crop vertically.
- Do not include readable headline text in the image unless the post specifically needs an artifact with text on it. The blog card and post page already provide the title.

## Site Aesthetic

Use the June 2026 cyberpunk-editorial system:

- Base mood: warm near-black ink, paper-white highlights, slate shadows.
- Accent: chartreuse `#C3E940`, used sparingly as screen glow, status LEDs, cable labels, or rim light.
- Lighting: low-key, cinematic, practical light sources, CRT bloom, rain-slick or workshop texture when appropriate.
- Composition: a real scene first, then cyberpunk treatment. The image should look photographed or carefully staged, not like a generic poster.
- Motion/effects: subtle scanlines, chromatic aberration, analog noise, soft bloom, small UI artifacts, and imperfect materials.

## Subject Recipe

For each post, identify one concrete object, place, or artifact:

1. The project artifact: screenshot, device, tool, terminal, printed object, server, radio, sketch, or game.
2. The human context: hands, desk, workshop, garage, cables, coffee, notes, shadowed player silhouettes, or real-world clutter.
3. The visual metaphor: what the post is really about, expressed through the scene rather than text.

Good featured images usually combine all three. Example: for a game post, use a CRT, console, controllers, players, and the actual game screenshot rather than a floating game logo.

## Screenshot Workflow

When the post is about a live web app, game, dashboard, or tool:

1. Visit the live project and capture a current screenshot.
2. Prefer an active, representative state over an empty, loading, or error state.
3. Use the screenshot as reference material for the generated scene.
4. If compositing is available, place the screenshot on the screen surface and match the perspective, scanlines, reflections, and glass curvature.
5. If generation cannot preserve the exact screenshot, require the generated image to echo the screenshot faithfully: same main character, background type, UI rhythm, and palette, but no fake readable UI text.

Keep temporary reference captures under `tmp/<slug>/` unless there is a reason to preserve them.

## Prompt Template

```text
Use case: stylized-concept
Asset type: blog featured image for mybbor.com
Primary request: Create a cinematic cyberpunk-editorial featured image for a blog post about <project>.
Reference: Use the supplied screenshot as the screen content/style reference.
Scene/backdrop: <real-world setting with concrete props>.
Subject: <main artifact and supporting human context>.
Style: tangible photographic scene, warm near-black shadows, restrained chartreuse accents, CRT bloom, subtle scanlines, analog texture, cinematic practical lighting.
Composition: 16:9 landscape, strong center subject, important content inside center 70%, no headline text.
Constraints: no logos unless present in the reference, no fake readable UI copy, no generic neon city, no glassmorphism, no abstract AI swirls, no watermark.
```

## QA Checklist

- The image clearly shows the project artifact or a faithful reference to it.
- It matches the site's ink/paper/chartreuse cyberpunk-editorial direction.
- It works as a blog card thumbnail when vertically cropped.
- It avoids large readable fake text, misspelled labels, watermarks, and over-busy detail.
- The `.jpg` path in frontmatter exists, and any `.webp` sibling was generated from the final image.
