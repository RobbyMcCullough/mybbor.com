# Petaluma Sonoma County — Changelog
Memory channel data for Petaluma and Sonoma County, CA. CHIRP-compatible format.

Two variants, identical except for the AM airband block (ch 128-142):
- `Petaluma Sonoma County - All Channels.csv` — 155 channels, includes airband
- `Petaluma Sonoma County - No AM.csv` — 140 channels, for radios that can't receive AM (e.g. Baofeng UV-5R)

---

## 2026-07-15 — Fixed the broken download
- Both CSVs are now committed to the repo as real files. Previously `data/Petaluma Sonoma County.csv` was a symlink to a Dropbox path outside the repo, so it never deployed; the download link silently served the homepage HTML instead of a CSV.

## 2026-04-19 — Split into All Channels / No AM; added airband
- Added 15 AM airband channels (ch 128-142): PTMA CTAF/AWOS, DVO CTAF/AWOS, STS TWR/GND/ATIS, OAK CTR, APC TWR/GND/ATIS/CLR, AIR GUARD, UNICOM, VCV AWOS
- Added public safety and fire channels (ch 144-155) and SCRA/SMRS (ch 156-158)
- Split into two files, since the UV-5R can't receive AM and those channels are dead weight on it

## 2026-03-31 — Added N6ICW travel repeater
- Ch 5: N6ICW 147.195 MHz (+0.600 / 123.0 Hz PL) — Sacramento Valley multi-site system, Mt. Vaca transmitter reachable from Petaluma

## 2026-03-22 — Initial release
- 128 channels covering:
  - General / NOAA weather (ch 0-4)
  - Local ham repeaters + travel (ch 5-49)
  - ISS / APRS (ch 50-59)
  - Emergency / interoperability (ch 60-79)
  - MURS / FRS / GMRS / Marine VHF (ch 80-127)
- Tested with Baofeng UV-5R via CHIRP
