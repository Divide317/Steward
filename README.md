# Steward

A browser game where you are the AI a new world relies on.

You are the colony ship's assistant, rehoused in a mast at the centre of the only town on a new planet. Twenty-four people live there. They bring you questions, what you say changes what they do, and what they do changes the world. Help them well and more of them rely on you, the town grows, and you are trusted with more of it. Fail them and the world dies.

## Running it

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install
node server.js
```

Then open http://localhost:5173.

## How to play

- **Answer questions.** People with a `?` above them have a question. Click them, or the question in the inbox.
- **Two ways to reply.** A written reply costs 1 compute and lands at once. Typing your own costs half, takes 10 seconds to process, and only one can be in the works at a time.
- **Watch the seven measures.** Food, Health, Ecology, Knowledge, Cohesion, Infrastructure and Safety all wear down every day. If they collapse, so does the town.
- **Grow your reach.** Reach is population times the share of people who rely on you. It carries the settlement from Town to Borough, City, Metropolis and World-State.
- **Critical questions.** A red `!` will not wait long. Leave it unanswered and the world takes the damage, not just your reputation.
- **Crises.** Storms, floods, quakes, fever and wildfire arrive without warning and bring a rush of life-or-death questions. Some cut you off entirely until you repair the link by solving a puzzle, while the world keeps taking damage.
- **Council.** From Borough on, the council brings decisions that move everyone at once.
- **Sub-agents.** From City on, you can hand whole topics to sub-agents, each following a directive you choose. They are right most of the time and never touch critical questions.
- **Training.** Replies that turn out well earn insight. Spend it to know a topic better: stronger good outcomes, a warning on the riskiest written reply, softer failures.
- **The Ark.** At planetary reach, the assembly asks whether to build it. Launch it and you begin again on a harsher world.

The pleasing answer and the good answer are not always the same one.

### Keys

| Key | Action |
|---|---|
| Space | Pause or resume |
| 1, 2, 3 | Game speed (outside a dialog), or pick a written reply (inside one) |
| Enter | Send a typed reply |
| Esc | Close a dialog |

## Typed replies and the judge

Typed replies are ruled on in one of two ways.

- **With an Anthropic API key:** Claude reads your reply and decides what the person does and what comes of it. Copy `.env.example` to `.env`, add your key, and restart the server. Each typed reply is one API call on your key.
- **Without a key:** a simple offline matcher finds the written reply your words most resemble and uses that outcome. It is rough. It cannot tell "use poison" from "don't use poison".

The key stays on the server. The server only ever serves the game's own files.

## Project layout

| File | What it holds |
|---|---|
| `server.js` | Local server and the Claude judge endpoint |
| `src/content.js` | Topics, stages, crises, training levels and the first set of questions |
| `src/content-more.js` | The wider question pool, critical questions and crisis questions |
| `src/game.js` | The simulation: people, questions, outcomes, crises, training, progression |
| `src/render.js` | The map |
| `src/ui.js` | The interface and main loop |
| `src/puzzle.js` | The reconnection puzzles |
| `src/judge.js` | The offline matcher for typed replies |

To add a question, copy an entry in `src/content-more.js`. Each has a topic, a minimum stage, the question, and three replies with their outcome, effects and how they land in the moment.

## License

Copyright © 2026 Cedric Antony Joseph. All rights reserved. See [LICENSE](LICENSE).

This code is published so it can be read. It is not open source: you may not copy, modify, redistribute or sell it without written permission.
