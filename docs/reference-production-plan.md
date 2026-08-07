# OPEN Reference Production Plan

## Status

- Phase: Step Two / Reference lock
- Anchor: `references/locked/v1/01-archive-home.png`
- Anchor status: accepted by user, locally locked, visual audit passed with named limitations
- Remaining references: pending generation and four-way review
- Build status: blocked until Step Three and Step Four are accepted

## Style Fingerprint

### Identity and tone

- Product: OPEN, a personal archive of essays and photography
- Three-second impression: a quiet, maintained literary and photographic archive, not a portfolio or SaaS dashboard
- Wordmark: uppercase `OPEN`, plain text, no generated logo
- Visual world: dark editorial archive, late-night reading room, restrained photography magazine

### Color roles

- Canvas: `#080B10`
- Primary surface: `#0D1218`
- Raised surface: `#111821`
- Primary text: `#F1F5F9`
- Secondary text: `#94A3B8`
- Muted text: `#66717F`
- Active blue: `#5C9FE8`
- Photo label blue: `#6FA8E8`
- Essay label amber: `#C79A51`
- Border: `rgba(255,255,255,0.08)`

### Type and chrome

- Display: restrained Chinese serif for article and page titles
- Body/UI: neutral sans-serif with clear Chinese glyphs
- Label/nav: compact sans-serif, medium weight
- Top navigation: approximately 56px, wordmark left, centered primary routes, tools right
- Active state: dark capsule plus a thin blue underline; no glow
- Geometry: 6-8px card radius, 1px low-contrast border, soft local shadow only
- Icons: consistent code-native outline icons; no emoji

### Image and material language

- Low-saturation editorial photography, dark neutral grade, controlled highlights
- Archive cover images remain independent media with no baked-in titles, dates, tags, controls or borders
- A faint grain may be shared globally as one code-native/shared material; no per-section texture invention
- No gradients used as the primary visual idea, no decorative orbs, no fake dashboards, no floating filler cards

### Density and variation

- Archive home: rich, asymmetric masonry/Bento rhythm
- Article detail: calm, text-led, one strong cover or inline image sequence
- Photo detail: rich, image-led photographic sequence
- About: calm, identity-led editorial composition
- Global chrome, palette, radii, label language and image grade do not drift

## Anchor Audit

Reference: `references/locked/v1/01-archive-home.png` (`1414 x 1108`)

- Visual meaning: pass. Archive, essays and photography are legible within three seconds.
- Hierarchy: pass. Archive grid is primary; Identity and Others are secondary anchors.
- Personal specificity: conditional pass. OPEN identity and archive structure are specific, but avatar and all sample works are `replace-later` until real sources exist.
- Composition: pass. Stable three-column shell, controlled card density and complete right rail.
- Rebuildability: pass. Text, controls, calendar and metadata can remain code-native; covers and avatar remain independent media.
- Responsive evidence: not verified. The supplied image is desktop only; mobile behavior is defined in contracts and must be verified in the build.
- Named limitation: the reference contains placeholder Chinese titles and generated-looking photography. They define layout and visual weight, not factual user content.

## Reference Prompts

Use Image 1 (`01-archive-home.png`) as a style and layout-system reference, not an edit target. Generate one image per prompt. Output landscape website screenshots, never a full-page collage or presentation board.

### 02 Article Detail

```text
Use case: ui-mockup
Asset type: desktop website section reference for an essay detail page
Input images: Image 1 is the accepted OPEN archive-home style reference; use it only for palette, typography roles, chrome, border/radius language, image grade and spacing discipline
Primary request: create a shippable dark editorial essay-reading page for OPEN, a personal archive of words and photographs
Scene/backdrop: near-black #080B10 canvas with #0D1218 reading surfaces, subtle low-contrast borders, no decorative scene
Subject: the top navigation from Image 1; a narrow archive/back link; one restrained metadata line; one large Chinese serif essay title; a comfortable centered reading column; one independent low-saturation editorial photograph with a short caption; a quiet next/previous archive footer
Style/medium: realistic polished website UI screenshot, not concept art, not a poster
Composition/framing: 16:10 landscape desktop viewport; calm text-led composition; title and opening paragraph fully visible; reading path flows title -> metadata -> opening text -> photograph; generous but functional margins
Lighting/mood: quiet late-night reading room, matte surfaces, controlled contrast
Color palette: #080B10, #0D1218, #111821, #F1F5F9, #94A3B8, active blue #5C9FE8, tiny essay amber #C79A51
Text (verbatim): "OPEN", "Archive", "Notes", "Photos", "About", "ESSAY", "返回归档", "文章标题", "2026.08.01"
Constraints: all body copy beyond the exact labels should appear as clean readable-layout placeholder lines; one primary focal point; no comments, likes, login, KPI, fake logo or extra route; image is an independent rectangular slot and does not overlap text; no baked-in final article content is required
Avoid: bright blue gradients, glowing UI, floating cards, duplicated side copy, illegible microtext, large unused fullscreen emptiness, watermark
```

### 03 Photo Story Detail

```text
Use case: ui-mockup
Asset type: desktop website section reference for a photography story detail page
Input images: Image 1 is the accepted OPEN archive-home style reference; use it only for palette, typography roles, chrome, border/radius language, image grade and spacing discipline
Primary request: create a shippable dark editorial photo-story page for OPEN that feels like a restrained digital photo book
Scene/backdrop: near-black #080B10 canvas with minimal #0D1218 surfaces and low-contrast dividers
Subject: the same top navigation; a compact back-to-archive control; photo story title, location and date; one dominant 16:9 independent cover photograph; below it a deliberate sequence preview with one landscape and one portrait independent photograph; a short creation-note block
Style/medium: realistic polished website UI screenshot, editorial photography presentation, not concept art
Composition/framing: 16:10 landscape desktop viewport; image-led composition; complete dominant cover is the first focal point, title is second, sequence preview is third; no semantic images overlap
Lighting/mood: quiet cinematic photography book, low saturation, controlled highlights and true black breathing room
Color palette: #080B10, #0D1218, #111821, #F1F5F9, #94A3B8, active/photo blue #5C9FE8
Text (verbatim): "OPEN", "Archive", "Notes", "Photos", "About", "PHOTO", "返回归档", "摄影集标题", "地点 · 2026.08.06", "创作说明"
Constraints: all photographs are independent replaceable media slots with clean rectangular boundaries; show safe complete crops; no text, icon, border or shadow baked into photographs; one dominant story only; no carousel clipping without an explicit next-image affordance
Avoid: overlapping photographs, masonry wall with equal-weight images, fake camera settings, decorative map lines, glowing controls, watermark
```

### 04 About

```text
Use case: ui-mockup
Asset type: desktop website section reference for an About page
Input images: Image 1 is the accepted OPEN archive-home style reference; use it only for palette, typography roles, chrome, border/radius language, image grade and spacing discipline
Primary request: create a shippable quiet About page for OPEN, presenting the person behind a long-running literary and photographic archive
Scene/backdrop: near-black #080B10 canvas, one matte #0D1218 editorial field, subtle border structure
Subject: the same top navigation; a large OPEN wordmark/title; one independent circular or softly cropped low-saturation portrait marked as replace-later; the line "记录文字，保存瞬间。"; a short 3-5 line biography area; four code-native social/contact links; a small archive timeline showing writing and photography as two honest categories
Style/medium: realistic polished website UI screenshot, dark editorial personal archive, not a landing-page hero
Composition/framing: 16:10 landscape desktop viewport; restrained asymmetry; portrait and statement form one composition rather than split cards; reading path portrait/OPEN -> statement -> biography -> links; meaningful pause space around identity
Lighting/mood: intimate, private, calm, low saturation
Color palette: #080B10, #0D1218, #111821, #F1F5F9, #94A3B8, active blue #5C9FE8, tiny essay amber #C79A51
Text (verbatim): "OPEN", "Archive", "Notes", "Photos", "About", "记录文字，保存瞬间。", "Writing", "Photography", "GitHub", "Email", "Instagram", "RSS"
Constraints: portrait remains an independent replace-later media slot; biography uses clean placeholder lines except for the approved statement; no invented credentials, client logos, metrics, awards, quotes or location; no CTA marketing card
Avoid: corporate founder page, giant hero slogan, decorative timeline with meaningless nodes, duplicated biography blocks, floating social cards, watermark
```

## Generation and Review Procedure

1. Generate each reference separately in GPT web Image 2 using the homepage anchor as Image 1. Paste only one named prompt at a time; do not upload this entire production plan as a single generation request.
2. Save candidates outside `references/locked/`; do not overwrite `v1`.
3. Review each candidate for visual meaning, fingerprint consistency, variation rhythm and rebuildability.
4. Reject baked-in content, semantic overlap, invented claims, extra routes and geometry drift.
5. After user acceptance, copy the full accepted group into a new immutable version directory and update SHA-256 values in `docs/identity-evidence.json`.

### Targeted retry for Essay Detail Candidate v1

Upload `references/candidates/v1/02-essay-detail-candidate-v1.png` as the edit target and use:

```text
Edit only the text-content treatment in this website reference image.
Keep the entire composition, viewport, top navigation, panel geometry, spacing, title scale, serif/sans typography roles, colors, borders, photograph position and crop, caption position, and bottom previous/archive/next navigation unchanged.
Preserve these labels verbatim: "OPEN", "Archive", "Notes", "Photos", "About", "ESSAY", "返回归档", "文章标题", "2026.08.01".
Replace all three readable Chinese body paragraphs with neutral abstract unreadable placeholder bars and squiggles arranged as realistic paragraph lines. Replace the readable photograph caption with one short neutral placeholder line.
Do not write new prose. Do not change the photograph. Do not add or remove any component. No watermark.
```

### Targeted retry for Photo Story Candidate v1

Upload `references/candidates/v1/03-photo-story-candidate-v1.png` as the edit target and use:

```text
Edit only the text-content treatment in this photography-story website reference image.
Keep the entire composition, viewport, top navigation, title hierarchy, colors, dividers, all three photograph positions, dimensions and crops, and section spacing unchanged.
Preserve these labels verbatim: "OPEN", "Archive", "Notes", "Photos", "About", "PHOTO", "返回归档", "摄影集标题", "地点 · 2026.08.06", "序列预览", "创作说明".
Replace only the readable paragraph below "创作说明" with neutral abstract unreadable placeholder bars and squiggles arranged as two short lines.
Do not write new prose. Do not change any photograph. Do not add or remove any component. No watermark.
```

### Targeted redesign for About Candidate v1

Upload `references/candidates/v1/04-about-candidate-v1.png` as the edit target and use:

```text
Correct unsupported personal claims while preserving the OPEN About-page design system.
Keep the viewport, top navigation, large panel, portrait size and position, OPEN title, approved statement, social-link rows, overall three-part composition, colors, typography roles, borders and spacing.
Remove the visible "REPLACE" badge from the portrait without changing the portrait crop.
Replace the readable biography paragraph with neutral abstract unreadable placeholder bars and squiggles arranged as four short lines.
Replace the entire right-side "Archive Timeline" with a non-chronological "Archive Index" of two entries only: "Writing" and "Photography". Add the exact phrase "持续记录，持续保存。" once beneath the two categories. Preserve approximately the same visual weight and alignment as the old right column, but remove every year, date, node sequence and chronological claim.
Preserve these labels verbatim: "OPEN", "Archive", "Notes", "Photos", "About", "记录文字，保存瞬间。", "Archive Index", "Writing", "Photography", "持续记录，持续保存。", "GitHub", "Email", "Instagram", "RSS".
Do not invent biography, dates, credentials, metrics, locations, awards or additional links. No watermark.
```

### Landscape expansion for Photo Story v2

Upload `references/candidates/v1/03-photo-story-candidate-v2.png` as the edit target and use:

```text
Expand this exact approved website reference from a square canvas to a 16:9 landscape desktop canvas. Select the tool's 16:9 output option.
Preserve every existing component, approved label, photograph, crop, relative hierarchy, dark palette, typography role, divider, spacing rhythm and placeholder line treatment. Do not rewrite or regenerate the content inside the existing composition.
Use the extra horizontal space to create natural dark page margins and proportionally widen the main content container without stretching photographs or text. Keep the dominant cover photograph complete and preserve the two-image sequence as independent media.
Do not add navigation items, text, photographs, cards or decoration. No watermark.
```

### Landscape expansion for About v2

Upload `references/candidates/v1/04-about-candidate-v2.png` as the edit target and use:

```text
Expand this exact approved website reference from a square canvas to a 16:9 landscape desktop canvas. Select the tool's 16:9 output option.
Preserve every existing component, approved label, portrait crop, OPEN statement, neutral biography placeholder lines, social rows, Archive Index, dark palette, typography roles, dividers and hierarchy. Do not rewrite or regenerate the content inside the existing composition.
Use the extra horizontal space as natural dark page margins and modestly wider separation between identity, links and Archive Index. Keep the portrait circular and fully visible. Preserve the non-chronological Archive Index with only Writing, Photography and "持续记录，持续保存。".
Do not add dates, biography, credentials, links, panels or decoration. No watermark.
```
