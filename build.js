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

function generatePage(post, data, contentHtml, olderPost, newerPost) {
  const title = data.title || post.title;
  const description = post.excerpt || '';
  const image = post.image ? `https://mybbor.com${post.image}` : 'https://mybbor.com/img/Mybbor.jpg';
  const url = `https://mybbor.com/posts/${post.slug}/`;
  const postDate = data.date || post.date;
  const displayDate = formatDate(postDate);
  const author = data.author || 'Robby McCullough';
  const shareU = encodeURIComponent(url);
  const shareT = encodeURIComponent(title);
  const navBack = olderPost
    ? `<a class="post-nav-btn" href="/posts/${olderPost.slug}/" rel="prev">Back</a>`
    : `<span class="post-nav-btn is-disabled" aria-disabled="true">Back</span>`;
  const navNext = newerPost
    ? `<a class="post-nav-btn" href="/posts/${newerPost.slug}/" rel="next">Next</a>`
    : `<span class="post-nav-btn is-disabled" aria-disabled="true">Next</span>`;
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
    .post-wrap { max-width: 760px; margin: 0 auto; padding: 2.5rem 1.5rem 3rem; }
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
    .post-content .pullquote {
      float: right;
      width: min(46%, 320px);
      margin: 0.5rem 0 1.2rem 2rem;
      padding: 1.1rem 0 1.2rem;
      border-top: 2px solid var(--chartreuse);
      border-bottom: 1px solid var(--line);
      font-family: var(--display);
      font-weight: 800;
      font-size: 1.4rem;
      line-height: 1.3;
      letter-spacing: -0.01em;
      color: var(--paper);
    }
    .post-content .pullquote::before { content: "\\201C"; display: block; color: var(--chartreuse); font-size: 2.2rem; line-height: 0.6; margin-bottom: 0.5rem; }
    @media (max-width: 560px) {
      .post-content .pullquote { float: none; width: 100%; margin: 1.8rem 0; }
    }
    /* ===== Post meta footer: byline + share + prev/random/next ===== */
    .post-meta-footer { margin-top: 3.5rem; border-top: 1px solid var(--line); padding-top: 1.6rem; }
    .post-byline-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
    .post-byline { font-family: var(--mono); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--slate); }
    .share-row { display: flex; align-items: center; gap: 1rem; }
    .share-row a, .share-row button { display: inline-flex; color: var(--slate); background: none; border: none; padding: 0; cursor: pointer; transition: color .2s ease; }
    .share-row a:hover, .share-row button:hover { color: var(--chartreuse); }
    .share-row svg { width: 18px; height: 18px; }
    .share-copy .icon-check { display: none; }
    .share-copy.copied { color: var(--chartreuse); }
    .share-copy.copied .icon-link { display: none; }
    .share-copy.copied .icon-check { display: block; }
    .post-nav { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.6rem; }
    .post-nav-btn { display: block; text-align: center; font-family: var(--mono); font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--paper); text-decoration: none; border: 1px solid var(--line-strong); border-radius: var(--radius); padding: 0.85rem 0.5rem; transition: color .2s ease, border-color .2s ease; }
    a.post-nav-btn:hover { color: var(--chartreuse); border-color: var(--chartreuse); }
    .post-nav-btn.is-disabled { color: var(--slate); opacity: 0.45; border-color: var(--line); }
    @media (max-width: 560px) { .post-nav { gap: 0.6rem; } .post-nav-btn { font-size: 0.7rem; letter-spacing: 0.08em; padding: 0.75rem 0.25rem; } }

    /* ===== Universal site footer (keep in sync with index.html) ===== */
    .site-footer { border-top: 1px solid var(--line); padding: 3rem 0 3.5rem; }
    .site-footer-inner { max-width: 860px; margin: 0 auto; padding: 0 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; text-align: center; }
    .site-footer-meta { display: flex; flex-direction: column; gap: 0.45rem; font-family: var(--mono); font-size: 0.8rem; color: var(--slate); }
    .site-footer a { color: var(--slate); }
    .site-footer a:hover { color: var(--paper); }

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

    <footer class="post-meta-footer">
      <div class="post-byline-row">
        <span class="post-byline">By ${author} &middot; ${displayDate}</span>
        <div class="share-row">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${shareU}" target="_blank" rel="noopener" aria-label="Share on Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
          <a href="https://x.com/intent/post?url=${shareU}&amp;text=${shareT}" target="_blank" rel="noopener" aria-label="Share on X"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg></a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareU}" target="_blank" rel="noopener" aria-label="Share on LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
          <a href="https://www.reddit.com/submit?url=${shareU}&amp;title=${shareT}" target="_blank" rel="noopener" aria-label="Share on Reddit"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg></a>
          <a href="https://news.ycombinator.com/submitlink?u=${shareU}&amp;t=${shareT}" target="_blank" rel="noopener" aria-label="Share on Hacker News"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z"/></svg></a>
          <button type="button" class="share-copy" aria-label="Copy link"><svg class="icon-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg><svg class="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></button>
        </div>
      </div>
      <nav class="post-nav" aria-label="Post navigation">
        ${navBack}
        <a class="post-nav-btn" href="/#writing" id="random-post">Random</a>
        ${navNext}
      </nav>
    </footer>
  </main>

  <footer class="site-footer">
    <div class="site-footer-inner">
      <div class="site-footer-meta">
        <a href="/">&copy; <span id="copyright-year"></span> Robby McCullough</a>
        <a href="https://robbymccullough.com" target="_blank" rel="noopener">robbymccullough.com</a>
      </div>
    </div>
  </footer>

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

  <script>
    document.getElementById('copyright-year').textContent = new Date().getFullYear();

    // Random post: pick any other slug from the manifest
    (function () {
      var btn = document.getElementById('random-post');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        fetch('/posts/index.json')
          .then(function (r) { return r.json(); })
          .then(function (list) {
            var others = list.filter(function (p) { return p.slug !== '${post.slug}'; });
            if (!others.length) { window.location.href = '/#writing'; return; }
            var pick = others[Math.floor(Math.random() * others.length)];
            window.location.href = '/posts/' + pick.slug + '/';
          })
          .catch(function () { window.location.href = '/#writing'; });
      });
    })();

    // Copy link button
    (function () {
      var btn = document.querySelector('.share-copy');
      if (!btn) return;
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(window.location.href).then(function () {
          btn.classList.add('copied');
          setTimeout(function () { btn.classList.remove('copied'); }, 1500);
        });
      });
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
        thumb_position: data.thumb_position || '',
        excerpt: data.excerpt || ''
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)); // newest first
}

const posts = buildManifest();
fs.writeFileSync(path.join(POSTS_DIR, 'index.json'), JSON.stringify(posts, null, 4) + '\n');
console.log(`Wrote posts/index.json — ${posts.length} entries.`);

posts.forEach((post, i) => {
  const raw = fs.readFileSync(path.join(POSTS_DIR, post.file), 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const contentHtml = marked.parse(body);
  const outDir = path.join(POSTS_DIR, post.slug);
  // Posts are sorted newest first: next is the newer neighbor, back is the older one.
  const newerPost = posts[i - 1] || null;
  const olderPost = posts[i + 1] || null;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), generatePage(post, data, contentHtml, olderPost, newerPost));
  console.log(`Built: /posts/${post.slug}/`);
});

console.log(`Done — ${posts.length} posts built.`);
