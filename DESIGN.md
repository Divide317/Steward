---
name: Steward
description: A pixel game board on a table; every settler's question is a card dealt into your hand.
colors:
  ink: "#050a14"
  table: "#0d1830"
  panel: "#101d33"
  raised: "#142640"
  line: "#1f3657"
  plinth: "#081122"
  ice: "#e8f1ff"
  dim: "#a8bad2"
  mute: "#8197bb"
  cyan: "#4de3ff"
  cyan-hover: "#8beeff"
  gold: "#ffd166"
  coral: "#ff5d8f"
  good: "#8fe0a8"
  critical-face: "#24152a"
  coral-quiet: "#5a2c41"
  good-quiet: "#2c5a45"
  wire-off: "#2a3b55"
  suit-food: "#9bcf5a"
  suit-health: "#f0736a"
  suit-ecology: "#3fbf9a"
  suit-knowledge: "#6fa8f5"
  suit-cohesion: "#e9b44c"
  suit-infrastructure: "#9fb0c8"
  suit-safety: "#f08a4b"
  suit-personal: "#c79bf2"
typography:
  score:
    fontFamily: "Silkscreen, VT323, ui-monospace, monospace"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0px"
  display:
    fontFamily: "Silkscreen, VT323, ui-monospace, monospace"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "2px"
  headline:
    fontFamily: "Silkscreen, VT323, ui-monospace, monospace"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "2px"
  title:
    fontFamily: "Silkscreen, VT323, ui-monospace, monospace"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "1px"
  body-lead:
    fontFamily: "VT323, ui-monospace, monospace"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.1
  body:
    fontFamily: "VT323, ui-monospace, monospace"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.15
  label:
    fontFamily: "VT323, ui-monospace, monospace"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "1px"
rounded:
  none: "0px"
spacing:
  frame-gap: "2px"
  sm: "8px"
  md: "12px"
  lg: "24px"
  gutter-phone: "14px"
  gutter: "28px"
  gutter-wide: "44px"
components:
  button:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ice}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "11px 18px"
  button-hover:
    backgroundColor: "{colors.raised}"
  button-primary:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "11px 18px"
  button-primary-hover:
    backgroundColor: "{colors.cyan-hover}"
  button-ghost:
    textColor: "{colors.dim}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "11px 18px"
  button-ghost-hover:
    textColor: "{colors.ice}"
  tool-button:
    backgroundColor: "{colors.table}"
    textColor: "{colors.dim}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "36px"
    padding: "0 12px"
  tool-button-hover:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ice}"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ice}"
    rounded: "{rounded.none}"
    padding: "12px 12px 10px"
    width: "172px"
    height: "196px"
  card-lead:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ice}"
    width: "220px"
    height: "230px"
  card-critical:
    backgroundColor: "{colors.critical-face}"
    textColor: "{colors.ice}"
  dialog:
    backgroundColor: "{colors.table}"
    textColor: "{colors.ice}"
    rounded: "{rounded.none}"
    padding: "22px 24px 18px"
    width: "680px"
  sheet:
    backgroundColor: "{colors.table}"
    textColor: "{colors.dim}"
    rounded: "{rounded.none}"
    padding: "30px 32px 28px"
    width: "580px"
  option:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.dim}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "11px 14px 11px 10px"
  option-hover:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ice}"
  input:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ice}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  chip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.good}"
    rounded: "{rounded.none}"
    padding: "3px 6px"
  key-cap:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cyan}"
    typography: "{typography.label}"
    padding: "1px 6px"
---

# Design System: Steward

## Overview

**Creative North Star: "The Pixel Tabletop"**

The screen is a table at night with a pixel board game laid on it. The colony is the board, ring-framed in the centre; its score track runs round the frame in gold pips; the world's measures stand as segmented tracks beside it; the settlers' questions are playing cards fanned along the bottom edge, the most urgent one raised and largest. A pixel sky band sits across the top and carries the lettering, the day and the clock. Nothing here is a panel of a dashboard: every surface is a physical game piece (a board, a card, a slip, a token, a sheet) placed on the table.

Every piece is built the same way: a square face, a 2px gap of ink, a hard coloured ring, and on the pieces that sit proud of the table a hard plinth beneath. There are no rounded corners, no blurred shadows and no eased motion; things are drawn on a grid and move in steps. Two pixel faces carry all text, Silkscreen for lettering and VT323 for reading, with font smoothing switched off. The canvas board and sky are rendered pixelated and draw their pieces as flat blocks outlined in ink.

Colour is semantic and sparing against the navy table. Cyan is the player's own signal, gold is reach and insight, coral is reserved for what is critical or lost, and each question topic owns one suit colour that follows it from the card's ring to its corner icon to its measure track.

**Key Characteristics:**
- One frame recipe for every piece: face, 2px ink gap, hard ring, hard plinth.
- Square everywhere; the radius scale has one step and it is zero.
- Pixel type with smoothing off; Silkscreen only at multiples of 8px.
- Stepped motion (`steps(4, end)`), stepped blinks, no easing curves.
- Quantities are counted pieces: ten-segment tracks, pips, tokens, never smooth bars.
- Authored 8 by 8 pixel icons that inherit the colour of what they mark.
- A dark-only world (`color-scheme: dark`).

## Colors

A navy table lit by three signals and eight suits; nearly all of the screen is table, panel and ink, so any colour that appears means something.

### Primary
- **Signal Cyan** (`cyan`, #4de3ff): the player's own signal. The ring on the board, default cards, buttons, dialogs and sheets; focus outlines; lit compute tokens; the selected speed; links; key caps; text selection; the caret. Its hover lift on the primary button is **Lit Cyan** (`cyan-hover`, #8beeff).

### Secondary
- **Reach Gold** (`gold`, #ffd166): reach and insight. The score numeral, the lit pips of the reach track round the board, the day plate, training levels, the insight count, council cards, the Ark, and stage-up sheets.

### Tertiary
- **Critical Coral** (`coral`, #ff5d8f): critical questions, failing measures, loss, the cut link, errors, and the game-over sheet. Its dimmed ring for a bad outcome already past or a flagged option is **Quiet Coral** (`coral-quiet`, #5a2c41); a critical piece's face is **Critical Face** (`critical-face`, #24152a).
- **Gain Green** (`good`, #8fe0a8): a gain. Outcome slip rings, up chips, good tile marks. Its dimmed ring in the log is **Quiet Green** (`good-quiet`, #2c5a45).
- **The eight suits**, one per question topic, used for that topic's card ring, corner icons, timer bar, dialog ring and measure track: Food (`suit-food`, #9bcf5a), Health (`suit-health`, #f0736a), Ecology (`suit-ecology`, #3fbf9a), Knowledge (`suit-knowledge`, #6fa8f5), Cohesion (`suit-cohesion`, #e9b44c), Infrastructure (`suit-infrastructure`, #9fb0c8), Safety (`suit-safety`, #f08a4b), Personal (`suit-personal`, #c79bf2).

### Neutral
- **Ink** (`ink`, #050a14): the 2px gap inside every frame, the well of inputs, unlit segments and tokens, chips, and text on light faces. Also the outline of every piece drawn on the canvas.
- **Table** (`table`, #0d1830): the page, and the face of dialogs, sheets, the drawer and the sky's plates. A soft vignette darkens it toward the edges.
- **Panel** (`panel`, #101d33): a card face and any piece lying on the table or the board.
- **Raised** (`raised`, #142640): a hovered, open or selected surface.
- **Line** (`line`, #1f3657): quiet rings, unlit pips, scrollbars, and the ring of a card a sub-agent holds.
- **Plinth** (`plinth`, #081122): the hard shadow a frame casts on the table. Used for nothing else.
- **Ice** (`ice`, #e8f1ff): primary text. **Dim** (`dim`, #a8bad2): secondary text and labels. **Mute** (`mute`, #8197bb): tertiary text, roles, hints, placeholders.
- **Unlit Wire** (`wire-off`, #2a3b55): a dead wire in a reconnection puzzle and a dead mast or marker on the board.

### Named Rules
**The Three Signals Rule.** Cyan is you, gold is reach and insight, coral is critical or lost. None of the three is ever used as decoration or to mean anything else.

**The Suit Rule.** A topic has exactly one colour, passed down as `--suit` (pieces) or `--c` (tracks), and it colours the ring, the corner icons and the timer together. A critical question overrides its suit with coral; a council question with gold.

**The Quiet Ring Rule.** A piece that is not asking for anything wears a `line` ring. Colour on a ring is a claim on the player's attention.

## Typography

**Display Font:** Silkscreen (with VT323, ui-monospace, monospace)
**Body Font:** VT323 (with ui-monospace, monospace)
**Label/Mono Font:** VT323, uppercased and tracked

**Character:** Two bitmap faces from the same era: Silkscreen is the blocky lettering stamped on the box and the board, VT323 is the terminal voice the settlers and the Steward speak in. Both are self-hosted from `public/fonts` under the SIL Open Font License, weight 400 only, with `-webkit-font-smoothing: none`.

### Hierarchy
- **Score** (Silkscreen 400, 64px, line-height 1, tabular numerals): the reach numeral at the board's right. Steps down to 48px and 32px as the number lengthens, and to 24px on phones.
- **Display** (Silkscreen 400, 40px, line-height 1, 2px tracking, uppercase): sheet titles and the STEWARD lettering (which tracks at 4px). 32px under 1180px wide, 24px on phones.
- **Headline** (Silkscreen 400, 24px, line-height 1, 2px tracking, uppercase): drawer titles.
- **Title** (Silkscreen 400, 16px, line-height 1.1, 1px tracking, uppercase): buttons, the day plate, event, slip and option-group titles.
- **Body Lead** (VT323 400, 28px, line-height 1.1): the question being asked, in the dialog. 23px on phones.
- **Body** (VT323 400, 20px, line-height 1.15): everything read. Names run a step larger (21px, 26px in the dialog head); supporting lines a step smaller (19px, 18px, 17px). Sheet paragraphs cap at 60ch. 19px base on phones.
- **Label** (VT323 400, 18px, line-height 1, 1px tracking, uppercase): measure names, tool names, field labels, the category tag, key caps. On phones labels drop their capitals and run at 17px.

### Named Rules
**The Eight Grid Rule.** Silkscreen is set only at multiples of 8px (16, 24, 32, 40, 48, 64); that is its pixel grid, and off it the letters smear.

**The One Weight Rule.** Weight is always 400. Emphasis inside running text is a change of colour (ice inside dim, gold for a count), never bold.

**The Counted Numbers Rule.** Any number that changes while you watch uses tabular numerals.

## Layout

The page is a fixed, non-scrolling table: three rows filling `100dvh` (sky, table, hand) with `overflow: hidden`. The sky is a 112px band. The table row is a three-column grid, `210px | 1fr | 210px` with a 28px gap: measures at left, the board in the centre, reach at right. The board sits inside 24px of padding so the reach track can run round its frame in that margin. The hand row centres the compute tokens and the fan of cards under the board, bottom-aligned.

The side gutter is the single spacing token (`--gutter`, 28px). Within pieces the rhythm is tight and even-numbered: 8px and 12px gaps and padding inside cards, slips and plates; 18px to 24px padding in the drawer and dialogs; 30px in sheets. Frames need room for their rings, so pieces are spaced by at least the ring's reach (12px between slips, 16px between log entries).

The hand is a fan: cards overlap by a computed negative margin, rotate up to 9 degrees about their bottom centre and drop up to 14px toward the edges, and the lead card stands upright, 14px higher and larger. A hovered or focused card straightens and rises 16px in steps.

Responsive behaviour is structural, in three steps:
- **1500px and up:** side columns widen to 240px, gaps to 40px, gutters to 44px.
- **1180px and down:** side columns narrow to 168px, tool buttons collapse to icons, lettering and score step down one size.
- **760px and down:** gutter 14px; the sky shrinks to 64px; the table stacks as measures strip (four columns), board, reach line, tools (five equal columns with short labels); the hand becomes a horizontal scroll-snap row of upright cards (150 by 168px, lead 178 by 178px); the drawer goes full-screen; dialogs and sheets dock to the bottom edge and respect the safe-area inset.

## Elevation & Depth

Depth is structural and hard-edged: no blur anywhere. A piece's height above the table is told by three things, all in one `box-shadow`: the ink gap, the width of its ring, and the drop of its plinth. Rings are spread-only shadows, so they take no layout space and never round. The plinth is a solid offset in `plinth`, the same colour whatever the ring. Scrims behind dialogs are flat ink at 72% (86% behind sheets). The only soft gradient in the system is the table's edge vignette.

The hard plinth is this world's native device, not a defect: the detector's `hard-offset-shadow` rule is ignored for `public/style.css` and `public/index.html` in `.impeccable/config.json`, by direction.

### Shadow Vocabulary
- **Quiet ring** (`box-shadow: 0 0 0 2px var(--ink), 0 0 0 4px var(--line)`): plates and resting pieces that lie flat: the day plate, speed control, tool buttons, log entries, options, ghost buttons. Swap `line` for cyan on hover or selection, for `good` or coral on outcome slips.
- **Ring and plinth** (`box-shadow: 0 0 0 2px var(--ink), 0 0 0 5px var(--cyan), 0 5px 0 5px var(--plinth)`): pieces standing on the table: the board, the drawer, buttons, event cards. Cards use the same with a 6px drop and their suit as the ring.
- **Lifted ring** (`box-shadow: 0 0 0 2px var(--ink), 0 0 0 6px var(--suit), 0 8px 0 6px var(--plinth)`): dialogs and sheets, the highest pieces.
- **Well** (`box-shadow: 0 0 0 2px var(--line)`): inputs, selects, unlit tokens and puzzle tiles, on an ink face. Turns cyan on focus.
- **Solid key** (`box-shadow: 0 0 0 2px var(--ink), 0 5px 0 2px var(--plinth)`): the primary button, a filled cyan block with no coloured ring.
- **Lettering split** (`text-shadow: -3px 0 0 var(--cyan), 3px 0 0 var(--coral), 0 4px 0 var(--table)`): the STEWARD lettering only.

### Named Rules
**The Frame Rule.** Every frame is face, 2px ink gap, hard ring. Frames are drawn with `box-shadow` spread, never with `border`.

**The Plinth Rule.** Only pieces that stand on the table cast a plinth, and the plinth is always straight down, solid, and in `plinth`. A pressed button sinks 2px and its plinth shortens by the same.

**The Height Rule.** Ring width is height: 4px lies flat, 5px stands, 6px is lifted above everything.

## Shapes

Square, without exception: no `border-radius` is declared anywhere. Form comes from the grid. Icons are authored on an 8 by 8 grid (`public/src/icons.js`), rendered as crisp-edged SVG rects that inherit `currentColor`, shown at 16px by default and at 14, 18, 24 or 28px where a piece calls for it. Quantities are rows of square cells with a 2px gap. Puzzle tiles are square wells whose wires are rectangles. The canvas draws buildings, settlers and markers as flat rectangles on a unit grid, each outlined in ink with a flat translucent ink shadow, and both canvases are scaled with `image-rendering: pixelated`.

## Components

Each component is a game piece. Motion throughout is stepped: pieces arrive over 0.3s and cards move over 0.2s on `steps(4, end)`; alarms and warnings blink on two-step loops; `prefers-reduced-motion` collapses all of it.

### Buttons
- **Shape:** square block, Title type, 11px by 18px padding, optional 16px icon at a 10px gap.
- **Default:** panel face, ice text, ring and plinth in cyan. Hover lifts the face to raised; active sinks 2px; disabled is 45% opacity.
- **Primary:** solid cyan face, ink text, ink gap and plinth only. Hover goes to Lit Cyan. One per piece: Send in the dialog, the single action on a sheet.
- **Critical / Gold:** panel face with a flat 4px coral or gold ring and tighter padding (9px by 12px), for the action on an event card (repair the link, launch) and for training.
- **Ghost:** transparent face, quiet ring, dim text that turns ice on hover.
- **Icon button:** 36px square, quiet ring, dim icon; and the inline **link**, cyan underlined VT323 at 18px.
- **Key cap:** an ink chip with cyan Label text, set inside the button or option it triggers.

### Chips
- **Style:** ink face, no ring, 17px VT323, 3px by 6px padding. Green text for a gain, coral for a loss. Used only to itemise what an outcome changed.
- **Count badge:** gold face, ink Label text, 2px ink ring, pinned to the corner of a tool button.

### Cards / Containers
- **Question card:** 172 by 196px panel face, 12px padding, suit ring with a 6px plinth. Top: corner suit icon (18px) beside the asker's name (21px) and role (17px mute). Middle: the question, dim, clamped to four lines. Foot: state text in cyan and the suit icon again, rotated 180 degrees like a playing card. Bottom edge: a 6px ink timer bar filled in the suit colour, blinking coral when late.
- **Lead card:** 220 by 230px, upright, raised, question in ice and clamped to five lines.
- **States:** critical (coral suit, Critical Face, an extra warning icon); council (gold suit); held by a sub-agent (darker face, `line` ring, content at 55%); processing (state text blinks); link cut (greyscale, dimmed, inert).
- **Event card:** a panel slip on the board with a 24px icon, Title name, dim subline and one action. Coral ring for a crisis (the ring blinks while the link is cut), gold for the Ark, which carries a gold segmented progress track.
- **Outcome slip (toast):** panel face, 4px ring in green or coral, Title heading, dim line, chips. Dealt in from below at the board's bottom-left corner.
- **Log entry and department block:** panel face, quiet ring (Quiet Green or Quiet Coral for an outcome), 10px to 12px padding.
- **Dialog:** table face, up to 680px wide, lifted ring in the question's suit. Head row: 28px suit icon, name at 26px, role, category tag in the suit colour, trust track pushed right. The question is set in Body Lead.
- **Sheet:** table face, up to 580px wide, lifted ring in cyan, coral (alarm) or gold. Display title, a tinted meta line beneath it, dim paragraphs, one primary button.
- **Drawer:** table face with ring and plinth, 440px wide, pinned to the right below the sky; slides in 24px in steps.

### Inputs / Fields
- **Style:** ink well with a 2px `line` ring, ice text, mute placeholder, no border. The reply field is 21px VT323 with a cyan caret.
- **Focus:** the well's ring turns cyan. Everything else focusable takes the global outline (2px solid cyan, 3px offset).
- **Select:** the same well with a cyan pixel chevron drawn from two hard-stop gradients.
- **Choice row:** a panel piece with a quiet ring and a square 16px radio well; when chosen the face goes raised, the ring cyan and the well fills cyan.
- **Written-reply option:** a full-width panel row with a key cap in a 22px left column; hover or focus raises the face, turns the ring cyan and inverts the key cap. A flagged option wears a Quiet Coral ring and a coral warning line.
- **Error / Disabled:** errors are coral 18px text beside the control; disabled controls drop to 45% to 55% opacity.

### Navigation
- **Tools:** five buttons in the sky beside the clock: 36px high table-faced plates with a quiet ring, a cyan 16px icon and a dim Label. Hover or open: raised face, ice text, cyan ring. Icons only under 1180px; on phones a five-column row of stacked icon-over-short-label plates on a panel face.
- **Clock:** the day plate (gold Title type on a table face, quiet ring) and a four-button segmented speed control, 40 by 36px cells; the active cell is solid cyan with an ink icon.

### Tracks, Pips and Tokens
- **Measure track:** a Label name, a 22px value, and ten 10px-high segments at a 2px gap. Unlit segments are ink with a 1px `line` ring; lit ones take the measure's suit colour with a 1px ink ring. A failing measure turns its name and value coral and blinks its lit segments.
- **Reach track:** 10px pips running clockwise round the board's frame in the 24px margin, 3px apart; unlit `line`, lit gold, the goal pip hollow ink with a 2px gold ring.
- **Compute tokens:** a four-column grid of 22px squares with a 7px gap, each holding a 14px icon. Spent: ink well with a `line` ring. Charged: solid cyan with an ink icon. Half: a hard vertical split of cyan and ink.
- **Level pips:** 12px squares, gold when earned.

### The Board and Sky (canvas)
Both are pixelated canvases. The sky is banded flat colour by time of day with a square-pixel sun or moon and block clouds; the board draws terrain, buildings, settlers and question markers as flat rectangles outlined in ink. Canvas colours reuse the system's tokens for anything that carries meaning (cyan for the mast and trust, coral and green for tile marks, gold for council markers, suit colours for topics); weather and crisis overlays are flat alpha washes and 1px ink scanlines.

## Do's and Don'ts

### Do:
- **Do** build every new piece from the frame recipe: face, 2px ink gap, hard ring via `box-shadow` spread, and a straight-down `plinth` drop only if it stands on the table.
- **Do** pick ring width by height: 4px flat, 5px standing, 6px lifted.
- **Do** set Silkscreen at 16, 24, 32, 40, 48 or 64px, uppercase, tracked 1px to 2px; set everything read in VT323.
- **Do** carry a topic's colour through `--suit` so ring, icons and timer change together.
- **Do** show quantities as counted square cells: ten segments, pips or tokens.
- **Do** draw new icons on the 8 by 8 grid in `public/src/icons.js`, one weight, inheriting `currentColor`.
- **Do** move things with `steps()` timing over 0.2s to 0.3s and blink with two-step loops; keep the reduced-motion collapse.
- **Do** keep text on the table at `ice`, `dim` or `mute`, and text on cyan or gold faces at `ink`.

### Don't:
- **Don't** round a corner. There is no radius in this system.
- **Don't** blur a shadow or use a glow; depth is ring width and a hard plinth.
- **Don't** draw a frame with `border`; rings must not take layout space.
- **Don't** ease or spring motion; nothing in the build uses a curve.
- **Don't** use coral for anything that is not critical, failing or lost, or gold for anything that is not reach, insight, council or the Ark.
- **Don't** use bold; the faces ship in one weight and emphasis is colour.
- **Don't** set Silkscreen off its 8px grid, or use it for running text.
- **Don't** use a smooth progress bar where a counted track would do.
- **Don't** bring in an icon font, emoji or outline icon set; icons are the authored pixel set.
- **Don't** add a light theme; the world is declared dark-only.
