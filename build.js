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
  const contentWithDate = contentHtml.replace(
    /(<h1[^>]*>[\s\S]*?<\/h1>)/,
    `$1\n      <p class="post-date">Published ${displayDate}</p>`
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
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #0a0a0f;
      color: #c0c5ce;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.8;
      min-height: 100vh;
    }

    .site-nav {
      padding: 1.25rem 2rem;
      border-bottom: 1px solid rgba(0, 240, 255, 0.15);
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .site-nav a {
      color: #00f0ff;
      text-decoration: none;
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      transition: text-shadow 0.2s;
    }

    .site-nav a:hover { text-shadow: 0 0 10px rgba(0, 240, 255, 0.6); }

    .site-nav .separator { color: rgba(0, 240, 255, 0.3); }

    .post-wrap {
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem 2rem 5rem;
    }

    .featured-image {
      width: 100%;
      height: auto;
      border-radius: 8px;
      margin-bottom: 2.5rem;
      display: block;
    }

    .post-content .post-date {
      color: #8892a0;
      font-size: 0.92rem;
      font-style: italic;
      line-height: 1.5;
      margin-bottom: 2.75rem;
    }

    .post-content h1 {
      color: #00f0ff;
      font-size: clamp(1.6rem, 4vw, 2.2rem);
      line-height: 1.08;
      margin-bottom: 0.9rem;
      text-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
    }

    .post-content h2 {
      color: #00ff88;
      font-size: 1.4rem;
      margin: 2.5rem 0 1rem;
    }

    .post-content h3 {
      color: #f0ff00;
      font-size: 1.15rem;
      margin: 2rem 0 0.75rem;
    }

    .post-content p { margin-bottom: 1.2rem; }

    .post-content a { color: #ff00ff; text-decoration: none; }
    .post-content a:hover { text-decoration: underline; text-shadow: 0 0 8px rgba(255,0,255,0.5); }

    .post-content ul, .post-content ol { margin: 1rem 0 1rem 2rem; }
    .post-content li { margin-bottom: 0.4rem; }

    .post-content code {
      background: rgba(0, 240, 255, 0.1);
      color: #00f0ff;
      padding: 0.15rem 0.4rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }

    .post-content pre {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 6px;
      padding: 1.25rem;
      overflow-x: auto;
      margin: 1.5rem 0;
    }

    .post-content pre code {
      background: none;
      padding: 0;
      color: #aab0ba;
    }

    .post-content blockquote {
      border-left: 2px solid rgba(0, 255, 136, 0.5);
      padding: 0.5rem 1rem;
      margin: 1.5rem 0;
      font-style: italic;
      background: rgba(0, 255, 136, 0.05);
      border-radius: 0 4px 4px 0;
    }

    .post-content blockquote p { margin-bottom: 0; color: #00ff88; }

    .post-content img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
    }

    .post-content hr {
      border: none;
      border-top: 1px solid rgba(0, 240, 255, 0.15);
      margin: 2.5rem 0;
    }

    .post-footer {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(0, 240, 255, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .post-footer a {
      color: #00f0ff;
      text-decoration: none;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .post-footer a:hover { text-shadow: 0 0 10px rgba(0, 240, 255, 0.6); }
  </style>
</head>
<body>
  <nav class="site-nav">
    <a href="/">Mybbor.com</a>
    <span class="separator">/</span>
    <a href="/#blog-posts">Posts</a>
  </nav>

  <article class="post-wrap">
    ${post.image ? `<img class="featured-image" src="${post.image}" alt="${title}">` : ''}
    <div class="post-content">
      ${contentWithDate}
    </div>

    <footer class="post-footer">
      <a href="/#blog-posts">← All posts</a>
      <a href="/">Mybbor.com</a>
    </footer>
  </article>
</body>
</html>`;
}

const posts = JSON.parse(fs.readFileSync('posts/index.json', 'utf8'));

for (const post of posts) {
  const filePath = path.join('posts', post.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping ${post.file} — file not found`);
    continue;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const contentHtml = marked.parse(body);
  const outDir = path.join('posts', post.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), generatePage(post, data, contentHtml));
  console.log(`Built: /posts/${post.slug}/`);
}

console.log(`Done — ${posts.length} posts built.`);
