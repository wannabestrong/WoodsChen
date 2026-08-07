# OPEN Restoration Plan

> Status: Step Five. The complete `v2` reference group is locked, all planned image stand-ins are reviewed, and the user approved a disabled `replace-later` audio state before implementation.

## Global Build Boundary

- Code owns all navigation, text, metadata, labels, statistics, calendar, audio controls, focus states and interaction.
- Assets own avatar, archive covers, gallery photographs and music cover.
- No final website text or control may be baked into raster assets.
- User/official images are preferred. Approved stand-ins must be marked `replace-later`.
- Shared topology is limited to the top navigation, tokens, buttons, labels and small primitives. Page bodies remain section-specific.

## Archive Home

- Reference: `references/locked/v2/01-archive-home.png`
- Status: reference-locked
- Archetype: `C2 independent-media`
- Three-second message: OPEN is a maintained archive of writing and photography.
- Personal evidence: archive items, dates, locations, avatar and recent activity; current examples are placeholders.
- Authored move: stable identity rail and life-information rail frame an asymmetric editorial archive grid.
- Primary focal point: first Archive card group.
- Secondary anchors: Identity portrait/statement; Recent timeline.
- Reading path: top navigation -> Archive heading/cards -> Identity/Recent context.
- Whitespace map: column gutters separate responsibilities; card gutters preserve scanability; no large empty field.
- Semantic graphic: Recent vertical line encodes chronological updates; calendar encodes actual dates.
- Overlap ledger: none between independent media; labels may overlay only their own cover in a safe corner.
- Exclusion zones: avatar face/body crop, every cover subject-safe box, music cover, calendar cells.
- Viewport payload: desktop shows all three columns and first Archive row; mobile shows compact identity, Archive heading and first complete card before Others.
- Code layer: all chrome, panels, grid, text, tags, calendar, statistics and Music controls.
- Independent media: avatar, Archive covers, Music cover.
- Responsive mode: three columns -> single ordered flow; cards reflow without pixel-level image rearrangement.
- Forbidden fusion: no cross-card shadows, no baked titles/metadata, no identity image fused into panel background.
- Topology: section-specific.

## Essay Detail

- Reference: `references/locked/v2/02-essay-detail.png`
- Status: reference-locked
- Archetype: `C2 independent-media`
- Three-second message: this is a focused essay inside the OPEN archive.
- Personal evidence: real title, date, tags, prose and optional sourced photograph.
- Authored move: serif reading rhythm with a single photographic pause and quiet archive navigation.
- Primary focal point: essay title and opening passage.
- Secondary anchors: metadata; editorial photograph.
- Reading path: back/archive -> title -> metadata -> prose -> image/caption -> adjacent archive item.
- Whitespace map: side margins protect reading line length; image pause separates text movements.
- Semantic graphic: none.
- Overlap ledger: none.
- Exclusion zones: photograph and caption remain complete; no floating controls over prose.
- Viewport payload: title, metadata and first paragraph visible on desktop/mobile without clipping.
- Code layer: all text, Markdown layout, metadata and navigation.
- Independent media: zero to two article images.
- Responsive mode: centered reading column with fluid margins and independent full-width media.
- Forbidden fusion: no text baked into images; no comments/likes unless later approved.
- Topology: section-specific.

## Photo Story Detail

- Reference: `references/locked/v2/03-photo-story.png`
- Status: reference-locked
- Archetype: `C2 independent-media`
- Three-second message: this is one coherent photographic story, not a generic gallery.
- Personal evidence: sourced cover and sequence, date, location and creation note.
- Authored move: a dominant complete cover followed by a paced landscape/portrait sequence.
- Primary focal point: cover photograph.
- Secondary anchors: title/metadata; first sequence pair.
- Reading path: title -> cover -> image sequence -> creation note -> archive return.
- Whitespace map: dark margins act as photo-book pacing between complete images.
- Semantic graphic: none.
- Overlap ledger: none; distinct photographs never cover one another.
- Exclusion zones: every photograph subject-safe box and caption.
- Viewport payload: title metadata and complete cover relationship is clear; mobile never crops away the reason for an image.
- Code layer: title, metadata, captions, sequencing and optional lightbox controls.
- Independent media: cover plus gallery images.
- Responsive mode: editorial grid -> ordered single-column photo sequence.
- Forbidden fusion: no masonry collision, cross-image shadow, baked caption or fake camera metadata.
- Topology: section-specific.

## About

- Reference: `references/locked/v2/04-about.png`
- Status: reference-locked
- Archetype: `C2 independent-media`
- Three-second message: OPEN belongs to a person who records life through words and photographs.
- Personal evidence: user portrait, approved biography, archive history and real social links.
- Authored move: portrait, statement and archive categories form one book-frontispiece composition.
- Primary focal point: portrait plus OPEN statement.
- Secondary anchors: biography; social/contact links.
- Reading path: identity -> statement -> biography -> archive categories -> contact.
- Whitespace map: identity pause around portrait; transition space separates biography from links.
- Semantic graphic: a timeline is allowed only when dates/categories encode real archive history.
- Overlap ledger: none.
- Exclusion zones: portrait, statement and all contact labels.
- Viewport payload: portrait, OPEN and approved statement remain visible without collision on all viewports.
- Code layer: all copy, categories, timeline and links.
- Independent media: one sourced or `replace-later` portrait.
- Responsive mode: composed desktop layout -> portrait-first single column.
- Forbidden fusion: no invented biography, metrics, credentials or decorative identity collage.
- Topology: section-specific.

## Asset Manifest Draft

| Asset | Role | Placement | Provenance | Aspect | Responsive mode | Status | Final path |
| --- | --- | --- | --- | --- | --- | --- | --- |
| avatar | identity portrait | independent-media | approved stand-in | 1:1 | fixed safe crop | replace-later | `assets/avatar/avatar-replace-later.png` |
| archive covers | item evidence | independent-media | approved stand-ins | 16:9 / 4:3 | object-fit with item safe box | replace-later | `assets/archive/*.png` per manifest |
| gallery images | photo-story evidence | independent-media | approved stand-ins | 3:2 / 2:3 | contain/controlled crop | replace-later | `assets/archive/mountain-range-gallery.png`, `assets/archive/forest-path-gallery.png` |
| article images | essay evidence | independent-media | shared approved stand-in | 16:9 | full reading-column width | replace-later | `assets/archive/rain-city-cover.png` |
| music cover | music metadata | independent-media | approved stand-in | 1:1 | fixed square | replace-later | `assets/music/music-cover.png` |
| audio source | playable audio | independent media file | user-owned/licensed URL or file | n/a | disabled demo state until a legal source exists | replace-later | none; no silent placeholder file |

## Replication Execution Brief

- Build owner: `identity-skill/references/frontend-app-builder.md` fallback.
- Baselines and order: `01-archive-home.png`, `02-essay-detail.png`, `03-photo-story.png`, `04-about.png`; each is a separate route/view and topology.
- Chrome: 56px dark header, OPEN wordmark, centered Archive/Notes/Photos/About navigation, compact search/settings controls; mobile uses a horizontal nav row without preserving the desktop three-column shell.
- Typography: restrained sans for chrome and metadata, editorial serif for essay display/body; labels stay compact with normal letter spacing.
- Palette: near-black canvas, charcoal panels, cool gray text, restrained blue active state and muted amber essay label; implementation uses global design tokens only.
- Interaction: Archive filters and search are live; article/photo cards open their detail views; the existing hover/focus wheel-page control remains progressive enhancement; reduced-motion is honored.
- Media boundary: all copy, controls, metadata, calendar and statistics are code-native. Reviewed files under `assets/` remain independently replaceable raster media.
- Music: cover is ready; audio is an approved `replace-later` dependency. Play controls remain disabled and explicitly unavailable until a legal source is configured.
- Allowed deviations: generated stand-ins instead of user-authored work, weak avatar circular surround hidden by CSS crop, mobile stacking, and disabled Music playback.
- QA: compare each rendered view to its matching `references/locked/v2` image at desktop, ultrawide and 390 x 844 mobile; record all evidence before completion.
