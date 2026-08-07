# OPEN Fidelity Ledger

Build owner: `identity-skill/references/frontend-app-builder.md` fallback. Accepted concept set: `references/locked/v2/`.

## Archive Home

<!-- identity-section:archive-home status=pass -->

- Reference: `references/locked/v2/01-archive-home.png`
- Render evidence: `qa/desktop/01-archive-home.png`, `qa/ultrawide/01-archive-home.png`, `qa/mobile/01-archive-home.png`
- Preserved anchors: 56px dark header, three-column desktop shell, fixed identity rail, asymmetric image-led archive grid, stacked utility rail, restrained blue active state.
- Comparison: hierarchy, near-black palette, thin borders, image crops, metadata scale, and mobile single-column order pass.
- Intentional deviation: the reference shows 32 archive items and 16/16 statistics; the current approved placeholder set contains 8 items and reports 3 essays/5 photo stories. At 1440x900 the Music widget follows the calendar below the fold because the real utility content is taller; it is visible at 2200x1200 and in normal scrolling.
- Status: pass.

## Essay Detail

<!-- identity-section:essay-detail status=pass -->

- Reference: `references/locked/v2/02-essay-detail.png`
- Render evidence: `qa/desktop/02-essay-detail.png`, `qa/ultrawide/02-essay-detail.png`, `qa/mobile/02-essay-detail.png`
- Preserved anchors: centered reading panel, serif display title, compact metadata, wide rain-city image, quiet previous/archive/next footer.
- Comparison: reading width, title hierarchy, dark panel contrast, image ratio, spacing rhythm, and responsive wrapping pass.
- Intentional deviation: the reference uses gray skeleton bars; the build uses clearly marked placeholder prose so the Supabase Markdown content boundary is real and testable.
- Status: pass.

## Photo Story

<!-- identity-section:photo-story status=pass -->

- Reference: `references/locked/v2/03-photo-story.png`
- Render evidence: `qa/desktop/03-photo-story.png`, `qa/ultrawide/03-photo-story.png`, `qa/mobile/03-photo-story.png`
- Preserved anchors: image-led reading path, panoramic mountain/lake cover, two-image sequence, thin section dividers, restrained creation note.
- Comparison: cover prominence, monochrome tonal balance, gallery geometry, crop safety, first-screen spacing, and mobile stacking pass.
- Intentional deviation: reviewed generated stand-ins replace unavailable original photography and are explicitly disclosed in the creation note.
- Status: pass.

## About

<!-- identity-section:about status=pass -->

- Reference: `references/locked/v2/04-about.png`
- Render evidence: `qa/desktop/04-about.png`, `qa/ultrawide/04-about.png`, `qa/mobile/04-about.png`
- Preserved anchors: avatar-led identity composition, large OPEN wordmark, contact rows, vertical divider, and two-item Archive Index.
- Comparison: two-column geometry, typography roles, icon weight, line rhythm, whitespace balance, and mobile restacking pass.
- Intentional deviation: biography copy and avatar remain explicitly approved `replace-later` placeholders.
- Status: pass.

## Cross-Viewport And Interaction Review

- Exact captures checked at 1440x900, 2200x1200, and 390x844.
- No horizontal overflow, incoherent overlap, accidental subject crop, unreadable control text, or missing primary focal point was observed.
- Notes filtering, search filtering, essay navigation and hash refresh, photo lightbox and Escape, controlled wheel page switch, and disabled Music controls were verified in the in-app Browser.
- Visible-copy diff: reference placeholder/skeleton copy was replaced only where approved content boundaries require real labels or clearly disclosed placeholder prose; no unapproved hero eyebrow, badge, CTA, or section was added.

