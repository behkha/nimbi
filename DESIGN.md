# nimbi Design System

The shared design language for every nimbi app and for the nimbi website. Relay is the reference app, and the landing page in this repo is the reference web surface. When you start a new app, start here.

**Who this is for:** you, and any AI agent building a nimbi app. When an app's code and this file disagree, this file is the target, unless a section is marked as a known gap.

**Order of authority:** what the user asks for explicitly, then this file, then patterns in existing nimbi code, then platform defaults (Apple HIG).

**Source of truth for values:**
- macOS: [NimbiKit](https://github.com/behkha/nimbi-kit) (`Tokens.swift`, `Cloud.swift`, `Form.swift`, `Mood.swift`, `NotchIsland.swift`, `Components.swift`, `Appearance.swift`, `SurfaceClaim.swift`). Add it with `.package(url: "https://github.com/behkha/nimbi-kit.git", from: "0.1.0")`.
- Patterns NimbiKit doesn't cover yet (the card, option rows, the shared island of phase 2): Relay's `CardView.swift`, `Components.swift`, `Panels.swift`, `PillView.swift`, `NotchView.swift`
- Web: `public/assets/site.css` and `public/assets/site.js` in this repo

---

## Contents

1. [Brand](#1-brand)
2. [Principles](#2-principles)
3. [The cloud](#3-the-cloud)
4. [Color](#4-color)
5. [Typography](#5-typography)
6. [Shape, depth and materials](#6-shape-depth-and-materials)
7. [Layout and sizing](#7-layout-and-sizing)
8. [Components](#8-components)
9. [Motion](#9-motion)
10. [Sound](#10-sound)
11. [Icons](#11-icons)
12. [Writing](#12-writing)
13. [Accessibility](#13-accessibility)
14. [The web](#14-the-web)
15. [Starter tokens](#15-starter-tokens)
16. [New app checklist](#16-new-app-checklist)
17. [Known gaps in Relay](#17-known-gaps-in-relay)
18. [Shared surfaces](#18-shared-surfaces)

---

## 1. Brand

| | |
|---|---|
| Name | **nimbi**, always lowercase, even at the start of a sentence. |
| Meaning | Latin plural of *nimbus*: a cloud, and a halo of light. A family of little clouds. |
| Tagline | *Little clouds that keep an eye on things.* |
| Web headline | *Software with a mood.* |
| Maker | behkha. One human, visible: the maker signs the work. |
| Product names | One plain, capitalized word: **Relay**, then the next one. No "nimbi" prefix in the app name. |
| Endorsement | "Relay by nimbi" on the website, in the About window and on store pages. |
| Bundle ID | `app.nimbi.<appname>`, for example `app.nimbi.relay`. |
| Family | Open-ended. Never imply a fixed number of apps. The website shows released apps, then one "forming" slot, then an open line. |

**Personality:** cosmic and a little mystic, playful, dark. Dry, warm and a bit cheeky. Inspired by the craft of Arc, Panic and Rogue Amoeba.

---

## 2. Principles

1. **Live at the edge.** nimbi apps sit at the edge of the screen: an edge pill, the notch, the menu bar. They come forward when needed and get out of the way afterwards. Use `LSUIElement` (no Dock icon) unless the app is document-based. The notch and the edge are shared by all nimbi apps (section 18).
2. **Mood, not badges.** State shows up as the cloud's mood, read from the corner of your eye. Use badges, banners and red numbers only as a quiet backup.
3. **Black ground, aurora light.** Surfaces are near-black. The only colorful light comes from the cloud and from state signals.
4. **Quiet chrome, loud cloud.** Panels, buttons and text stay neutral (white on black), so the cloud is always the most alive thing on screen.
5. **Native or nothing.** Swift, SwiftUI and AppKit. No Electron, and no third-party dependencies (NimbiKit is the only dependency, and it has none).
6. **Keyboard first.** Every main action has a key, and the key is shown next to it with a `KeyHint`. Shortcuts are bound to physical key codes, so they work on any keyboard layout.
7. **Slow at rest, snappy on touch.** Idle motion breathes slowly. Interactions use quick springs. Things leave faster than they arrive.
8. **Forgiving.** Every send, discard or destructive action waits behind a short undo window.

---

## 3. The cloud

The cloud is the brand. Every nimbi app uses the same cloud. Apps differ in what job it does, not in what it looks like.

### 3.1 Anatomy

**Outline (`CloudShape`).** A circle with 8 soft, slightly uneven scallops. For `t` from 0 to 2π, in 240 steps:

```
lobe = |cos(4t + 0.2)| ^ 0.7
k    = 0.93 + 0.043 · (2·lobe − 1) + 0.012 · sin(2t + 1)
x    = cx + r · k · cos t
y    = cy + r · k · sin t
```

Never draw the cloud as a plain circle or a generic cloud emoji shape. Always use this outline.

**Skin.** Layers are drawn inside the outline, back to front:

| Layer | Value |
|---|---|
| Base | linear gradient, bottom-left → top-right: `#7FD0FF` → `#B9B4FF` → `#F3B6EC` |
| Sky | radial `#56BFFF` at 0.9 → 0, centered (0.12, 0.5), radius 0.55·size |
| Blush | radial `#F6A9E4` at 0.85 → 0, centered (0.85, 0.12), radius 0.5·size |
| Core | radial white → white 0.55 → 0, centered (0.44 − 0.08·gazeX, 0.62 − 0.06·gazeY), radius 0.36·size. The core drifts against the gaze, so the cloud seems to turn. |
| Mood tint | flat color at the mood's tint amount (see 3.3) |
| Rim | white 0.7 stroke, width 0.05·size, blurred 0.035·size, masked to the outline |

**Face.**
- Eye color: ink `#24163A`.
- Eyes are ellipses, `0.12·size` wide and `0.18·size` tall. They grow slightly as the cursor comes near: +0.015 and +0.02 times `near`.
- Gap between the eyes: 0.07·size. The right eye sits 0.01·size lower.
- Mouth: 0.035·size below the eyes. Often there is no mouth at all.
- At rest the face sits 0.08·size right of center, looking slightly to the right.
- Open eyes carry a small highlight: white 0.18, or 0.55 for wide eyes.

**Glow and liquid ring.**
- Behind the cloud: a glow made from the same outline at 1.1 times its size, blurred, in the mood's glow color.
- Droplets circle the cloud. They are rendered as metaballs: blurred blobs passed through an alpha threshold of 0.5, colored with the glow color.
- In Relay, each working job adds one droplet.

### 3.2 Behavior

- **Gaze.** The eyes follow the cursor anywhere on screen.
  - `reach = min(1, distance / 140)`; gaze is the unit vector toward the cursor times `reach`.
  - The face shifts `gaze.x · 0.14 · size` sideways and `gaze.y · 0.12 · size` vertically.
  - Gaze follows fully (factor 1) for open, wide, squinting and angry eyes; partly (0.4) for happy, sleepy and sad eyes; not at all (0) for closed and dizzy eyes.
- **Blink.** Every 2.6–5.4 s, picked at random; 20% of blinks are double blinks.
  - Each blink: close with easeIn over 0.07 s, hold 0.11 s, open with easeOut over 0.14 s.
- **Near.** `near = clamp(1 − (distance − 40) / 260, 0…1)`. An asleep cloud shows *relaxed* once `near > 0.45`, so the cursor wakes it.
- **Play moods** respond to the cursor, but only while nothing needs the user:
  - *Giggly*: the cursor rests on the cloud for 0.7 s.
  - *Dizzy*: the cursor shakes around it, meaning 5 or more direction flips within 0.9 s over a path longer than 260 pt. Dizzy clears after 2.8 s.
- **Pausing.** All animation stops when the window is occluded (`VisibilityProbe`). A cloud that is always on screen (`lively: false`) holds still and only stirs for 2.5 s after a mood change.

### 3.3 Moods

Mood is the status system. Every app maps its own states onto these moods, and nothing else.

| Mood | When (Relay) | Scale | Glow | Tint | Eyes / mouth / mark | Motion | Droplets |
|---|---|---|---|---|---|---|---|
| **asleep** | nothing running | 0.9 | `#8E86C9` · 0.35 | `#8A8FB8` · 0.3 | closed / snore / zzz | slow breath 0.18 Hz, depth 0.03 | 1, slow |
| **relaxed** | idle, nothing asked | 1.0 | `#B07CFF` · 0.55 | none | open / none | breath 0.3 Hz | 2 |
| **busy** | jobs running (n) | 1 + 0.02·min(n, 5) | `#6FC8FF` · 0.55 + 0.04n | none | open; "oh" mouth at n ≥ 5; sweat at n ≥ 6 | faster breath, sway; small hops at n ≥ 4 | max(1, n) |
| **asking** | something needs you | 1.12 | `#FFD426` · 0.8 | `#FFE27A` · 0.12 | wide / "oh" / **!** | hops (0.06 at 1.6 Hz), heartbeat pulse | 3 |
| **impatient** | waiting more than 45 s | 1.2 | `#FFA53A` · 0.85 | `#FFB347` · 0.22 | squint / wobble / sweat | fast small hops, slight shake | 4, jittery |
| **angry** | waiting more than 3 min, or 3+ waiting for more than 45 s | 1.34 | `#FF4D4D` · 1.0 | `#FF5A5A` · 0.5 | slanted brows / frown / vein + steam | shake, strong pulse | 7, fast, wild |
| **happy** | answered, or a job finished (for 2.5–3.5 s) | 1.1 | `#FF9BE0` · 0.8 | `#FFC2EC` · 0.15 | happy arcs / grin / sparkles | big hops, sway | 5 |
| **lonely** | finished results unseen for 12 min | 0.86 | `#7D8BC4` · 0.35 | `#7F8FB8` · 0.32 | sad / frown / tear | very slow breath | 1 |
| **overheated** | the Mac or a job is running hot | 1.06 | `#FF7A3D` · 0.85 | `#FF8A4D` · 0.35 | sleepy / wavy / sweat + heat | heavy breath | 5, rising |
| **giggly** | cursor resting on it | 1.08 | `#FF9BE0` · 0.75 | `#FFC2EC` · 0.12 | happy / smile / hearts | jitter, quick hops | 4 |
| **dizzy** | cursor shaken around it | 1.0 | default | none | spirals / wavy / stars | wide sway | 3, fast |

**Mapping rules for a new app:**
- *asking*, *impatient* and *angry* mean "this needs you", in rising urgency. Use them only for things the user must act on.
- *happy* is short relief: 2.5–3.5 s, then back to the resting mood.
- *busy* means work is happening. Scale its liveliness with the amount of work, capped at 8.
- *asleep* means the app has nothing to do. *relaxed* means it's ready.
- Anything that needs the user always beats play moods and *overheated*.
- Don't invent new moods. If one is really needed, add it here first, with a glow color that's distinct from the existing ones.

### 3.4 Sizes

| Use | Size (pt) |
|---|---|
| Menu bar | 16–18, as a template glyph (see 11.3) |
| Edge pill button | 20·pillScale |
| Empty states | 30 |
| Toast companion | 40 |
| Notch dashboard | 56·textScale |
| Hero (web) | 220–340 CSS px |

### 3.5 Don'ts

- Don't recolor the skin per app. App identity comes from the job the cloud does, never from a different palette.
- Don't add limbs, hats or extra features to the cloud itself. A prop sits next to it, as in the app icon rules (11.2).
- **One exception to the outline: Tempo's tools.** Tempo's cloud may take the shape of the tool for the moment (NimbiKit's `CloudForm`): an hourglass while you focus, a bell when time is up, a mug on a short break, a crescent moon on a long one. Skin, face, eyes, gaze and moods stay; the outline springs between shapes (`spring(0.55, 0.58)`, so it lands with a squash and a stretch) and comes back to the cloud at rest. Every other app keeps the cloud's outline, and the menu bar glyph and app icon are always the cloud.
- Never show two different clouds talking to each other in product UI. On marketing pages it's fine.
- Don't use emoji as stand-ins for the cloud's marks. Draw them as the mascot does.

---

## 4. Color

All UI is dark. There is no light theme. Users pick between two dark themes:
- **Dark** (default): panels `#141414`.
- **Black**: panels `#090909`.

### 4.1 Surfaces

| Token | Value | Use |
|---|---|---|
| `void` | `#000000` | notch island, Black-theme ground, web background |
| `panelBlack` | `#090909` | panel fill in the Black theme |
| `panel` | `#141414` | floating panels: card, lists, menus (Dark theme) |
| `windowBg` | `#0E0E10` | main window content |
| `sidebar` | `#0A0A0B` | main window sidebar |
| `column` | `#111113` | secondary column |
| `pill` | `#111112` → `#2C2C2E` when active | edge pill before macOS 26 |
| `sliver` | `#080808` | collapsed pill before macOS 26 |
| `tooltipIsland` | `#1C1C1E` | tooltip at the notch |
| `well` | white 0.05 | grouped settings, review boxes, key map |
| `row` | white 0.055 (hover 0.065–0.08) | list and option rows |
| `codeWell` | black 0.45 | command and code boxes |

### 4.2 Borders

| Token | Value |
|---|---|
| `rim` | white 0.09 at 0.75 pt: every floating panel |
| `rowBorder` | white 0.07 at 1 pt |
| `cardBorder` | white 0.08 |
| `pillRim` | white 0.14 (0.24 when active) at 1 pt |
| `hairline` | white 0.06–0.12 at 0.5 pt: tooltips, slivers |

### 4.3 Text

| Token | Value | Use |
|---|---|---|
| `text` | white | titles, primary |
| `textMessage` | white 0.92 | message bodies, bubbles |
| `textStrong` | white 0.88 | secondary buttons, code |
| `textDim` | white 0.55 | supporting text |
| `textFaint` | white 0.38 | captions, hints |
| `textGhost` | white 0.32 | header subtitles only |

### 4.4 Aurora (the cloud)

| Token | Value |
|---|---|
| `sky` | `#7FD0FF` |
| `lavender` | `#B9B4FF` |
| `blush` | `#F3B6EC` |
| `glow` | `#B07CFF`: the brand's resting glow, also used for focus rings |
| `ink` | `#24163A`: eyes, and text set on aurora |

Use the aurora gradient (sky → lavender → blush) only on the cloud, the wordmark, and one hero word on the web. Never use it on buttons, panels or text in product UI. The one flat reuse is `rain` (4.5), which borrows `sky` as a single color.

### 4.5 State

| Token | Value | Meaning |
|---|---|---|
| `blue` | `#0A84FF` | working: spinners, page dots, prominent "Next", send |
| `amber` | `#F2B33D` | waiting on you, blocked, "Recommended" |
| `green` | `#30D158` | done, chosen, success |
| `red` | `#FF6961` | destructive text, deny |
| `asking` | `#FFD426` | the cloud's asking mood, inbox badge |
| `listening` | `#FF4F5E` | mic level bars |
| `rain` | `#7FD0FF` | rain amounts: chart bars, island bars. `sky` as one flat color, never the aurora gradient |
| `selectedFill` / `selectedBorder` | `#143A20` / green 0.55 | a picked option |
| `promptBubble` | `#13467E` | the user's words |
| `agentBubble` | `#262626` | the app's or agent's words |
| `claude` | `#D97757` | only when representing Claude itself |

**Heat** (anything running hot): core `#FFF2B0`, yellow `#FFC93C`, orange `#FF7A1A`, red `#E8332A`, ember `#8E1B12`, coal `#2A0E0A`. Gradients run yellow → orange → red.

**Rules:**
- White is the only primary action color. Color means state, never "click me".
- Destructive actions are red text on red 0.12 (0.22 when pressed). Never a solid red button.
- Workspace and account colors come from `#E8A85A #5B8DEF #4CC38A #C77DFF #F06A6A #3FC1C9 #F2C94C #9AA5B1`, shown only as 6 pt dots.

---

## 5. Typography

### 5.1 In apps

- **SF Pro** (the system font) for all UI.
- **SF Mono** (`.monospaced`) for paths, commands and code.
- `.monospacedDigit()` on every count, timer and percentage.
- `.rounded` only for the cloud's own marks ("z", "!").
- All panel text scales with the user's text size, `textScale` from 0.9 to 1.25. Use the helper, `look.font(size, weight)`, and never a fixed size inside panels.

| Role | Size / weight |
|---|---|
| Window title | 24 bold (main list), 20 semibold (settings pages), 17 semibold (sheets) |
| Brand in a window | 15 semibold |
| Toast | 14.5 regular |
| Card or item title | 13.5 semibold |
| Question / prompt | 13 semibold |
| List row name | 13 medium |
| Message body | 13 regular, white 0.92 |
| Option label | 12.5 regular |
| Group header | 12 semibold |
| Bubble text | 12 (the user's own words in medium) |
| Secondary button | 11.5 medium |
| Subheader / activity | 11.5 / 10.5 |
| Tooltip | 11 medium |
| Section label (window) | 11 semibold, UPPERCASE, tracking 0.8 |
| Caption / chip | 10.5 (chips semibold) |
| Hint | 10 |
| Key hint, "Recommended" | 9.5 semibold / medium |

### 5.2 On the web

| Role | Face |
|---|---|
| Display | **Fredoka** 500–600, for the wordmark and headlines only |
| Body | the system stack: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif` |
| Labels and code | **JetBrains Mono** 400–500, uppercase eyebrows with letter-spacing 0.14em |

Never use Fredoka inside an app. Inside an app, the cloud carries the playfulness and the type stays native.

### 5.3 Wordmark

- `nimbi` in Fredoka 600, lowercase, letter-spacing −0.02em to −0.03em.
- White on black. The aurora gradient is allowed on the wordmark in hero use.

---

## 6. Shape, depth and materials

### 6.1 Radii

All radii are continuous (squircle) corners.

| Element | Radius |
|---|---|
| Key hint | 5 |
| Small icon tile | 7 |
| Menu row | 8 |
| Option and agent row | 9 |
| Choice / next-step row, review box | 10 |
| Settings group | 11 |
| Key map, undo bar, section card | 12 |
| Bubble, inbox list | 14 |
| Settings panels | 16 |
| Lists, talk bar, default panel | 18 |
| The main card | 20 |
| App icon | 22.5% of the icon's width |
| Buttons, chips, toasts, tooltips, text fields | capsule |

### 6.2 Borders and shadows

- Floating panels: `rim` (white 0.09 at 0.75 pt) plus shadow black 0.32, radius 14, y 7. Leave 16 pt of transparent padding around the panel (24 pt below it) so the shadow never clips.
- Toast: shadow black 0.28, radius 10, y 4.
- Talk bar: shadow black 0.32, radius 16, y 8.
- No other shadows. Elevation comes from rims and near-black fills, not from shadow stacks.

### 6.3 Materials

- **Liquid Glass (macOS 26+)** is only for the edge pill and things that grow out of it, such as the needs-you toast.
  - Use `.glassEffect(.regular, in: shape)` over a black "smoke" layer: 0.48 at rest, 0.22 when active, 0 while pieces overlap.
  - Group the pieces in a `GlassEffectContainer(spacing: 6)` and give them a `glassEffectID` so they morph into each other.
- **Panels are solid, not glass.** Use `panel` / `panelBlack` with a `rim`. Glass behind dense text hurts readability.
- **Before macOS 26:** flat `pill` fills and `pillRim`, with scale transitions instead of morphing.
- **Vibrancy:** only for large reading windows, such as a session viewer. Use `.hudWindow` with black on top: 0.55 in Dark, 0.8 in Black.

### 6.4 Notch mode

When an app lives at the notch:
- The bar is pure black and merges into the hardware notch, with concave 7 pt "ears".
- Panels hang from it with a flat top, a rounded bottom (panel radius + 4) and no rim.
- Panels are at least as wide as the bar, and they unroll downward instead of scaling.
- Tooltips there are `#1C1C1E` capsules.

---

## 7. Layout and sizing

- **Edge-anchored windows.** Panels hang from the pill or the notch.
- **Panel widths** (each multiplied by `textScale`): card 360, list 318, timer 300 (Tempo), settings 272–300, filter 260, talk bar 330, wide two-pane 600 (Skyline's dropdown; about the open island's width, so the two line up at the notch).
- **Edge pill:**
  - Collapsed: 10·pillScale wide, with status glyphs 5.5·pillScale tall.
  - Expanded: a column of 32·pillScale buttons, 7·pillScale apart.
  - `pillScale` runs from 0.8 to 1.3 (user setting).
- **Card padding:** 14 horizontal, 13 vertical, 10 between blocks.
- **Rows:** option rows padded 9/7; list rows at least 30 tall.
- **Chips:** padded 7/3 or 8/3.5.
- **Main window:** 860×580 default (minimum 760×500), sidebar 200, content max width 820, padding 28 horizontal and 34 at the top.
- **Spacing scale:** 3, 4, 7, 8, 10, 12, 14, 16, 24, 28, 34. Prefer these.
- **Hit targets:** 22 pt minimum for icon buttons in dense panels. Main controls are larger: 25 pt minimum height for pill buttons.

---

## 8. Components

Most of these live in NimbiKit: key hints, status glyphs, the button styles, the pill chrome, panel backgrounds, tooltips, listening bars and the undo bar. The rest (card, option and choice rows, page dots, composer, list rows) are still in Relay; move each into NimbiKit the first time a second app needs it, rather than copying it.

| Component | Spec |
|---|---|
| **Edge pill** (`EdgeTab` + column) | Tab rounded on the screen side, radius 5·k, flaring into the screen edge with 6·k tangent arcs. Collapsed: one status glyph per item. Hover: expands into glossy circular buttons (inbox, items, cloud + talk, more) with `HoverHalo` and `HoverTip`. |
| **Status glyph** | Working: blue arc, trim 0–0.66, spinning once per 0.9 s. Waiting: solid amber dot. Done: solid green dot. Hot: flickering ember. Pops (`StatusPop`) when it changes. |
| **Badge** | 8 pt dot: `asking` yellow when something needs you, else green. Black ring 1.2. |
| **Needs-you toast** | Capsule in pill glass (black at the notch), 14.5 text, slides out of the pill. The cloud drops out below it with a bounce. Default text: "Agent needs you" (adapt to the app). |
| **Card** | `panel`, radius 20, `rim`, floating shadow. Header: title 13.5 semibold, page dots, and `‹ J` `› K` `?` `× esc` header buttons. Body: status line, prompt bubble on the right, agent bubble on the left, then content. |
| **Bubbles** | Prompt `#13467E`, agent `#262626`, radius 14, 12 pt text, with a 40 pt minimum spacer on the opposite side. |
| **Option row** | Number tile (18², radius 4, white 0.08) plus label 12.5 plus detail 10.5. Hover: white 0.08. Picked: `selectedFill` and `selectedBorder`, and the number becomes a green tile with a black check. "Recommended" is an amber 0.14 capsule. |
| **Choice row** | Like the option row with a 17² tile. Once one option is picked, the others dim to 0.4. |
| **Buttons** | Primary: white 0.95 capsule, black 12 semibold. Secondary: white 0.08 capsule, `rowBorder`, 11.5 medium. Pill button: white 0.09 (0.16 when pressed). Prominent: blue. Light: white 0.94 with black text. Destructive: red 0.12 fill with red text. All pressable buttons scale to 0.96 when pressed. |
| **Key hint** | Radius 5, minimum 17×17, 9.5 semibold. On dark: white 0.6 text on white 0.11. On light: black 0.5 on black 0.09. Put it inside or next to the control it triggers. |
| **Filter chips** | All · Asking · Done, each with a count. Selected: white capsule with black text. Others: subtle capsule. Show them only when they help (two or more kinds present). |
| **Page dots** | Active: blue capsule 14×5. Others: white 0.28 dots 5×5. Up to 7. Hidden for 0–1 items. |
| **Undo bar** (`UndoBar`) | `well` box radius 12: icon and label (12.5 medium) plus an "esc · to undo" capsule. A 2.5 pt blue line drains over the undo window: 2.0 s, or 2.5 s for destructive actions. |
| **Step chips** | Done: green check. Current: amber 6 pt dot. Upcoming: white 0.45 ring. |
| **Composer** | Capsule text field (white 0.07, white 0.2 stroke when focused), camera toggle, send button (blue when there is text). |
| **List rows** | Glyph, name 13 medium, meta icons. Row actions sit at 0.45 opacity and rise to 0.95 on hover. Needs-you rows get an amber 0.08 wash. A just-finished row glows green 0.16 and fades out over 1.6 s. |
| **Settings menu** | Header (icon, title, version), then grouped `MenuRow`s (icon, title, value, chevron) in a `well` radius 11, then plain rows ("Hide for 2 hours", "Quit <App>"). |
| **Tooltip** (`HoverTip`) | Black 0.85 capsule, white 0.12 rim at 0.5 pt, 11 medium, truncated at 176·textScale. |
| **Listening bars** | 4 red (`#FF4F5E`) capsules replacing the mic icon while listening. |
| **Empty state** | Cloud (30) next to a title (13 semibold) and a dim detail line. Always in the brand voice ("Nothing needs you." / "Suspiciously quiet."). |
| **Heat** | `FireBorder` (rotating fire gradient on the row border) and `FlameAura` (flame tongues behind an icon). Use only for something that really runs hot. |

Icons inside the UI are **SF Symbols**, medium weight, sized to the text they sit next to.

---

## 9. Motion

### 9.1 Principles

- Idle motion is slow and continuous: breathing, drifting droplets.
- Interactions are quick springs. Things leave faster and simpler than they arrive: an ease-in, never a bounce.
- Choreograph in order: the shape first, then the content. Close in reverse.
- Pause every animation when the window can't be seen. Respect Reduce Motion: keep the state changes but drop the hops, shakes and sways.

### 9.2 Tokens

All springs are written as SwiftUI `.spring(response:dampingFraction:)`.

| Token | Value | Use |
|---|---|---|
| `enter` | spring(0.42, 0.80) | toasts and panels arriving |
| `bounce` | spring(0.55, 0.56), delay 0.06 | the cloud dropping in |
| `pop` | jump to 0.35 → spring(0.22, 0.5) up to 1.5 → after 0.2 s spring(0.38, 0.62) back to 1 | status glyph changes |
| `press` | 0.92–0.96 scale, spring(0.2, 0.7) | pressed buttons |
| `panel` | scale 0.92–0.94 + opacity, spring(0.34, 0.8) | panels from the pill |
| `rowReveal` | opacity + y 6, spring(0.36, 0.84), delay min(i, 14) × 0.028 s | list rows cascading in |
| `pillOpen` | spring(0.36, 0.8), then after 0.16 s spring(0.55, 0.66) | Liquid Glass pill splitting apart |
| `pillClose` | spring(0.3, 0.86), then after 0.22 s spring(0.36, 0.84) | pill gathering back |
| `islandOpen` / `islandClose` | spring(0.5, 0.7) / spring(0.38, 0.9) | notch |
| `mood` | spring(0.45, 0.55) | cloud mood change |
| `gaze` | spring(0.5, 0.78) | cloud eyes |
| `leave` | easeIn 0.2 | anything leaving |
| `hover` | easeOut 0.10–0.16 | hover states, tooltips |
| `swap` | easeOut 0.16 | swapping card content |
| `spin` | linear 0.9 s per turn | working arc |
| `undo` | 2.0 s (2.5 s destructive) | undo window |
| `toastHold` | 2.4 s (1.3 s when a panel opens next) | toast on screen |

### 9.3 Timing rules

- Wait 0.2 s of hover before opening anything big (the notch dwell).
- Wait 0.6 s after the pointer leaves before collapsing.
- Ignore keys for 0.45 s after an item changes under the user, so they don't answer the wrong thing.
- Use `TimelineView(.animation(minimumInterval: 1/30))` for continuous motion: the cloud, flames, level bars. Never faster.

---

## 10. Sound

- System sounds only: Tink, Pop, Glass, Ping, Purr, Submarine, Funk, Bottle. The default is **Tink**.
- **Tink** for something that needs the user. **Pop** for something that finished.
- Sound can be turned off with one switch. Picking a sound in settings plays a preview.
- Never loop sounds or play them for routine progress.
- **Ambience is not a notification.** A soft loop the user turns on for themselves (Tempo's rain, distant storm, wind or brown noise under focus) is allowed: off by default, synthesized in the app (no audio files), fading in over about 1.5 s and out over 1 s, and silent whenever its job isn't running.

---

## 11. Icons

### 11.1 In-app UI

SF Symbols, medium weight. No custom icon sets, and no emoji in the UI. Weather symbols may use SF Symbols' multicolor rendering (filled variants: sun yellow, rain blue), since there the color is the information.

### 11.2 App icons (standard for every nimbi app)

- **Tile:** macOS rounded rect, radius 22.5% of its width, inset 10% from the canvas edge.
- **Background:** vertical gradient from white 0.16 (top) to white 0.05 (bottom), roughly `#292929` → `#0D0D0D`, with a white 0.12 rim of 0.6% of the canvas width.
- **Content:** the cloud with the full aurora skin, about 55% of the tile, eyes looking right, with a soft violet glow.
- **One prop per app,** in aurora or a single state color, telling the app's job:
  - Relay: the cloud becomes a speech bubble, with a tail at its lower left and an amber `#F2B33D` "asking" badge at its upper right.
  - Skyline: three `rain` drops below the cloud's left side.
  - Tempo: a ring of time, an aurora arc three quarters of the way round the cloud (which shrinks to 50% of the tile to make room).
  - Future apps: one prop only, for example sound waves, a notch, or a second small cloud.
- **Never:** text, a second character, or a colored background.
- **Sizes:** 16, 32, 64, 128, 256, 512 and 1024 px, generated procedurally like Relay's `scripts/make-icon.swift`.

### 11.3 Menu bar glyph

- A solid cloud outline with the eyes cut out.
- Monochrome template image, so macOS tints it. 16–18 pt.
- Add color only when the app needs the user (an amber dot).

### 11.4 Web

- `favicon.svg` is the cloud with eyes; the apple-touch and manifest icons are the cloud glowing on black. Both are generated by `tools/make-icons.mjs`.
- The share image is 1200×630: the cloud plus "Software with a mood." Generated the same way.

---

## 12. Writing

### 12.1 Voice

Dry, warm, a little cheeky. Say less and mean it. Write like a sharp friend sitting next to you, not like a system.

- **Do:** short sentences, plain words, and a bit of humor in empty states, nudges and docs.
- **Don't:** cutesy talk, exclamation spam (one "Hey!" in an angry nudge is the limit), corporate phrasing, apologies, emoji, or jargon the user didn't bring.

### 12.2 Patterns from Relay

| Situation | Example |
|---|---|
| Empty state | "Nothing needs you." · "Suspiciously quiet. Questions and finished work land here." |
| First run | "Start Claude Code in any terminal or the Claude app. Agents show up here on their own." |
| Gentle nudge | "Psst… still waiting on you" |
| Firm nudge | "Hey! It's been waiting 4 min" · "Hey! 3 agents are stuck on you" |
| Toast | "Agent needs you" · "Already answered" · "That agent is gone" |
| Undo label | "Answer sent" · "Message sent" · "Discarded" · "Agent killed" |
| Loading | "Thinking of next steps…" |
| Teaching a shortcut | "Double-tap Option from any app to talk. One more tap sends it." |
| Tagline | "Never keep an agent waiting." |
| Warning | "Anyone with this link on your network can answer your agents. Keep it private." |

### 12.3 Rules

- Name things by what people recognize: *inbox, agents, talk*. Not by how the system is built.
- Controls say exactly what happens ("Kill agent", "Discard"). The result confirms it in the past tense ("Agent killed").
- Errors say what happened and what to do next.
- Tooltips include the shortcut: "Inbox · 3 waiting · ⌃⌥Space".
- Use the real ellipsis "…", curly quotes, and "·" as a separator.

---

## 13. Accessibility

- Text contrast is at least 4.5:1. `textFaint` (white 0.38 on `#141414`) is for captions only, never for anything the user must read to act.
- State is never shown by color alone. Glyph shape (arc, dot, check) and wording carry it too.
- Every icon-only control has a tooltip and an accessibility label.
- Support the user's text size (`textScale`) and pill size (`pillScale`) settings in every panel.
- Respect Reduce Motion: the cloud changes mood with no hops, shakes or sways, and transitions become fades.
- Full keyboard path for every main flow, shown with `KeyHint`s.
- Keep focus rings visible: `glow` `#B07CFF` at 2 pt on the web, the system focus ring in apps.

---

## 14. The web

The landing page in `public/` is the reference.

- **Theme:** dark only, `color-scheme: dark`, black ground.
- **Layout:** a 1240 px max container and a 16 px side gutter; sections stack to one column at phone width.
- **Hero:** the thesis ("Software with a mood.") next to a live, playable cloud stage. Nothing generic: no feature-card grids, no gradient washes, no testimonials.
- **Cloud on the web:** the same outline formula, skin, moods and gaze as the app, implemented in `site.js`. The eyes follow the cursor anywhere on the page.
- **Motion:** GSAP 3.15 + ScrollTrigger, self-hosted in `/vendor`.
  - One orchestrated intro: words rise, then the supporting text, then the controls, then the stage.
  - Scroll reveals use `power3.out`, `back.out` for playful items, and scrubbed effects for the demo video and the log line.
  - Always `clearProps: 'transform'` after a reveal, so CSS hover still works.
  - Skip all of it under Reduce Motion, and jump to the end state when the page loads in a hidden tab.
- **App family:** the "Sky log". Released apps, then "Now · The next cloud is forming", then a dashed line that fades out. No counts, no "?" placeholders.
- **Media:** WebM + MP4 loops with a poster image. No large GIFs.

---

## 15. Starter tokens

### 15.1 SwiftUI

```swift
import SwiftUI

/// nimbi design tokens. Mirror of DESIGN.md; keep the two in sync.
enum Nimbi {
    enum Surface {
        static let void = Color(hex: "#000000")
        static let panelBlack = Color(hex: "#090909")
        static let panel = Color(hex: "#141414")
        static let window = Color(hex: "#0E0E10")
        static let sidebar = Color(hex: "#0A0A0B")
        static let well = Color.white.opacity(0.05)
        static let row = Color.white.opacity(0.055)
    }
    enum Line {
        static let rim = Color.white.opacity(0.09)      // 0.75 pt
        static let row = Color.white.opacity(0.07)      // 1 pt
    }
    enum Text {
        static let primary = Color.white
        static let message = Color.white.opacity(0.92)
        static let dim = Color.white.opacity(0.55)
        static let faint = Color.white.opacity(0.38)
    }
    enum Aurora {
        static let sky = Color(hex: "#7FD0FF")
        static let lavender = Color(hex: "#B9B4FF")
        static let blush = Color(hex: "#F3B6EC")
        static let glow = Color(hex: "#B07CFF")
        static let ink = Color(hex: "#24163A")
        static let gradient = LinearGradient(colors: [sky, lavender, blush],
                                             startPoint: .bottomLeading, endPoint: .topTrailing)
    }
    enum State {
        static let working = Color(hex: "#0A84FF")
        static let waiting = Color(hex: "#F2B33D")
        static let done = Color(hex: "#30D158")
        static let destructive = Color(hex: "#FF6961")
        static let asking = Color(hex: "#FFD426")
        static let listening = Color(hex: "#FF4F5E")
        static let rain = Color(hex: "#7FD0FF")
        static let selectedFill = Color(hex: "#143A20")
        static let selectedBorder = Color(hex: "#30D158").opacity(0.55)
        static let promptBubble = Color(hex: "#13467E")
        static let agentBubble = Color(hex: "#262626")
    }
    enum Radius {
        static let keyHint: CGFloat = 5, row: CGFloat = 9, well: CGFloat = 12
        static let bubble: CGFloat = 14, panel: CGFloat = 18, card: CGFloat = 20
    }
    enum Motion {
        static let enter = Animation.spring(response: 0.42, dampingFraction: 0.8)
        static let bounce = Animation.spring(response: 0.55, dampingFraction: 0.56).delay(0.06)
        static let panel = Animation.spring(response: 0.34, dampingFraction: 0.8)
        static let mood = Animation.spring(response: 0.45, dampingFraction: 0.55)
        static let gaze = Animation.spring(response: 0.5, dampingFraction: 0.78)
        static let leave = Animation.easeIn(duration: 0.2)
        static let hover = Animation.easeOut(duration: 0.12)
        static let undoWindow: TimeInterval = 2.0
        static let undoWindowDestructive: TimeInterval = 2.5
    }
}
```

NimbiKit ships these tokens (with a few more) as `Nimbi`, plus `Color(hex:)`. Import it instead of copying this block; the snippet is here as a reference.

### 15.2 CSS

```css
:root {
  --void: #000000; --panel: #0B0B0D; --stage: #07070A;
  --line: rgba(255,255,255,.1);
  --text: #FFFFFF; --dim: rgba(255,255,255,.68); --faint: rgba(255,255,255,.48);
  --sky: #7FD0FF; --lavender: #B9B4FF; --blush: #F3B6EC; --glow: #B07CFF; --ink: #24163A;
  --amber: #F2B33D; --asking: #FFD426; --done: #30D158; --working: #0A84FF; --rain: #7FD0FF;
  --aurora: linear-gradient(90deg, var(--sky), var(--lavender) 50%, var(--blush));
  --display: 'Fredoka', ui-rounded, system-ui, sans-serif;
  --body: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
  color-scheme: dark;
}
```

The web uses slightly lighter text levels than the apps (0.68 and 0.48 instead of 0.55 and 0.38), because marketing copy runs longer.

---

## 16. New app checklist

- [ ] One plain, capitalized name. Bundle ID `app.nimbi.<name>`. "<Name> by nimbi" in the About window.
- [ ] Lives at the edge (pill, notch or menu bar); `LSUIElement` unless it's document-based.
- [ ] Follows section 18: claims the notch or edge instead of drawing there unasked, has a menu bar fallback, and describes its island page in the page format with honest urgency levels.
- [ ] Uses the shared cloud (outline, skin, face, gaze, blink), unchanged.
- [ ] The app's states are mapped onto the moods in 3.3, written down in the app's README.
- [ ] Tokens from section 15. No new colors without adding them here first.
- [ ] Dark and Black themes; `textScale` and `pillScale` respected.
- [ ] Liquid Glass only on the pill or chrome on macOS 26+, with a flat fallback; panels solid.
- [ ] Every main action has a key and a `KeyHint`; shortcuts bound to physical key codes.
- [ ] Destructive and send actions sit behind the undo bar.
- [ ] Empty states, nudges and errors in the nimbi voice; checked against 12.2.
- [ ] Motion uses the section 9 tokens, pauses when hidden, and respects Reduce Motion.
- [ ] App icon follows 11.2 (one prop); menu bar glyph follows 11.3.
- [ ] Added to the website's Sky log (`index.html`, `#apps`) when it ships.

---

## 17. Known gaps in Relay

Places where Relay doesn't match this spec yet. Fix them when convenient. New apps follow the spec, not these.

1. **App icon.** Relay's icon is still the old white speech bubble with eyes (`scripts/make-icon.swift`). The standard is the cloud as a speech bubble with an amber badge (11.2).
2. **Amber dot.** The icon's dot is `#E8B04A`, not `amber` `#F2B33D`.
3. **Sound setting.** The chosen sound (`Appearance.soundName`) is saved but not used. `Notifier` always plays Tink or Pop.
4. **Island ownership.** Relay now claims the notch (18.2) and steps aside to its edge pill while another app owns it, but it still draws its own island and edge pill rather than publishing an island page (18.4); that waits for phase 2. It doesn't claim the edge yet either.

---

## 18. Shared surfaces

The notch and the screen edge are one slot each, and every nimbi app wants them. This section decides who gets them and how users move between apps. The interactive prototype is at https://claude.ai/artifact/4ywDfkMn4TruVjTcuQ2SL9 (private to the owner).

### 18.1 Surfaces

| Surface | Shared? | Rule |
|---|---|---|
| **Menu bar** | No | Every app may have its own template glyph (11.3). It's every app's fallback. |
| **Notch island** | Yes | One island for all nimbi apps. Apps appear as pages in it. |
| **Edge pill** | Yes | Same rules as the island. Each app's section stacks in the column, in install order. |
| **Toasts** | Yes | Only through the owner of the island or pill, so two toasts never overlap. |

A nimbi app never draws its own window at the notch or the edge when another nimbi app might be there. It goes through the owner.

### 18.2 Phase 1: claim and fall back

Until the shared island exists in `NimbiKit`:

- **Claim:** the app posts a distributed notification, `app.nimbi.surface.claim`, with the surface (`notch` or `edge`) and its bundle ID. It listens for other claims.
- **Owner:** the owner of each surface is a user setting, shared through the app group `group.app.nimbi`. The default owner is the first nimbi app installed.
- **Everyone else falls back:** apps that don't own the surface use their menu bar glyph instead. An app whose home is the pill (Relay) waits at the screen edge instead. Show "Notch is used by Relay" in settings, with a one-click switch. Picking the notch in an app's own dock setting is the same switch.
- **Only the user moves it:** at launch an app takes a surface only when nobody owns it. The one-click switch (`SurfaceClaim.take()`) is the only way to take it from another app; the app that took it offers to give it back to the previous owner.
- **One glyph at a time:** while an app is at the notch, its menu bar glyph may step aside, since the island already shows it.
- **No island yet, no claim:** an app with nothing to draw at a surface never claims it and offers no switch, since taking the surface would only push the owner out. Its settings still name the owner ("Notch is used by Relay") and say where the app lives instead ("Skyline stays in the menu bar"). If it ever ends up as the owner, it offers to let the surface go.
- Ownership changes take effect live. Nothing requires a relaunch.
- **The code:** NimbiKit's `NotchOwnership` (owner, the switch and its words) and `NotchIsland` (the window, hover timing, keys and a panel hanging from it). Skyline drew the first app island; Tempo is the second.

### 18.2a Swiping between apps' own islands (built)

Every app keeps its own island at the notch; a swipe moves the notch from one app to the next. This is what's built (12 Oct 2026), and it replaces the single-host island of 18.3 for now: the user wants each app's notch to stay its own, and Relay's notch to stay exactly as it is.

- **The ring:** the nimbi apps a swipe goes through are the ones running that can be at the notch, in install order. Relay comes first while it runs with its pill set to the notch; then every app with a NimbiKit island, in the order they first launched (`islandApps` in the app group).
- **A swipe hands the notch over:** a two-finger swipe, a drag or ← → on the open island (18.6's thresholds) makes the next app the owner, as the one-click switch does, so it sticks. The leaving page drifts out (18.8), its island lingers 0.3 s under the arriving one so the notch never shows a gap, and the next app's island opens at once with its page drifting in from that side. At either end the page only stretches and springs back.
- **⌃⌥← / ⌃⌥→** move the notch from anywhere. Every island app registers them; only the first running one acts.
- **Dots (18.7):** island apps draw the page dots (open) and 4 pt mini dots under the glance (closed), one per app in the ring; an app that needs you glows amber and pulses. Clicking a dot hands the notch to that app.
- **Relay, unchanged:** Relay draws its own notch and has no dots. While Relay has the notch, the first island app watches for a two-finger swipe over Relay's island (armed once the pointer enters Relay's collapsed island, kept while it stays over the open dashboard's area) and hands the notch on. Relay already steps aside when another app takes the notch, and comes back when it's handed to it.
- **Not yet:** a page that needs you doesn't come to the front on its own (18.5): that would move the notch without the user. Its amber dot says so instead.
- **The code:** NimbiKit's `NotchRing` (the ring, hand-off, ⌃⌥← →, the watcher over Relay's island) and `NotchIsland` (swipes, drags, the drift and the dots). Pages mark their cloud and text with `.islandDrift(.cloud)` and `.islandDrift(.text)`.

### 18.3 Phase 2: the shared island

On hold: see 18.2a. Kept here as the long-term option.


- **One host.** The first nimbi app running hosts the island and draws every page. When it quits, another running nimbi app takes over within 1 s. No separate host app to install.
- **Pages,** one per app, in install order. Order never changes because of urgency.
- **Apps send data, not views.** Each app publishes its page in the format below over XPC. The host renders it with the shared components. Apps can't draw arbitrary UI into the island; this keeps every page consistent.
- **Depth stays in the app.** Page actions open the app's own panel, drawn by the app's process, hanging below the island (18.9).
- **Distribution:** Developer ID, one team ID, a shared app group. Not the Mac App Store sandbox.

### 18.4 Page format

| Field | Type | Limits |
|---|---|---|
| `appID` | bundle ID | |
| `name` | string | the app name, for example "Relay" |
| `mood` | one of the moods in 3.3 | |
| `prop` | the app's icon prop (11.2) | for example the speech-bubble tail, rain |
| `glance` | glyph + short text | at most 14 characters, for example "1 asking", "☂︎ 18°". Shown in the closed island. |
| `title` | string | at most 28 characters, for example "18° · rain in 20 min" |
| `subtitle` | string | at most 60 characters |
| `actions` | up to 2 × (label, key hint, action ID) | the first may be primary (white) only when urgency is `needsYou` |
| `detail` | one building block | `rows` (up to 3 glyph + text lines), `bars` (up to 12 values with axis labels), `ring` (one progress value), or none |
| `urgency` | `none` · `notice` · `needsYou` | see 18.5 |
| `toast` | string, optional | at most 24 characters, only with `needsYou` |

### 18.5 Urgency rules

| Urgency | Island closed | Island open on another page | Island open on this page |
|---|---|---|---|
| `needsYou` | The page comes to the front. The toast drops out, with the cloud below it. | The page does **not** change. The app's dot glows amber (`asking`) and pulses. | The page updates in place. |
| `notice` | Comes to the front only if no app is `needsYou`. No toast. | Updates quietly. No glow. | Updates in place. |
| `none` | Never moves. | Updates quietly. | Updates in place. |

- **A swipe beats data.** After the user swipes away from a page, it comes back on its own only if its urgency *rises*.
- **Seen clears.** A glowing dot clears when the user lands on that page.
- **Urgency is honest.** `needsYou` means the user must act. A weather update is never `needsYou`, at most `notice` ("rain in 20 min"). The one exception is a hazard the user should act on within three hours: thunder, storm-force wind (mean ≥ 20.8 m/s, Beaufort 9) or heat of 35 °C or more. Rain, snow, cold and everything else stay at `notice` or below.
- **Most urgent first in the closed island.** It shows the glance of the most urgent page; ties go to the page last viewed.

### 18.6 Navigation

| Input | Behavior |
|---|---|
| Two-finger horizontal swipe | Only when the island is open and the motion is more horizontal than vertical. Accumulate `deltaX`; past 46 pt, move one page. Then lock until the gesture is quiet for 220 ms, so one swipe moves exactly one page. |
| Drag (mouse, pen) | The page follows the pointer, stretching at the ends (30% resistance). On release, commit if dragged more than 18% of the island width or faster than 0.45 pt/ms; otherwise spring back. Never drag from a button. |
| ← / → | When the island has focus. ⌃⌥← / ⌃⌥→ from anywhere. |
| Page dots | Click to jump. Each dot is a tab with the app's name as its label, plus "needs you" when it glows. |
| Esc | Close the panel, then the island. |
| Hover | Opens after 0.2 s, closes 0.6 s after the pointer leaves (0.9 s from an open panel). Clicking opens immediately. |

There is only one horizontal gesture layer. Inside an app's own panel, paging uses keys (J / K) or buttons, never a second swipe.

### 18.7 Visual spec

**Closed island:** the width of the notch plus two wings, about 336 × 32 on a 184 pt notch, pure black with concave ears. The closed island hides the menu bar items under it, so keep the wings no wider than their content needs (Skyline: 60 pt; Relay: the notch's height plus 4, at least 36).
- Left wing: the current page's cloud at 24 pt, with its prop.
- Right wing: the glance (12 medium, tabular numbers), then mini dots. Dots are 4 pt: the current one white, the others white 0.3, an urgent one `asking` with a glow.

**Open island:** 580 × 222, bottom radius 30.
- The page fills a 150 pt band below the notch: cloud at 92 pt, then the app name (11 mono uppercase, faint), title (26 semibold), subtitle (13 dim), actions (pill buttons with key hints), then the detail block at 132 pt wide.
- Dots sit 12 pt from the bottom. Inactive dots are 6 pt; the current one is a 16 × 6 white capsule.

**Panel below:** the app's own panel hangs flush from the island. Same width, flat top, bottom radius 30. The island's bottom radius goes to 0 while it's open.

### 18.8 Motion: Drift

Page changes use **Drift**: pages move like clouds at different heights. For each page at offset `o` from the current position (−1 … 1):

| Layer | Transform |
|---|---|
| Page | `translateX(o × 0.55 × width)`, opacity `1 − 1.15·|o|` |
| Cloud | an extra `translateX(o × 0.5 × width)`, `translateY(−10·|o|)`, `scale(1 − 0.18·|o|)` |
| Text | an extra `translateX(o × 0.15 × width)` |

- **Spring:** about stiffness 190 and damping 22.5, close to `spring(response: 0.45, dampingFraction: 0.8)`. Drags drive the position directly; releasing hands it to the spring with the drag's velocity.
- **Island opening and closing:** width and height over 0.5 s with a slight overshoot, matching `islandOpen` (9.2). Page content fades in 0.08 s after the shape.
- **Panel:** unrolls from the island's bottom edge (`scaleY` from 0), spring 0.45 s.
- **Reduce Motion:** page changes are instant crossfades, and the island and panel appear without scaling.

### 18.9 Hand-off to the app

- An action ID goes back to the app that owns the page.
- The app opens its own panel and positions it under the island, using the island's frame from `NimbiKit`.
- The panel follows the app's normal component rules (section 8), with an undo bar for sends.
- While a panel is open, the island stays open on that page. Swiping to another page closes the panel first, so a panel never hangs under the wrong app.
