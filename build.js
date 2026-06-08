#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };
  const data = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) data[key] = val;
  });
  return { data, body: match[2] };
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function generatePage(post, data, contentHtml) {
  const title = data.title || post.title;
  const description = post.excerpt || '';
  const image = post.image ? `https://mybbor.com${post.image}` : 'https://mybbor.com/img/Mybbor.jpg';
  const url = `https://mybbor.com/posts/${post.slug}/`;
  const postDate = data.date || post.date;
  const displayDate = formatDate(postDate);
  const author = data.author || 'Robby McCullough';
  const contentWithDate = contentHtml.replace(
    /(<h1[^>]*>[\s\S]*?<\/h1>)/,
    `$1\n      <p class="post-date">By ${author} · Published ${displayDate}</p>`
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — mybbor.com</title>
  <meta name="description" content="${description}">
  <meta name="author" content="Robby McCullough">
  <link rel="canonical" href="${url}">
  <link rel="icon" type="image/svg+xml" href="/img/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Schibsted+Grotesk:wght@400;500;700&family=Spline+Sans+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script defer data-domain="mybbor.com" src="https://analytics.robbymccullough.com/js/script.js"></script>

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Mybbor">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="article:author" content="https://mybbor.com">
  <meta property="article:published_time" content="${data.date || post.date}T00:00:00Z">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@RobbyMcCullough">
  <meta name="twitter:creator" content="@RobbyMcCullough">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${title.replace(/"/g, '\\"')}",
    "description": "${description.replace(/"/g, '\\"')}",
    "image": "${image}",
    "url": "${url}",
    "datePublished": "${data.date || post.date}",
    "author": {
      "@type": "Person",
      "name": "Robby McCullough",
      "url": "https://mybbor.com"
    },
    "publisher": {
      "@type": "Person",
      "name": "Robby McCullough",
      "url": "https://mybbor.com"
    }
  }
  </script>

  <style>
    /* Art Direction Daily restyle — matches mybbor.com home */
    :root {
      --ink:#15171B; --ink-raised:#1b1e23; --paper:#F2F0E9; --slate:#9AA3B2;
      --chartreuse:#C3E940; --line:rgba(242,240,233,0.10); --line-strong:rgba(242,240,233,0.20);
      --radius:6px;
      --display:'Archivo',system-ui,sans-serif;
      --body:'Schibsted Grotesk',system-ui,sans-serif;
      --mono:'Spline Sans Mono',ui-monospace,monospace;
    }
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: var(--ink); color: var(--paper); font-family: var(--body); font-size: 18px; line-height: 1.75; -webkit-font-smoothing: antialiased; min-height: 100vh; }
    a { color: var(--chartreuse); }
    ::selection { background: var(--chartreuse); color: var(--ink); }

    /* ===== Sticky header bar — site title (left) + nav (right) ===== */
    .sitenav { position: sticky; top: 0; z-index: 50; background: rgba(21,23,27,0.9); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
    .sitenav-inner { max-width: 860px; margin: 0 auto; padding: 0 1.5rem; height: 54px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .sitenav-brand { display: inline-flex; align-items: center; text-decoration: none; line-height: 1; }
    .sitenav-links { display: flex; gap: 0.25rem; flex-wrap: wrap; }
    .sitenav-links a { font-family: var(--mono); font-size: 0.78rem; color: var(--slate); text-decoration: none; padding: 0.35rem 0.65rem; border-radius: var(--radius); transition: color .2s ease, background .2s ease; }
    .sitenav-links a:hover { color: var(--chartreuse); background: var(--ink-raised); }
    .logo {
      position: relative; display: inline-block; font-family: var(--display);
      font-size: 1rem; font-weight: 900; letter-spacing: 0.04em;
      background: linear-gradient(90deg,#00f0ff,#00ff88,#f0ff00,#ff00ff,#00f0ff);
      background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      animation: gradient 4s linear infinite;
      filter: drop-shadow(0 0 6px rgba(0,255,136,0.35));
    }
    .logo::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.32) 0px, rgba(0,0,0,0.32) 1px, transparent 1px, transparent 4px); opacity: 0.38; animation: crt-flicker 4s steps(40) infinite; }
    @keyframes gradient { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
    @keyframes crt-flicker { 0%,100% { opacity: 0.38; } 48% { opacity: 0.34; } 50% { opacity: 0.24; } 52% { opacity: 0.34; } }
    @keyframes glitch-out { 0%{opacity:1;transform:translate(0) skewX(0)} 5%{opacity:1;transform:translate(-3px,0) skewX(-2deg);text-shadow:-3px 0 #ff00ff,3px 0 #00f0ff} 10%{opacity:0} 15%{opacity:1;transform:translate(3px,0) skewX(2deg);text-shadow:3px 0 #ff00ff,-3px 0 #00f0ff} 20%{opacity:0} 25%{opacity:.8;transform:translate(-2px,1px) skewX(-1deg);text-shadow:-2px 0 #ff00ff,2px 0 #00f0ff} 30%{opacity:0} 35%{opacity:.6;transform:translate(0,-2px) skewX(3deg);text-shadow:2px 0 #ff00ff,-2px 0 #00f0ff} 50%{opacity:0;transform:translate(0) skewX(0)} 100%{opacity:0;transform:translate(0) skewX(0);text-shadow:none} }
    @keyframes glitch-in { 0%{opacity:0;transform:translate(0) skewX(0)} 50%{opacity:0} 55%{opacity:.6;transform:translate(0,2px) skewX(-3deg);text-shadow:-2px 0 #ff00ff,2px 0 #00f0ff} 60%{opacity:0} 65%{opacity:.8;transform:translate(2px,-1px) skewX(1deg);text-shadow:2px 0 #ff00ff,-2px 0 #00f0ff} 70%{opacity:0} 75%{opacity:1;transform:translate(-3px,0) skewX(-2deg);text-shadow:-3px 0 #ff00ff,3px 0 #00f0ff} 80%{opacity:0} 85%{opacity:1;transform:translate(3px,0) skewX(2deg);text-shadow:3px 0 #ff00ff,-3px 0 #00f0ff} 95%{opacity:1;transform:translate(0) skewX(0)} 100%{opacity:1;transform:translate(0) skewX(0)} }
    .logo.glitch-out { animation: glitch-out .5s steps(1) forwards; }
    .logo.glitch-in { animation: glitch-in .5s steps(1) forwards; }

    /* ===== Article ===== */
    .post-wrap { max-width: 760px; margin: 0 auto; padding: 2.5rem 1.5rem 5rem; }
    .back-link { display: inline-block; font-family: var(--mono); font-size: 0.8rem; color: var(--slate); text-decoration: none; margin-bottom: 2rem; transition: color .2s; }
    .back-link:hover { color: var(--chartreuse); }
    .featured-image { width: 100%; height: auto; border: 1px solid var(--line); border-radius: var(--radius); margin-bottom: 2.5rem; display: block; }
    .post-content { color: var(--paper); line-height: 1.8; }
    .post-content .post-date { color: var(--slate); font-family: var(--mono); font-size: 0.8rem; margin-bottom: 2.25rem; }
    .post-content h1 { font-family: var(--display); font-weight: 900; font-size: clamp(1.9rem, 4.5vw, 2.8rem); line-height: 1.05; letter-spacing: -0.01em; color: var(--paper); margin-bottom: 0.6rem; }
    .post-content h2 { font-family: var(--display); font-weight: 800; font-size: 1.6rem; color: var(--paper); margin: 2.5rem 0 1rem; }
    .post-content h3 { font-family: var(--display); font-weight: 800; font-size: 1.25rem; color: var(--paper); margin: 2rem 0 0.75rem; }
    .post-content p { margin-bottom: 1.2rem; }
    .post-content a { color: var(--chartreuse); text-decoration: underline; text-underline-offset: 2px; }
    .post-content a:hover { text-decoration-thickness: 2px; }
    .post-content ul, .post-content ol { margin: 1rem 0 1.2rem 1.5rem; }
    .post-content li { margin-bottom: 0.5rem; }
    .post-content code { font-family: var(--mono); font-size: 0.88em; background: var(--ink-raised); color: var(--chartreuse); padding: 0.12rem 0.4rem; border-radius: 4px; }
    .post-content pre { background: var(--ink-raised); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.1rem 1.2rem; overflow-x: auto; margin: 1.5rem 0; }
    .post-content pre code { background: none; padding: 0; color: var(--paper); }
    .post-content blockquote { background: rgba(0,0,0,0.22); border-left: 2px solid var(--chartreuse); border-radius: 0 var(--radius) var(--radius) 0; padding: 0.9rem 1.3rem; margin: 1.5rem 0; font-style: italic; font-size: 1.12rem; color: var(--paper); }
    .post-content blockquote p { margin-bottom: 0.5rem; }
    .post-content img { max-width: 100%; height: auto; border: 1px solid var(--line); border-radius: var(--radius); }
    .post-content hr { border: none; border-top: 1px solid var(--line); margin: 2.5rem 0; }
    .post-footer { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; font-family: var(--mono); font-size: 0.8rem; }
    .post-footer a { color: var(--slate); text-decoration: none; }
    .post-footer a:hover { color: var(--chartreuse); }
    .post-footer-id { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; text-align: right; }
    .qr-code { padding: 5px; background: var(--ink); border: 1px solid var(--line-strong); border-radius: var(--radius); line-height: 0; }
    .qr-code canvas { display: block; width: 62px; height: 62px; }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .logo, .logo::after { animation: none !important; }
      * { transition: none !important; }
    }
  </style>
</head>
<body>
  <nav class="sitenav">
    <div class="sitenav-inner">
      <a href="/" class="sitenav-brand"><span class="logo">MYBBOR</span></a>
      <div class="sitenav-links">
        <a href="/#top">Home</a>
        <a href="/#about">About</a>
        <a href="/#projects">Projects</a>
        <a href="/#writing">Blog</a>
      </div>
    </div>
  </nav>

  <main class="post-wrap">
    <a class="back-link" href="/#writing">← All writing</a>
    ${post.image ? `<img class="featured-image" src="${post.image}" alt="${title}">` : ''}
    <article class="post-content">
      ${contentWithDate}
    </article>

    <footer class="post-footer">
      <a href="/#writing">← All writing</a>
      <div class="post-footer-id">
        <div class="qr-code" id="qrcode"></div>
        <a href="/">mybbor.com</a>
      </div>
    </footer>
  </main>

  <script>
    (function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var logo = document.querySelector('.logo');
      if (!logo) return;
      var names = ['MYBBOR', 'ROBBYM'], i = 0;
      setInterval(function () {
        logo.classList.add('glitch-out');
        setTimeout(function () {
          i = (i + 1) % names.length;
          logo.textContent = names[i];
          logo.classList.remove('glitch-out');
          logo.classList.add('glitch-in');
          setTimeout(function () { logo.classList.remove('glitch-in'); }, 500);
        }, 500);
      }, 4000);
    })();
  </script>

  <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
  <script>
    (function () {
      var el = document.getElementById('qrcode');
      if (!el || typeof qrcode === 'undefined') return;
      var qr = qrcode(4, 'M');
      qr.addData(window.location.origin || 'https://mybbor.com');
      qr.make();
      var count = qr.getModuleCount(), margin = 4, cell = 5;
      var px = (count + margin * 2) * cell;
      var c = document.createElement('canvas');
      c.width = c.height = px;
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#15171B'; ctx.fillRect(0, 0, px, px);
      ctx.fillStyle = '#F2F0E9';
      for (var r = 0; r < count; r++) for (var col = 0; col < count; col++) if (qr.isDark(r, col)) ctx.fillRect((col + margin) * cell, (r + margin) * cell, cell, cell);
      el.appendChild(c);
    })();
  </script>
</body>
</html>`;
}

const POSTS_DIR = 'posts';

// Derive the blog manifest from each post's frontmatter so the Markdown files
// are the single source of truth (edited via Sveltia CMS). posts/index.json is
// a generated artifact — see AGENTS.md.
function buildManifest() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const { data } = parseFrontmatter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
      if (!data.slug) {
        console.warn(`Skipping ${file} — no "slug" in frontmatter`);
        return null;
      }
      return {
        file,
        slug: data.slug,
        title: data.title || data.slug,
        date: data.date || '',
        image: data.image || '',
        excerpt: data.excerpt || ''
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)); // newest first
}

const posts = buildManifest();
fs.writeFileSync(path.join(POSTS_DIR, 'index.json'), JSON.stringify(posts, null, 4) + '\n');
console.log(`Wrote posts/index.json — ${posts.length} entries.`);

for (const post of posts) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, post.file), 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const contentHtml = marked.parse(body);
  const outDir = path.join(POSTS_DIR, post.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), generatePage(post, data, contentHtml));
  console.log(`Built: /posts/${post.slug}/`);
}

console.log(`Done — ${posts.length} posts built.`);
