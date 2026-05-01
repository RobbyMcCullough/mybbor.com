---
title: I Built My Own Web Server and Named It After a Galaxy
date: 2026-05-01
author: Robby McCullough
tags: [claude code, ai, web development, infrastructure, self-hosting, caddy, digitalocean]
---

# I Built My Own Web Server and Named It After a Galaxy

I've been hosting my websites on various webhosts for years, and I recently started using Netlify to quickly host some of my vibe coded projects. I love the experience of Netlify and I'm having a blast building and using static HTML again. It's just so fast and agile when combined with an agentic workflow. That said I was making a bunch of tweaks to a site and I quickly hit the cap on Netlify's free tier. 

I thought it would be a fun project to set up a server on DigitalOcean. It's been many, many years, but I used to use Ubuntu as my daily driving operating system, and I hosted my own web server out of my house for a long time. When I started getting into WordPress, my focus shifted more toward WordPress and front-end development, and my days of tinkering with servers came to an end. 

Now with the help of my trusted technical adviser, Claude, I decided to spin up an inexpensive  DigitalOcean server where I could host all of my sites.

$12 a month, [DigitalOcean](https://www.digitalocean.com/), Ubuntu 24.04, a web server called [Caddy](https://caddyserver.com/). And then I spent a few hours with [Claude Code](https://claude.ai/code) turning it into something I'm genuinely proud of.

## The Server

Caddy was the right call. It auto-provisions TLS certificates via [Let's Encrypt](https://letsencrypt.org/), handles HTTP/2 out of the box, and the config syntax is clean enough that I actually understand what it says. Adding a new site looks like this:

```
mysite.com, www.mysite.com {
    root * /var/www/mysite.com
    file_server
}
```

That's the whole thing. Caddy handles the cert. You point DNS at it and walk away.

I named the server Andromeda. I use frogs for my hard drives, and I wanted a different theme for servers — constellations felt right. Andromeda is the first one.

## The Automation

The part I'm most happy about is a script called `add-site.sh`. You give it a domain and a GitHub repo and it does everything: clones the repo onto the server, updates the Caddyfile, sets the GitHub secrets, creates the Actions deploy workflow, and flips the DNS in Cloudflare. One command. A new site is live in about thirty seconds.

## The Moment It Clicked

When I ran `curl -sI https://mybbor.com` and saw `server: Caddy` come back, I did a little fist pump. That's my server. Those are my files. That response came from a $12 machine I configured myself, with a TLS cert that will auto-renew forever.

This kind of setup used to be a multi-day project with a lot of Stack Overflow and a lot of broken configs. Doing it with agentic AI assistance, it was an afternoon and a bike ride.

I've got a few more sites to migrate. Then I want to set up self-hosted analytics. The server's sitting there ready.

---

*[petalumaphotography.com](https://petalumaphotography.com) and [mybbor.com](https://mybbor.com) are both live on Andromeda now. [aprilfifteenth.com](https://aprilfifteenth.com) will be up shortly.*
