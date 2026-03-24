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

Static HTML, vanilla CSS, vanilla JS. No frameworks, no build step.

```
├── index.html                        # Main landing page
├── petaluma-sonoma-ham-radio.html    # Ham radio frequency guide
├── img/                              # Images and SVG favicon
├── data/                             # CHIRP-compatible radio CSV
└── posts/                            # Markdown blog posts
```

## Running locally

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).
