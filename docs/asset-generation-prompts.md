# OPEN Asset Generation Prompts

> Execution mode: GPT Web Image, one asset per request. These are build assets, not website reference screenshots. Do not upload the entire document as one request.

## Shared Rules

For every request:

- Generate only the named photographic/media asset, never a website screenshot or card UI.
- Match OPEN's dark editorial world: low saturation, cool near-black shadows, restrained highlights, natural texture, subtle film grain.
- No readable text, logos, watermarks, labels, borders, rounded card shells or UI controls.
- Keep the subject-safe area complete at the requested aspect ratio.
- Any generated work is a `replace-later` demo stand-in, not the user's real portrait or photography.
- Save the result using the exact filename shown.

## 01 Anonymous Avatar

- Output: `assets/avatar/avatar-replace-later.jpg`
- Ratio: `1:1`
- Reference input: `references/locked/v2/04-about.png`

```text
Use case: photorealistic-natural
Asset type: anonymous replace-later portrait for a personal literary and photography archive
Input image: the OPEN About reference is style and crop guidance only; do not reproduce any UI or text
Scene/backdrop: misty lake and distant mountains under overcast light
Subject: one anonymous young adult in dark simple clothing, quiet side profile or three-quarter back view, face mostly in shadow and not identifiable, natural hair and realistic fabric
Style/medium: candid low-saturation editorial photograph, subtle film grain, authentic natural texture
Composition/framing: centered upper-body portrait with generous circular-crop safety; head and shoulders fully inside the central 70 percent
Lighting/mood: soft gray daylight, private, introspective, restrained contrast
Color palette: charcoal, cool gray, muted blue-black
Constraints: one person only; no readable text, logo, watermark, frame, badge or UI; do not imitate a real identifiable person
```

## 02 Rain City Cover

- Output: `assets/archive/rain-city-cover.jpg`
- Ratio: `16:9`
- Reference input: `references/locked/v2/01-archive-home.png` and `02-essay-detail.png`

```text
Use case: photorealistic-natural
Asset type: replace-later essay cover photograph
Scene/backdrop: broad urban avenue after rain at blue hour, wet asphalt, dark mid-rise buildings, sparse traffic
Subject: one distant car centered on the road, warm streetlights reflected in puddles, mist between buildings
Style/medium: natural cinematic editorial photography, low saturation, subtle film grain
Composition/framing: symmetrical wide street perspective, low horizon, complete road reflections, safe 16:9 crop
Lighting/mood: quiet late evening, cool shadows with restrained amber practical lights
Color palette: #080B10 black, charcoal blue-gray, small amber reflections
Constraints: no close identifiable people; storefront signs must be abstract unreadable marks; no readable text, logo, watermark, UI or border
```

## 03 Loneliness Cover

- Output: `assets/archive/loneliness-cover.jpg`
- Ratio: `4:3`
- Reference input: `references/locked/v2/01-archive-home.png`

```text
Use case: photorealistic-natural
Asset type: replace-later essay cover photograph
Scene/backdrop: dark garden after rain
Subject: one small cluster of broad leaves with realistic water droplets, surrounded by deep natural shadow
Style/medium: intimate botanical editorial photography, realistic macro texture, low saturation
Composition/framing: leaves occupy the right-center, calm negative space at upper left, complete leaf edges within a 4:3 crop
Lighting/mood: soft diffused night light, private and contemplative
Color palette: near-black, deep muted green, cool silver highlights
Constraints: no text, insects, artificial glow, logo, watermark, UI or border
```

## 04 Mountain Lake Cover

- Output: `assets/archive/mountain-lake-cover.jpg`
- Ratio: `16:9`
- Reference input: `references/locked/v2/03-photo-story.png`

```text
Use case: photorealistic-natural
Asset type: replace-later photo-story cover photograph
Scene/backdrop: wide alpine lake beneath a long mountain ridge, low cloud and mist
Subject: calm dark water, layered mountains across the center, subtle fog drifting around peaks
Style/medium: natural landscape editorial photography, low saturation, subtle film grain
Composition/framing: wide 16:9 panorama, horizon slightly below center, complete ridge silhouette and clean water foreground
Lighting/mood: overcast dawn, quiet and monumental, restrained highlights
Color palette: graphite, blue-gray, muted slate, near-black water
Constraints: no people, boats, buildings, text, logo, watermark, UI or border
```

## 05 Future Self Cover

- Output: `assets/archive/future-self-cover.jpg`
- Ratio: `4:3`
- Reference input: `references/locked/v2/01-archive-home.png`

```text
Use case: photorealistic-natural
Asset type: replace-later essay cover photograph
Scene/backdrop: quiet interior beside a tall window on an overcast morning
Subject: closed book on a simple wooden surface, one restrained green plant, long soft window shadow
Style/medium: intimate editorial still-life photography, natural material texture, low saturation
Composition/framing: book in lower-left third, plant at right edge, calm open wall and window light, safe 4:3 crop
Lighting/mood: muted morning light, reflective and unhurried
Color palette: charcoal, soft gray, faded green, very small warm paper tone
Constraints: book cover and pages contain no readable text; no cup, laptop, logo, watermark, UI or border
```

## 06 Dusk Tram Cover

- Output: `assets/archive/dusk-tram-cover.jpg`
- Ratio: `4:3`
- Reference input: `references/locked/v2/01-archive-home.png`

```text
Use case: photorealistic-natural
Asset type: replace-later photography cover
Scene/backdrop: old tram street at dusk after a light rain, dense but quiet city blocks
Subject: one tram moving away along rails, small practical streetlights, soft reflections
Style/medium: natural documentary editorial photography, low saturation, subtle film grain
Composition/framing: tram centered in lower middle, rails lead inward, complete tram silhouette within 4:3 crop
Lighting/mood: last blue daylight with restrained warm lamps, nostalgic but realistic
Color palette: dark blue-gray, charcoal, small amber lights
Constraints: no readable advertisements or signs, no prominent faces, no logo, watermark, UI or border
```

## 07 Unfinished Thoughts Cover

- Output: `assets/archive/unfinished-thoughts-cover.jpg`
- Ratio: `4:3`
- Reference input: `references/locked/v2/01-archive-home.png`

```text
Use case: photorealistic-natural
Asset type: replace-later essay cover photograph
Scene/backdrop: dark wooden desk under a narrow pool of soft evening light
Subject: open notebook, simple pen, irregular page shadows; notebook contains only abstract unreadable placeholder bars and squiggles
Style/medium: intimate editorial still-life photograph, tactile paper and wood grain, low saturation
Composition/framing: notebook angled gently through the center, pen near lower edge, complete object boundaries, safe 4:3 crop
Lighting/mood: quiet late-night writing atmosphere, restrained contrast
Color palette: charcoal brown, black, muted warm paper, soft gray
Constraints: absolutely no readable handwriting or printed text; no coffee cup, logo, watermark, UI or border
```

## 08 Seaside Evening Cover

- Output: `assets/archive/seaside-evening-cover.jpg`
- Ratio: `4:3`
- Reference input: `references/locked/v2/01-archive-home.png`

```text
Use case: photorealistic-natural
Asset type: replace-later photography cover
Scene/backdrop: quiet coastline at late dusk, distant low mountains and calm sea
Subject: open water with one subtle shoreline edge, faint last light on horizon
Style/medium: natural landscape editorial photography, low saturation, fine film grain
Composition/framing: horizontal horizon across upper third, calm negative water foreground, safe 4:3 crop
Lighting/mood: blue hour, still and private
Color palette: muted navy, gray-blue, soft charcoal, faint dusty rose horizon
Constraints: no people, boats, buildings, text, logo, watermark, UI or border
```

## 09 Window Light Cover

- Output: `assets/archive/window-light-cover.jpg`
- Ratio: `16:9`
- Reference input: `references/locked/v2/01-archive-home.png`

```text
Use case: photorealistic-natural
Asset type: replace-later photography cover
Scene/backdrop: plain dark interior wall beside a window near sunset
Subject: soft rectangular window light and the shadow of one small plant cast across the wall
Style/medium: minimal natural editorial photography with realistic imperfect wall texture
Composition/framing: wide 16:9 image, light shape on right half, quiet negative space on left, complete shadow silhouette
Lighting/mood: restrained warm fading light against cool shadow
Color palette: near-black, charcoal gray, muted warm amber, faded green-gray
Constraints: no furniture cluster, text, logo, watermark, UI or border
```

## 10 Mountain Range Gallery

- Output: `assets/archive/mountain-range-gallery.jpg`
- Ratio: `3:2`
- Reference input: `references/locked/v2/03-photo-story.png`

```text
Use case: photorealistic-natural
Asset type: replace-later photo-story gallery image
Scene/backdrop: rugged mountain range beside cold dark water beneath layered cloud
Subject: complete snow-streaked ridge with a low rocky shore and calm foreground water
Style/medium: natural landscape documentary photograph, low saturation, realistic texture
Composition/framing: 3:2 landscape, ridge spans the center, no peak cropped, stable shoreline baseline
Lighting/mood: overcast and austere, subtle depth through atmospheric haze
Color palette: charcoal, cool gray, muted blue, small off-white snow
Constraints: no people, structures, text, logo, watermark, UI or border
```

## 11 Forest Path Gallery

- Output: `assets/archive/forest-path-gallery.jpg`
- Ratio: `2:3`
- Reference input: `references/locked/v2/03-photo-story.png`

```text
Use case: photorealistic-natural
Asset type: replace-later photo-story gallery image
Scene/backdrop: dense tall evergreen forest after light rain
Subject: narrow natural path leading toward soft misty light, vertical tree trunks and realistic moss
Style/medium: natural documentary landscape photograph, low saturation, subtle film grain
Composition/framing: 2:3 portrait, path centered and fully visible from bottom edge inward, tree canopy and trunk edges safely contained
Lighting/mood: quiet diffused forest light, mysterious but not dark fantasy
Color palette: deep muted green, charcoal brown, cool mist gray
Constraints: no people, animals, signs, text, logo, watermark, UI or border
```

## 12 Music Cover

- Output: `assets/music/music-cover.jpg`
- Ratio: `1:1`
- Reference input: `references/locked/v2/01-archive-home.png`

```text
Use case: photorealistic-natural
Asset type: replace-later album-style cover for a personal site's music player
Scene/backdrop: dark sea at night with distant low fog
Subject: one small lighthouse or solitary navigation light on a rocky edge, reflected faintly on water
Style/medium: minimal cinematic editorial photograph, subtle film grain, low saturation
Composition/framing: square 1:1, lighthouse in lower-right third, generous dark negative space, strong readable thumbnail silhouette
Lighting/mood: quiet night journey, restrained and contemplative
Color palette: near-black, deep blue-gray, small cool white light
Constraints: no title, artist name, readable text, logo, watermark, UI, frame or border
```

## Delivery Checklist

Return the 12 files with the exact semantic filenames above. If GPT Web exports PNG, keep the PNG for review; conversion/optimization happens only after acceptance. Do not crop reference screenshots to create any asset.

