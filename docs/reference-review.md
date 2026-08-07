# OPEN Reference Review

## 02 Essay Detail - Candidate v1

- Candidate: `references/candidates/v1/02-essay-detail-candidate-v1.png`
- SHA-256: `4b4ccab9e9383ef649a5426b3035728e65302e9175c1ec0668051e31a26a2eef`
- Dimensions: `1586 x 992`
- Status: `needs-regeneration`

### Four-way review

- Visual meaning: pass. The page reads immediately as a focused OPEN essay detail.
- Fingerprint consistency: pass. Navigation, dark surfaces, active blue, essay amber, borders and image grade remain consistent with the Archive Home anchor.
- Rhythm/variation: pass. The calm text-led page provides a useful contrast to the rich Archive grid.
- Rebuildability: conditional pass. Navigation, title, metadata, body, image, caption and adjacent navigation can remain cleanly code-native or independent media.

### Blocking issue

The three body paragraphs and photo caption contain readable prose invented during image generation. The approved brief does not contain this article copy, so it cannot become a locked factual reference. The city photograph is allowed only as a `replace-later` visual-weight stand-in.

### Targeted correction contract

Keep the entire composition, spacing, type hierarchy, navigation, color palette, independent photograph rectangle and bottom archive navigation unchanged. Replace only unapproved article prose and the image caption with neutral typographic placeholder lines. Keep the approved labels `OPEN`, `Archive`, `Notes`, `Photos`, `About`, `ESSAY`, `返回归档`, `文章标题` and `2026.08.01`. Do not add new text, cards, controls or images.

## 03 Photo Story - Candidate v1

- Candidate: `references/candidates/v1/03-photo-story-candidate-v1.png`
- SHA-256: `534a629d7010d09c867feb33fe1946b7ab44818f41ffde3d9d1be0da8d6a1432`
- Dimensions: `1402 x 1122`
- Status: `needs-regeneration`

### Four-way review

- Visual meaning: pass. The page reads immediately as one coherent photo story.
- Fingerprint consistency: pass. Dark chrome, active blue, serif title and low-saturation grade match the anchor.
- Rhythm/variation: pass. One dominant cover followed by a controlled two-image sequence provides a rich image-led page.
- Rebuildability: pass. All three photographs are independent media with clean boundaries, complete crops and no cross-image overlap.

### Blocking issue

The creation note is readable generated prose that the user has not supplied or approved. The title, location and photographs remain explicit placeholders/stand-ins and cannot be presented as real work.

### Targeted correction contract

Keep the whole layout and all three media slots unchanged. Replace only the creation-note paragraph with neutral abstract unreadable placeholder bars and squiggles. Preserve the labels `OPEN`, `Archive`, `Notes`, `Photos`, `About`, `PHOTO`, `返回归档`, `摄影集标题`, `地点 · 2026.08.06`, `序列预览` and `创作说明`.

## 04 About - Candidate v1

- Candidate: `references/candidates/v1/04-about-candidate-v1.png`
- SHA-256: `bd8e0566f1feba19ec498cf38162f15fba73cf8381e75a43bf32a0b9b33782c4`
- Dimensions: `1402 x 1122`
- Status: `redesign-required`

### Four-way review

- Visual meaning: pass. The page clearly presents the person behind OPEN.
- Fingerprint consistency: pass. Palette, navigation, panel and portrait treatment match the anchor.
- Rhythm/variation: pass. The identity-led three-part composition contrasts appropriately with Archive and detail pages.
- Rebuildability: pass. Portrait, biography, links and right-side index are separable.

### Blocking issue

The biography and the 2016, 2018, 2020, 2022 and 2024+ timeline are invented personal claims. A timeline visually asserts chronology, so replacing its copy with generic filler would still imply unsupported history. The `REPLACE` badge is an internal provenance note and must not appear as final UI.

### Redesign contract

Keep the portrait/statement/social composition and overall right-column weight, but replace `Archive Timeline` with a non-chronological `Archive Index` containing only the approved categories `Writing` and `Photography` plus the approved phrase `持续记录，持续保存。`. Replace biography prose with neutral placeholder lines. Remove all years and the visible `REPLACE` badge. The portrait remains `replace-later` in the manifest, not in page UI.

## Revision Review - Candidate v2

### 02 Essay Detail v2

- Candidate: `references/candidates/v1/02-essay-detail-candidate-v2.png`
- SHA-256: `5682107f8a73a10962d7c23014b64fe4b7edf5714b509a8521e633d7bebaa06f`
- Dimensions: `1585 x 992`
- Status: `ready-for-acceptance`
- Result: all unapproved prose has been replaced by neutral placeholder lines. Visual meaning, hierarchy, composition, fingerprint consistency, rebuildability and landscape format pass. Responsive behavior remains a build-time verification item.

### 03 Photo Story v2

- Candidate: `references/candidates/v1/03-photo-story-candidate-v2.png`
- SHA-256: `7e867e7213808899725fe66d272865c73efa1e6c8382155687fa6e1495d97591`
- Dimensions: `1024 x 1024`
- Status: `needs-canvas-expansion`
- Result: content provenance, hierarchy, independent-media boundaries, safe crops and fingerprint consistency pass. The square canvas fails the required horizontal desktop-reference contract.

### 04 About v2

- Candidate: `references/candidates/v1/04-about-candidate-v2.png`
- SHA-256: `7941c1980b7b65d8e3db92a984ffd7568fd5f81a682903f179a923e137afb6af`
- Dimensions: `1024 x 1024`
- Status: `needs-canvas-expansion`
- Result: invented biography and chronology are removed; the Archive Index has honest semantics; portrait provenance remains `replace-later`. The square canvas fails the required horizontal desktop-reference contract.

## Landscape Revision Review - Candidate v3

### 03 Photo Story v3

- Candidate: `references/candidates/v1/03-photo-story-candidate-v3.png`
- SHA-256: `f7392bf013a4ed58d53a5c1e2da76f6508808ea66518de3306f03e4c184b29fa`
- Dimensions: `1024 x 576`
- Status: `ready-for-acceptance`
- Result: 16:9 landscape contract passes. All photographs retain correct proportions and complete semantic subjects; hierarchy, code-safe regions, placeholder content and fingerprint consistency remain intact.

### 04 About v3

- Candidate: `references/candidates/v1/04-about-candidate-v3.png`
- SHA-256: `9a06d1f43e478c8768e4732cfe497b6d187e2e7309528c9dc74569a0916bc183`
- Dimensions: `1024 x 576`
- Status: `ready-for-acceptance`
- Result: 16:9 landscape contract passes. Portrait, identity statement, social rows and non-chronological Archive Index remain balanced and separable.

### Group-level review

- Visual meaning: pass for all four references.
- Fingerprint consistency: pass for wordmark, dark surfaces, typography roles, active blue, borders, icon language and low-saturation media.
- Rhythm: pass; rich Archive -> calm Essay -> rich Photo -> calm About.
- Rebuildability: pass; all live text and controls are code-owned, while portrait and photographs remain independent media.
- Intentional deviation: source reference dimensions differ. Build QA will use one normalized `1440 x 900` viewport and preserve relative geometry without stretching any reference image.
- Group status: `ready-for-user-acceptance`.
