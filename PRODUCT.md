# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Casual browser players** who arrive from a shared link with no context and decide within the first minute whether to keep playing.
- **Friends and reviewers** the owner sends it to, including people judging it as a portfolio piece, who look for polish and personality.

It must be properly playable on a phone as well as on a desktop or laptop.

## Product Purpose

Steward is a browser simulation game in which the player is the AI assistant a newly founded colony relies on. Settlers walk around a small town and bring questions; the player's reply changes what they do, and what they do changes the world. Good stewardship grows the settlement from Town to Borough, City, Metropolis and World-State and earns more of the population's reliance; poor stewardship lets the world die. The long arc ends with an Ark to a new planet, where the game begins again on a harsher world.

Success: a newcomer understands within a minute that they are the AI and that their words have consequences, and plays long enough to see the town grow or fail.

## Positioning

The player is not a mayor or a god but the assistant people ask. Progression is measured by usage: how many people rely on Steward, earned through the effect its answers have on their lives. The pleasing answer and the good answer are often different, and the game makes that difference felt through consequences rather than scores.

## Operating Context

- Played in a desktop or phone browser, usually in short sessions; the world saves in the player's browser and resumes on return.
- Hosted on Vercel's free Hobby plan, from the GitHub repository `Divide317/Steward`.
- Each player chooses how typed replies are judged: text matching (no AI), free Google Gemini, or their own Claude key.

## Capabilities and Constraints

- Plain static HTML, CSS and JavaScript modules served from `public/`, a canvas world map, and two small serverless functions (`api/`). No framework or build step.
- About 100 questions across eight topics (Food, Health, Ecology, Knowledge, Cohesion, Infrastructure, Safety, Personal), plus council decisions, critical questions and crisis questions.
- Seven world measures: Food, Health, Ecology, Knowledge, Cohesion, Infrastructure, Safety.
- Compute as the reply resource; written replies cost 1, typed replies cost half and take 10 seconds to process.
- Crises (ion storm, flash flood, groundquake, marsh fever, wildfire); three cut the link until a reconnection puzzle is solved (cable rotation, pipe rotation, relay switches).
- Sub-agents per department from City stage; training per topic paid in insight.
- Must cost the owner nothing to run: no paid API key on the server, free hosting only.
- Saves live in each player's browser only; there are no accounts.

## Brand Commitments

- The name is **Steward**.
- Tone: serious stakes in the questions and their consequences, played straight with no jokes at the settlers' expense; playful touches are welcome in the world around them.
- Copyright © 2026 Cedric Antony Joseph, all rights reserved (`LICENSE`).
- Visual blueprint the owner named: Krillion (krillion.io). Use it as the model for the look, changed to fit Steward rather than copied.

## Evidence on Hand

- All question, outcome, crisis and stage copy in `public/src/content.js` and `public/src/content-more.js`.
- No player counts, reviews, testimonials or press exist; none may be invented.

## Product Principles

1. Consequences over scores: show what a reply led to before showing any number.
2. The world is the feedback: the town's growth, decline and crises should be readable on the map itself.
3. A newcomer must grasp the premise in the first minute without a manual.
4. Free to run, forever: no feature may require the owner to pay.
5. Playable anywhere: a phone session is a real session, not a degraded one.
