---
title: "It Was Cool Until It Was Everywhere: Redesigning Mybbor.com"
date: 2026-06-05
author: Robby McCullough
tags: [design, ai, agents, redesign]
slug: redesigning-mybbor
image: /img/redesign-hero.jpg
excerpt: "I gave mybbor.com a redesign with Claude Code: kept the cyberpunk glitch hero, gave everything else a calm editorial treatment, and reframed the whole site as an AI lab. Slide through the before and after."
---

# It Was Cool Until It Was Everywhere: Redesigning Mybbor.com

I only put up this site a few months ago, but the pace of change in our AI-accelerated tech landscape made it look dated and sloppy already. I built the first version of mybbor.com as a vibe-coded experiment, leaned all the way into a 90s-hacker-movie aesthetic, and then kept bolting things onto it: a ham radio frequency guide, a live dashboard, a few posts.

It was also, if I'm honest, full of AI slop. Glowing gradient headings, neon on everything, that particular over-produced sheen you start to recognize the second you land on a page. When I first vibe-coded it, that look felt novel. It doesn't anymore. As agentic web design gets more common, people have gotten a lot faster at spotting that sheen and a lot quicker to bounce off it. The glitchy neon hero was genuinely fun. The dozen glowing headings stacked underneath it were not.

So I spent an afternoon rebuilding the whole thing. Here's the before and after. Grab the handle and drag.

<style>
.ba { position: relative; width: 100%; aspect-ratio: 8 / 5; overflow: hidden; border: 1px solid rgba(242,240,233,0.15); border-radius: 8px; margin: 1.75rem 0; background: #0d0f14; user-select: none; -webkit-user-select: none; touch-action: none; }
.ba img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
.ba .ba-after { clip-path: inset(0 0 0 50%); }
.ba .ba-divider { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; margin-left: -1px; background: #C3E940; box-shadow: 0 0 8px rgba(195,233,64,0.5); pointer-events: none; }
.ba .ba-handle { position: absolute; top: 50%; left: 50%; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; background: #15171B; border: 2px solid #C3E940; color: #C3E940; display: grid; place-items: center; font: 700 16px/1 ui-monospace, monospace; pointer-events: none; }
.ba .ba-tag { position: absolute; bottom: 10px; padding: 4px 8px; font: 600 11px/1 ui-monospace, monospace; letter-spacing: .08em; text-transform: uppercase; color: #F2F0E9; background: rgba(13,15,20,0.72); border-radius: 4px; pointer-events: none; }
.ba .ba-tag.is-before { left: 10px; }
.ba .ba-tag.is-after { right: 10px; }
.ba input[type="range"] { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; padding: 0; opacity: 0; cursor: ew-resize; }
</style>

<figure class="ba">
<img class="ba-before" src="/img/redesign-home-before.jpg" alt="The old mybbor.com homepage: a full-screen cyberpunk hero with a QR code and a row of social links over a neon graffiti photo.">
<img class="ba-after" src="/img/redesign-home-after.jpg" alt="The redesigned mybbor.com homepage: a centered nav and glitch logo fading down into a calm, editorial About section.">
<span class="ba-tag is-before">Before</span>
<span class="ba-tag is-after">After</span>
<div class="ba-divider"></div>
<div class="ba-handle">&#8596;</div>
<input type="range" min="0" max="100" value="50" aria-label="Drag to compare the old and new homepage">
</figure>

The new direction came from a publication I'm working on called [Art Direction Daily](https://artdirectiondaily.com). Every day a unique issue is generated, surfacing the day's most important news and stories around AI design, and each day is reimagined in a new visual style.

One recent issue reimagined itself around a "product changelog" archetype: warm near-black backgrounds, paper-white text, one disciplined accent color, monospaced labels, a clean vertical timeline. To me, it feels like the calm, grown-up alternative to glowing-neon-everything, and I wanted to borrow that aesthetic for mybbor.com.

But I couldn't bring myself to kill the glitch logo. The MYBBOR-to-ROBBYM animation over the graffiti photo is the most "me" thing on here. So I kept it. The new site is a hybrid: a loud neon hero up top that fades down into a calm, readable, editorial body. Cyberpunk where it's fun, quiet where it needs to be legible. Neon as a deliberate choice, not as a default setting.

The bigger change is what the site is *for*. The business and personal-brand writing lives over at [robbymccullough.com](https://robbymccullough.com). Mybbor is now officially the experimental annex: AI-assisted projects and posts. An AI lab. Once I named it that, every other decision got easier.

One thing I held onto, just moved: the QR code. The old homepage had one front and center in the hero, and the idea behind it is genuinely useful. If I'm at a conference, or I just want to hand someone my contact info, I pull up the site on my phone, they point their camera at the screen, and it drops them straight onto a page with all my links. Gimmicky, sure, but it works, and it's a fun little party trick. It didn't belong in the hero anymore, so it lives down in the footer now, still one scan away. There's a dedicated [connect page](https://robbymccullough.com/connect) on my main site too.

The [ham radio reference](/petaluma-sonoma-ham-radio.html) got the same treatment. I kept its radar command-center personality and calmed everything else down:

<figure class="ba">
<img class="ba-before" src="/img/redesign-radio-before.jpg" alt="The old ham radio reference page with heavy neon glass panels and glowing cyan borders.">
<img class="ba-after" src="/img/redesign-radio-after.jpg" alt="The redesigned ham radio reference page: the radar hero stays, the tables and panels are calm and legible.">
<span class="ba-tag is-before">Before</span>
<span class="ba-tag is-after">After</span>
<div class="ba-divider"></div>
<div class="ba-handle">&#8596;</div>
<input type="range" min="0" max="100" value="50" aria-label="Drag to compare the old and new radio reference page">
</figure>

## Steal the vocabulary

If I'd pass along one thing, it's that getting good design out of a model is mostly a vocabulary exercise. "Make it look cool" gets you slop. Naming what you actually want gets you something with a point of view. Here's the shape of the brief that produced this look:

> Design with editorial restraint. A warm near-black ground, paper-white text, and a single disciplined accent color used only for links and labels. Monospaced metadata, generous negative space, a steady vertical rhythm. No glowing gradients, no neon on everything, no decoration that isn't doing a job. Distinctive, but quiet. Confident enough to leave things out.

Swap in your own accent color and your own references, and you're most of the way there.

It isn't live yet as I write this. By the time you're reading it, it is. More to come from the lab.

<script>
(function () {
  document.querySelectorAll('.ba').forEach(function (ba) {
    var after = ba.querySelector('.ba-after');
    var divider = ba.querySelector('.ba-divider');
    var handle = ba.querySelector('.ba-handle');
    var range = ba.querySelector('input[type="range"]');
    function set(v) {
      after.style.clipPath = 'inset(0 0 0 ' + v + '%)';
      divider.style.left = v + '%';
      handle.style.left = v + '%';
    }
    range.addEventListener('input', function () { set(range.value); });
    set(range.value);
  });
})();
</script>
