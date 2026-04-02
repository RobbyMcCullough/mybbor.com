---
title: Building a Live Ham Radio Situational Awareness Dashboard
date: 2026-04-01
author: Robby McCullough
tags: [ham radio, claude code, ai, web development, petaluma, sonoma county, weather, aprs]
---

# Building a Live Ham Radio Situational Awareness Dashboard

I wanted a single-page "mission control" display for ham radio that I could throw up on a TV or monitor and leave running. No clicking around, no tabs — just auto-refreshing tiles showing radar, satellite imagery, fire cameras, APRS activity, space weather, highway cams, and more. All relevant to my home in Petaluma, CA.

The end result lives at [mybbor.com/ham-dashboard.html](/ham-dashboard.html).

---

## The Starting Point: hamdash

Rather than building from scratch, I started with **hamdash** by VA3HDL — an open-source ham radio dashboard framework. It handles:

- Loading a `config.json` file that defines all tiles
- Rotating through multiple images/iframes per tile on a configurable timer
- A top bar with clock, center title, and nav links
- Basic tile layout via CSS grid

The framework is a single HTML file plus a `config.json`. Everything else — APRS map, CalFire feed, earthquake tracker — are supporting iframe pages that live in a `dashboard/` folder.

---

## Grid Layout

Started with a **4×5 grid (20 tiles)**. Several tiles weren't working or weren't useful enough to keep:

- FT8 propagation (PSKreporter) — unreliable embed
- Tides — broken data source
- Solar conditions — redundant with the HF propagation tile
- Moon phase — moved to a small SVG icon in the header instead

Final layout: **4×4 grid (16 tiles)**. Much tighter, no dead space.

---

## The Tiles

| Tile | Source | Notes |
|------|--------|-------|
| Local Radar | NOAA/NWS KMUX loop GIF | CSS-inverted for dark theme |
| Petaluma Fire Watch | AlertCalifornia cam #1754 | iframe embed |
| HF Propagation | hamqsl.com | Standard solar/propagation banner |
| GOES-18 | NOAA NESDIS CDN | Alternates GEOCOLOR + Sandwich composite |
| Lightning | lightningmaps.org | Animated GIF, West Coast view |
| ISS Position | heavens-above.com | Orbital diagram, 10s refresh |
| APRS North Bay | aprs.fi API + Leaflet | Custom dark map (details below) |
| Radar CONUS | NWS loop GIF | Wide-area radar for context |
| US-101 Cameras | Caltrans CWWP2 | 3-way rotation: SR-116, Kastania, N Petaluma Blvd |
| Clear Dark Sky | cleardarksky.com | Sonoma State Univ Observatory (nearest to Rohnert Park) |
| North Bay Airspace | ADS-B Exchange | Live flight traffic map |
| Earthquakes | USGS + Leaflet | Custom iframe, Western US |
| CalFire Incidents | CalFire feed | Sonoma County incidents |
| SF Bay Marine | OpenSeaMap AIS | SF Bay vessel traffic |
| Aurora / KP Index | NOAA SWPC | Alternates aurora forecast globe + 3-day Kp chart |
| Windy | embed.windy.com | ECMWF surface wind, North Bay |

---

## The APRS Panel

This was the most technically involved piece.

**Goal:** Show live APRS station positions within 80km of Petaluma on a dark-themed map.

**Stack:** Leaflet.js v1.9.4 + OpenStreetMap tiles (CSS-inverted to dark) + aprs.fi API

**CORS problem:** aprs.fi's API doesn't send CORS headers, so `fetch()` from the browser gets blocked. Tried JSONP (dynamic `<script>` tag) — failed with a network error in practice. Settled on routing through **corsproxy.io** as a proxy.

**API quirk discovered the hard way:** The aprs.fi `what=loc` endpoint requires a `name=` parameter. Passing only `lat/lng/dist` for a geographic area query returns:

```
"loc query: no search term specified"
```

Fix: add `name=*` as a wildcard. The full working query:

```
https://api.aprs.fi/api/get?what=loc&name=*&lat=38.2353&lng=-122.6387&dist=80&apikey=KEY&format=json
```

**Station markers:** Color-coded by age — cyan for the last 15 minutes, green for the last hour, amber for the last 4 hours, dim white for older.

**Click to inspect:** Initially used Leaflet's `bindTooltip` (hover-only). Inside an iframe on the dashboard, hover events are unreliable. Switched to `bindPopup` (click to open) with dark-themed popup styling.

---

## Moon Phase in the Header

The original design had a dedicated moon phase tile in the grid. When the grid was tightened to 4×4, the tile was dropped — but the phase is still useful to know for nighttime operations.

Solution: a small SVG moon icon in the top bar, with a hover tooltip showing phase name and illumination percentage.

**The math:** Synodic month = 29.530588853 days. Days elapsed since a known new moon (Jan 6, 2000) modulo the synodic period gives a 0–1 phase fraction.

**SVG rendering:** The moon shape is drawn with two arcs — one for the limb and one for the terminator. The tricky part is getting the SVG arc sweep flags right for all four cases (waxing/waning, crescent/gibbous). Using `fill-rule="evenodd"` is essential — without it, certain arc combinations cancel each other out and the full moon renders completely dark.

---

## Drag-and-Drop Layout

hamdash supports reordering tiles by drag-and-drop, with order persisted in `localStorage`.

**Bug 1: Image tiles couldn't be dragged.** The framework showed a transparent ClickOverlay div only for iframe tiles (to block iframe pointer capture). For plain image tiles, the overlay was hidden — so the browser's native image-drag behavior intercepted the mousedown. Fix: always show the ClickOverlay regardless of tile type.

**Bug 2: Drag highlight flickers.** Moving the cursor across child elements inside a tile fires `dragleave` on the tile itself. Fix:

```javascript
tile.addEventListener('dragleave', e => {
  if (!tile.contains(e.relatedTarget)) tile.classList.remove('tile-drag-over');
});
```

**Cross-machine persistence:** localStorage is per-browser, so a preferred layout on one machine doesn't carry over to the TV. Added a `defaultOrder` object to `config.json` as a fallback. A "📌 Layout" button in the header copies the current order as JSON to the clipboard — paste it into `config.json` to set a new default.

---

## TV Compatibility: The WebGL Problem

The flight tile originally used `globe.adsbexchange.com`, which renders a 3D globe via Cesium — requires WebGL. LG TV browsers (WebOS, Chromium-based) ship without WebGL, so the tile spins indefinitely with no error message.

I tried switching to Flightradar24's 2D map, only to discover they block iframe embedding with `X-Frame-Options: SAMEORIGIN`. Same story for Radarbox, Planefinder, and most other major providers. Ended up back on adsbexchange — it at least works on desktop and most browsers; the TV is a known limitation.

General lesson: for TV dashboards, avoid WebGL-dependent embeds and verify iframe headers before committing to a data source.

---

## Visual Theme

Consistent dark cyberpunk aesthetic across the whole dashboard:

- Background: `#0a0a0f`
- Primary accent: cyan `#00f0ff`
- Secondary: green `#00ff88`
- Tertiary: magenta `#ff00ff`
- Amber `#ffb800` for callsigns (phosphor CRT feel)
- Font: Victor Mono throughout

For image tiles like the NWS radar GIFs — which have white backgrounds — CSS `filter: invert(1) hue-rotate(200deg) brightness(0.75)` converts them into something that fits the dark theme without any server-side processing.

---

## Lessons Learned

1. **Check CORS early.** Several data sources block direct browser fetches. Know before you build whether you'll need a proxy.

2. **Read API docs carefully.** The aprs.fi area-query bug wasted significant debugging time — the error message gave no hint that `name=*` was the fix.

3. **Test on the actual display device.** The WebGL issue only appeared on the TV. A tile that works in Chrome on a laptop may fail silently on a TV browser.

4. **SVG arc directions are subtle.** The fill-rule + sweep-flag combination for moon phases is not intuitive. Draw it out on paper first.

5. **Verify iframe embedding before committing.** `X-Frame-Options: SAMEORIGIN` will silently blank a tile. A quick `curl -sI <url> | grep -i x-frame` before you build saves a lot of backtracking.

6. **localStorage doesn't travel.** If something is meant to run on multiple devices, plan for cross-device state from the start.

---

## What's Next

- APRS with the `name=*` wildcard may hit rate limits over time — worth monitoring
- A NOAA marine forecast tile for the Bay would round out the weather picture
- The CalFire and earthquake iframes could be more tightly styled to match the dashboard theme
- Still hunting for a flight tracking source that (a) allows iframe embedding and (b) doesn't need WebGL

---

*Dashboard live at [mybbor.com/ham-dashboard.html](/ham-dashboard.html) — KN6KVS, Petaluma CA*
