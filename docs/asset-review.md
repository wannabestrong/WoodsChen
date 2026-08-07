# OPEN Asset Review

> Phase: Step Four / image review complete. All twelve planned image assets are ready as generated stand-ins. Website implementation remains blocked until playable audio provenance and the Step Four confirmation are resolved.

## Accepted Stand-ins

| Asset | Final path | Dimensions | SHA-256 | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| Anonymous avatar | `assets/avatar/avatar-replace-later.png` | 1254 x 1254 | `892f986c9d8431e05487bea22683ba585c92dabe2847356eeebd1a7eb99018ce` | weak but usable | Subject, mood and circular crop match. White circular surround is baked into the image; use only inside a CSS circular crop. Must be replaced by a real user portrait before final publication. |
| Rain city cover | `assets/archive/rain-city-cover.png` | 1672 x 941 | `e58a8b97e604019c8ddc5ecea69254a3a684c3792e0776e1f6f9c437f0621dfb` | accepted | 16:9 composition, centered road perspective, clean code/media separation and restrained palette pass. |
| Loneliness cover | `assets/archive/loneliness-cover.png` | 1448 x 1086 | `e75c10af06d6ab99efc5ff1d5aa4a1ec9412fdb59aedc1f76e44e873d25a4334` | accepted | 4:3 wet-leaf macro, safe crop, negative space and dark grade pass. |
| Mountain lake cover | `assets/archive/mountain-lake-cover.png` | 1672 x 941 | `589f2859383110aba2fd454e9002f508597a8a174ab9df0b28ca757fbf96eb1a` | accepted | 16:9 ridge/lake hierarchy, complete subject and reference consistency pass. Reused by Archive and Photo Story. |
| Future self cover | `assets/archive/future-self-cover.png` | 1448 x 1086 | `0201803ff532df32dc24c3f9ad0f019d7e91e87ed39a9a6a6ddedde8b045dfa2` | accepted | 4:3 quiet interior; complete book, restrained plant, overcast window light and negative wall space pass. First attempt was rejected for a cropped book. |
| Dusk tram cover | `assets/archive/dusk-tram-cover.png` | 1448 x 1086 | `9c5a005a83c421ef869ec107aa29b5f8b11c4c30af6b61377e637acc3c52669a` | accepted | 4:3 complete tram silhouette, rail perspective, wet reflections and blue-hour grade pass. |
| Unfinished thoughts cover | `assets/archive/unfinished-thoughts-cover.png` | 1448 x 1086 | `4cb5e5d1fb802d5b499ffb8a775c8ee001b1912e3c3a09047b16e469cd62aadc` | accepted | 4:3 notebook and pen remain complete; marks are abstract and unreadable. Initial plan-external books and stone were removed in a targeted revision. |
| Seaside evening cover | `assets/archive/seaside-evening-cover.png` | 1448 x 1086 | `144222ef1f36aa6079d7989f7420a269e7f2e55300a1396e1ca381a506108eaa` | accepted | 4:3 calm water foreground, distant low ridge and restrained dusk palette pass. |
| Window light cover | `assets/archive/window-light-cover.png` | 1672 x 941 | `b88f5cf6273d0fb99efd4c75e0d3410d297f692fa4848d7310f3774626ad3e4a` | accepted | 16:9 wall plate, complete plant shadow and clear left-side live-text safety zone pass. |
| Mountain range gallery | `assets/archive/mountain-range-gallery.png` | 1536 x 1024 | `bc7c6323cf32e341aca7b288d433fb4ee213a08f2a3d0278cf0ea7023c5638de` | accepted | 3:2 ridge, complete peak line, stable shore and cold-water foreground pass. |
| Forest path gallery | `assets/archive/forest-path-gallery.png` | 1024 x 1536 | `7832e885db85384d539f4db855d07308d5fec7eb732add2af178f5ce06b1297b` | accepted | 2:3 centered wet path, vertical trunk rhythm, mist depth and safe portrait composition pass. |
| Music cover | `assets/music/music-cover.png` | 1254 x 1254 | `2e95c6e4bd44583e59dea4e3696e40340a5077e84a137fbe7e38d551fb03965b` | accepted | 1:1 dark sea, lower-right lighthouse focus, strong thumbnail silhouette and text-free negative space pass. |

## Remaining

- Music audio remains unresolved and requires a user-owned/licensed MP3 or verified legal HTTPS source.
- All generated images remain demo stand-ins and cannot be attributed to the user as real work.
- The anonymous avatar remains a specifically named weak `replace-later` asset because of its baked white circular surround.

## Generator

- Final eight images were generated with the current-window built-in `imagegen` path.
- Reproducible prompts remain in `scripts/asset-jobs.json` and `docs/asset-generation-prompts.md`.
- The optional third-party script remains at `scripts/generate_assets.py`; no key is stored in the repository.
