# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Rezzrizz25/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Rezzrizz25/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An unofficial, fan-made guide and tracker for all 55 Grand Theft Auto VI PS5 trophies — 1 platinum, 2 gold, 6 silver, 46 bronze — with a checklist, step-by-step guides in our own words, a 3-stage roadmap to platinum, and a missables view. Difficulty 4/10, about 200 hours to platinum. It works fully offline from its own files: no network requests, no external fonts, scripts or images.

## Run it

```sh
node serve.ts
```

Open http://localhost:8080 after starting the server. Or open `app/index.html` directly in a browser (the data file is fetched with a relative path, so it works from `file://` in most browsers; the server route is the reliable one). Requires Node 22+ for the server; the app itself needs nothing.

---

<sub>Entered on [make.fun](https://make.fun/?ref=v4m1pbv2&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>

## What it is

- **Checklist** — all 55 trophies with name, description, grade, kind, PSN target count and stage. Click a trophy to check it off; click it again (or the row) to read its full guide.
- **Guides in our own words** — every trophy has a real guide: what to do, where, how, and when it can be missed. Each guide cites its sources beside it. Nothing is copied from other guides.
- **Roadmap** — 3 stages to the platinum (Story 60–80h → 100% checklist ~100h → Strangers &amp; cleanup 10–20h), with the missable warning up front and time-saving tips.
- **Missables** — only one trophy is potentially missable: **Positive Mental Attitude**. The view gives the exact Chapter 1 balcony instructions and states plainly that everything else is safe in free-roam after the story.
- **Spoiler setting** — on by default, it hides the name and description of story/hidden trophies until you earn them.
- **Filters &amp; search** — by grade, kind (story / collectibles / activities / side / misc), status, missable-only, hide-earned, and free-text search across names, descriptions and guides.
- **Progress** — saved in your browser (localStorage). **Export** downloads your progress as JSON; **Import** loads a progress file back in.

## URL parameters

- `?view=checklist|roadmap|missables|sources` — open a view directly.
- `?trophy=<id>` — open that trophy's detail (e.g. `?trophy=28`).
- `?seed=13` — demo mode: seeds 13 earned trophies **in memory only** for screenshots and demos. It never writes to localStorage and never corrupts real saved progress.

## The trophy list

The official trophy list was **not** published by Rockstar or Sony. Names, descriptions and grades are as [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi) list them; the two lists agree on all 55. 28 of the 55 are hidden on PSN.

Five hidden trophies were still unsolved by guide sites as of Nov 20, 2026 — “In The Beginning…”, “Capital Offense”, “Bad Luck, I Guess”, “The Truth Is Out There” and “Ten Pin”. Their guides say so plainly and invent no method.

## Data sources

- [PowerPyx — GTA 6 Trophy Guide &amp; Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vI-trophy-guide-roadmap/)
- [Push Square — GTA 6 Trophy Guide and Roadmap](https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap)
- [Insider Gaming — Complete GTA 6 Trophy List](https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/)
- [KeenGamer — GTA 6 Trophy Guide, Platinum Roadmap, All 55 Trophies](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/)
- [GameMapa — GTA 6 Trophy / Achievement List](https://gamemapa.com/en/gta-6/guides/gta-6-trophy-achievement-list/)
- [Sixshore — GTA 6 Trophies and Achievements](https://sixshore.com/gta-6/guides/trophies-and-achievements/)
- [Exophase — Grand Theft Auto VI trophies](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) (list cross-check)
- [PSNProfiles — Grand Theft Auto VI trophies](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi) (list cross-check)

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Rezzrizz25. Grand Theft Auto and GTA are trademarks of Rockstar Games; this is an unofficial fan-made guide with no affiliation.
