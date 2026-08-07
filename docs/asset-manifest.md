# OPEN Asset Manifest

> Status: Step Four / image assets reviewed. No reference image may be cropped or reused as a build asset.

Step Three was accepted. All twelve planned image assets are now reviewed stand-ins. Music audio provenance remains unresolved; see `docs/asset-review.md`.

## Global Shared Assets

| ID | Layer | Reuse | Status | Content and boundary | Code coverage | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| `identity-avatar` | independent-media | global | replace-later | One 1:1 anonymous low-saturation portrait stand-in used by Home and About; subject-safe circular crop | Circle frame, border and all labels remain code | Identity/source boundary requires independent replacement; generated person cannot be final |
| `music-cover` | independent-media | global | replace-later | One 1:1 non-factual atmospheric cover with no text/logo | Player shell, title, artist, progress and controls remain code | Accepted at `assets/music/music-cover.png`; generated result remains replace-later |
| `music-audio` | independent media file | global | replace-later | No audio file in the demo; future user-owned/licensed MP3 under `assets/audio/` or legal HTTPS URL | `<audio>` state and controls remain code; play is disabled with an accessible unavailable state | User explicitly approved an audio placeholder; no silent or falsely attributed track is created |

No global raster texture is required. Grain, surfaces, shadows, borders and dark chrome are code-native.

## Page 1 - Archive Home

Interaction assumption: filters, cards, links, calendar and audio controls are live; every cover can be replaced independently; mobile reflows into one column.

Total: 10 unique image assets visible through this page: one shared avatar, eight independent Archive covers and one shared Music cover. No background or integrated scene.

| ID | Layer | Reuse | Status | Content and boundary | Code coverage | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| `cover-rain-city` | independent-media | section/shared with Essay | replace-later | 16:9 rainy city at night; no readable signs or text | Card tag, title, location, date | Generated stand-in accepted at `assets/archive/rain-city-cover.png` |
| `cover-loneliness` | independent-media | section | replace-later | 4:3 dark wet leaves; no text | Card tag, title, date | Generated stand-in accepted at `assets/archive/loneliness-cover.png` |
| `cover-mountain-lake` | independent-media | section/shared with Photo | replace-later | 16:9 misty mountain lake; no people or text | Card tag, title, location, date | Generated stand-in accepted at `assets/archive/mountain-lake-cover.png` |
| `cover-future-self` | independent-media | section | replace-later | 4:3 quiet window, book and plant; no text | Card tag, title, date | Accepted at `assets/archive/future-self-cover.png` |
| `cover-dusk-tram` | independent-media | section | replace-later | 4:3 evening tram street; no text/logo | Card tag, title, location, date | Accepted at `assets/archive/dusk-tram-cover.png` |
| `cover-unfinished-thoughts` | independent-media | section | replace-later | 4:3 notebook detail with abstract unreadable marks | Card tag, title, date | Accepted at `assets/archive/unfinished-thoughts-cover.png`; generated marks cannot carry prose |
| `cover-seaside-evening` | independent-media | section | replace-later | 4:3 quiet coast at dusk; no text | Card tag, title, location, date | Accepted at `assets/archive/seaside-evening-cover.png` |
| `cover-window-light` | independent-media | section | replace-later | 16:9 shadow and plant by a window; no text | Card tag, title, location, date | Accepted at `assets/archive/window-light-cover.png` |

Code-native:

- top navigation, search/settings buttons and active states
- Identity panel, all copy, internal navigation, social icons and footer
- Archive heading/count, filters, Bento grid, card shells, labels and metadata
- Recent timeline, statistics, calendar and Music player controls
- all responsive layout, focus, hover and reduced-motion behavior

Authenticity / replace-later:

- All eight generated covers are demo stand-ins and cannot be described as the user's real work.
- `identity-avatar` must eventually be replaced by a user-provided portrait.
- `music-audio` needs a verified source before playback can be marked ready.

## Page 2 - Essay Detail

Interaction assumption: article content is live Markdown/data; the editorial photograph is independently replaceable; previous/next navigation is live.

Total: one image asset, reusing `cover-rain-city`. No new raster asset.

| ID | Layer | Reuse | Status | Content and boundary | Code coverage | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| `cover-rain-city` | independent-media | shared from Archive | replace-later | Same accepted 16:9 city stand-in used by its Archive item | Title, metadata, article body, caption and adjacent navigation | Reuse `assets/archive/rain-city-cover.png`; reference screenshot is not the asset |

Code-native:

- entire reading shell, serif title, metadata and Markdown typography
- neutral placeholder paragraphs until real article content exists
- caption, back link and previous/archive/next navigation

Authenticity / replace-later:

- Placeholder bars in the reference define typography density only; implementation content must come from Supabase/static fallback.
- The generated city image remains a demo stand-in.

## Page 3 - Photo Story

Interaction assumption: cover and sequence images are independent gallery items; mobile displays them in source order; optional lightbox never changes source ownership.

Total: three image assets: one reused cover plus two additional gallery stand-ins. No integrated scene.

| ID | Layer | Reuse | Status | Content and boundary | Code coverage | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| `cover-mountain-lake` | independent-media | shared from Archive | replace-later | Accepted 16:9 misty lake stand-in | Title, location, date and labels | Reuse `assets/archive/mountain-lake-cover.png` |
| `gallery-mountain-range` | independent-media | section | replace-later | 3:2 mountain range with complete skyline | Gallery frame and optional caption | Accepted at `assets/archive/mountain-range-gallery.png`; independent semantic photograph and mobile reflow |
| `gallery-forest-path` | independent-media | section | replace-later | 2:3 forest path with complete central path | Gallery frame and optional caption | Accepted at `assets/archive/forest-path-gallery.png`; independent semantic photograph and portrait crop |

Code-native:

- title, location/date, section labels, dividers and creation-note text
- sequence grid, mobile ordering, optional lightbox controls and focus handling

Authenticity / replace-later:

- All three photographs are stand-ins and must not be presented as the user's real photography.
- Real gallery images can change aspect ratios and may invalidate this reference; replacements should preserve the recorded 16:9, 3:2 and 2:3 slots or return to Step Two.

## Page 4 - About

Interaction assumption: portrait is independently replaceable; social rows and Archive Index are live links/structure; mobile reorders portrait, statement, links and index.

Total: one shared avatar. No other image asset.

| ID | Layer | Reuse | Status | Content and boundary | Code coverage | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| `identity-avatar` | independent-media | global | replace-later | Same sourced portrait as Home, 1:1 safe crop | OPEN title, approved statement, biography, links and Archive Index | Identity must remain a separately replaceable source |

Code-native:

- panel geometry, portrait frame, all placeholder lines and biography content
- GitHub, Email, Instagram and RSS icons/links
- Archive Index icons, categories and approved statement

Authenticity / replace-later:

- No years, credentials, locations or biography claims are implied.
- Final portrait and biography require user sources.

## Stable Output Paths

```text
assets/
  avatar/avatar-replace-later.png
  archive/rain-city-cover.png
  archive/loneliness-cover.png
  archive/mountain-lake-cover.png
  archive/future-self-cover.png
  archive/dusk-tram-cover.png
  archive/unfinished-thoughts-cover.png
  archive/seaside-evening-cover.png
  archive/window-light-cover.png
  archive/mountain-range-gallery.png
  archive/forest-path-gallery.png
  music/music-cover.png
  audio/<user-owned-or-licensed-track>.mp3
```

## Summary

- Unique image assets: 12 total (1 avatar, 10 Archive/gallery images, 1 Music cover).
- Generated stand-ins requested after confirmation: 12 images (anonymous avatar, 10 Archive/gallery images and Music cover).
- User/verified sources: final avatar and playable audio; both may use approved replace-later behavior during the demo stage.
- Redesign-required: none at this stage.
