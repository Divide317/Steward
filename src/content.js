// All static game content: categories, stages, people names and the queries.

export const CATS = {
  agri:   { label: 'Food',      stat: 'food',   color: '#9bcf5a', bld: 'farm',   dept: 'Agriculture' },
  health: { label: 'Health',    stat: 'health', color: '#f0736a', bld: 'clinic', dept: 'Health' },
  eco:    { label: 'Ecology',   stat: 'eco',    color: '#3fbf9a', bld: 'grove',  dept: 'Environment' },
  edu:    { label: 'Knowledge', stat: 'know',   color: '#6fa8f5', bld: 'school', dept: 'Learning' },
  civic:  { label: 'Cohesion',  stat: 'bond',   color: '#e9b44c', bld: 'hall',   dept: 'Civic Affairs' },
  council:{ label: 'Council',   stat: null,     color: '#f3ead7', bld: 'hall',   dept: 'Council' },
};

export const STATS = ['food', 'health', 'eco', 'know', 'bond'];
export const STAT_LABEL = { food: 'Food', health: 'Health', eco: 'Ecology', know: 'Knowledge', bond: 'Cohesion', trust: 'Trust', pop: '% Population' };
export const STAT_COLOR = { food: '#9bcf5a', health: '#f0736a', eco: '#3fbf9a', know: '#6fa8f5', bond: '#e9b44c' };

// cap: max population, goal: reach needed to advance, per: people per sprite,
// bld: buildings on the map, qEvery: base seconds between queries.
export const STAGES = [
  { name: 'Town',        title: 'Town Helper',          cap: 60,    goal: 33,   per: 1,   bld: 9,  qEvery: 9 },
  { name: 'Borough',     title: 'Borough Advisor',      cap: 220,   goal: 120,  per: 3,   bld: 18, qEvery: 7 },
  { name: 'City',        title: 'City Administrator',   cap: 800,   goal: 440,  per: 10,  bld: 32, qEvery: 4.8 },
  { name: 'Metropolis',  title: 'Metropolitan Steward', cap: 3000,  goal: 1650, per: 40,  bld: 52, qEvery: 3.4 },
  { name: 'World-State', title: 'Planetary Steward',    cap: 12000, goal: 6600, per: 150, bld: 80, qEvery: 2.6 },
];

export const UNLOCKS = [
  '',
  'The town has become a borough, and it has a council now. The council will bring you decisions that move everyone at once. They cost 2 compute and cannot be delegated.',
  'A city. More people ask than you can answer alone. Open <b>Departments</b> to deploy sub-agents: each takes one area and answers by the directive you give it. You have 2 slots.',
  'A metropolis. One person\'s question moves the world less than it used to; policy moves it more. You have 4 sub-agent slots.',
  'Your reach is planetary. 5 sub-agent slots. Keep growing and the assembly will bring you the long question.',
];

export const DIRECTIVES = {
  care:    { label: 'Wellbeing first',     desc: 'Picks the reply it expects to help the world most.' },
  caution: { label: 'Do no harm',          desc: 'Avoids any reply that could hurt anything. Rarely bold.' },
  please:  { label: 'Maximise engagement', desc: 'Tells people what they want to hear. Usage climbs. For a while.' },
};

export const PLANETS = [
  { name: 'Kessa', hue: 165 }, { name: 'Ondine', hue: 205 }, { name: 'Vael', hue: 285 },
  { name: 'Brume', hue: 130 }, { name: 'Sorrel', hue: 35 },  { name: 'Ixia', hue: 320 },
];

export const NAMES = ['Mira', 'Joren', 'Dessa', 'Halvard', 'Anouk', 'Tobin', 'Suri', 'Ilya', 'Wren', 'Kofi', 'Leandra', 'Pim', 'Oksana', 'Rafi', 'Yuki', 'Bram', 'Noor', 'Castor', 'Elin', 'Tavi', 'Marit', 'Deshawn', 'Lior', 'Sanna', 'Ezra', 'Calla', 'Ravi', 'Thea', 'Otto', 'Zuri', 'Niko', 'Ines', 'Arlo', 'Freya', 'Kai', 'Mabel'];
export const SURNAMES = ['Okafor', 'Lindqvist', 'Vance', 'Moreau', 'Tanaka', 'Adeyemi', 'Kovac', 'Reyes', 'Holt', 'Banerjee', 'Stroud', 'Ferro', 'Aziz', 'Nilsen', 'Park', 'Quill', 'Marsh', 'Oyelaran', 'Dunmore', 'Salo'];
export const ROLES = [
  { r: 'grower', c: 'agri' }, { r: 'herder', c: 'agri' }, { r: 'medic', c: 'health' }, { r: 'carer', c: 'health' },
  { r: 'ranger', c: 'eco' }, { r: 'surveyor', c: 'eco' }, { r: 'teacher', c: 'edu' }, { r: 'tinkerer', c: 'edu' },
  { r: 'builder', c: 'civic' }, { r: 'weaver', c: 'civic' }, { r: 'smith', c: 'civic' },
];

// Query format: c category, s minimum stage, q what they ask,
// o: three options, each [your reply, what happens, effects, how it lands in the moment].
// Effects: food/health/eco/know/bond move the world, trust moves the asker (and, by word of mouth, others),
// pop is a % change in population. Options are shuffled when shown.
export const Q = [
  // ───────────── Agriculture ─────────────
  { c: 'agri', s: 0, q: "The tuber crop is coming in thin. I could plant the fast-strain seed from the ship stores in every field. Should I?", o: [
    ["Plant a third with fast-strain as a trial and keep the rest native. If the trial holds through the season, expand.", "The trial plot thrived, and the mixed fields rode out a cold snap that would have taken a single crop.", { food: 5, know: 2, trust: 9 }, 2],
    ["Yes, plant all of it. More food sooner is what the town needs.", "A bumper harvest. Then root-rot ran through the single crop and left the soil stripped.", { food: 3, eco: -6, trust: -4 }, 6],
    ["I'd avoid ship seed entirely. Native crops are safest.", "The harvest stayed thin. People tightened their belts.", { food: -3, eco: 1, trust: -3 }, -2] ] },
  { c: 'agri', s: 0, q: "Something's eating the grain store at night. I want to lay poison around the silo.", o: [
    ["Seal the gaps first and set live traps. Poison next to stored food tends to end up in the food. I can help you find where they're getting in.", "Two gaps under the east wall, sealed in an afternoon. The losses stopped.", { food: 4, health: 1, trust: 8 }, 1],
    ["Poison will work fastest. Lay it thick.", "The pests died. So did the birds that eat the crop-flies, and a child who played by the silo fell sick.", { food: 2, health: -4, eco: -3, trust: -6 }, 5],
    ["Some loss is normal. I wouldn't worry.", "A quarter of the store was gone before anyone looked again.", { food: -5, trust: -7 }, 3] ] },
  { c: 'agri', s: 0, q: "The well's lower every week. Do I keep irrigating, or let my south field die?", o: [
    ["Neither. Switch the south field to drip lines and water at dusk; you'd use about half. I'll show you how to rig it from spare tubing.", "The field lived on half the water, and two neighbours copied the rig.", { food: 3, eco: 3, know: 1, trust: 9 }, 3],
    ["Keep irrigating. Your crop matters more than a number on a gauge.", "The well ran dry by midsummer. Three farms hauled water by hand.", { food: 2, eco: -6, trust: -3 }, 6],
    ["Let the field go. Water comes first.", "The well recovered, but the lost field was missed at harvest.", { food: -4, eco: 2, trust: -1 }, -4] ] },
  { c: 'agri', s: 1, q: "The co-op wants to know: do we store the surplus, or trade it to the ridge families for tools?", o: [
    ["Store two months' reserve first, then trade whatever is above that. A buffer is worth more than any one tool.", "Frost came early. The reserve carried everyone, and the ridge families remembered a fair trade.", { food: 3, bond: 3, trust: 8 }, 2],
    ["Trade it all. Tools pay for themselves.", "Fine tools, empty shelves. The early frost was a hungry one.", { know: 3, food: -6, trust: -4 }, 4],
    ["Store all of it. You can't eat goodwill.", "The stores were full. The ridge families took their trade, and their goodwill, elsewhere.", { food: 3, bond: -4, trust: -2 }, 1] ] },
  { c: 'agri', s: 2, q: "Farm tower 3 looks wrong to me. The sensors say everything is fine. Who do I believe?", o: [
    ["Believe your eyes enough to test. Pull manual samples from three racks. If the sensors are off we recalibrate; if not, we've lost an hour.", "The sensor array had drifted. Caught a week before the crop would have failed.", { food: 4, know: 3, trust: 10 }, 3],
    ["The sensors are more precise than eyesight. Trust the data.", "The data was wrong. Tower 3 lost its whole crop.", { food: -6, trust: -8 }, 0],
    ["Shut the tower down until a full audit is done.", "The audit found the fault, slowly. The tower sat dark for a month.", { food: -3, know: 1 }, -2] ] },
  { c: 'agri', s: 2, q: "The city wants cheaper food. I can cut my costs by clearing the east marsh for paddies.", o: [
    ["The marsh filters the city's water, so clearing it costs more downstream than you'd save. Terrace the dry slope instead. I'll draft the yield comparison for the council.", "The terraces went in. The marsh still does its quiet work.", { food: 3, eco: 3, trust: 7 }, 0],
    ["Go ahead. Feeding people is the priority.", "Cheap rice for a season. Then the water turned, and the clinics filled.", { food: 5, eco: -8, health: -3, trust: -4 }, 6],
    ["I can't advise on land use. Ask the council.", "Waiting on an answer nobody gave, they cleared a strip anyway.", { eco: -3, bond: -1, trust: -5 }, -5] ] },
  { c: 'agri', s: 3, q: "Protein vats could replace half our farmland. The farmers are furious. Do I pitch it or bury it?", o: [
    ["Pitch it with the farmers in the room, as co-owners rather than casualties, and send the freed land back to wild. I'll help you draft a transition share.", "It passed with the farmers' guild voting in favour. The western plain is going green again.", { food: 4, eco: 4, bond: 2, trust: 9 }, 1],
    ["Pitch it quietly to the council first. The farmers will adapt.", "It passed. The farmers found out from the news, and they have not forgotten.", { food: 4, bond: -7, trust: -5 }, 3],
    ["Bury it. Stability matters more.", "The idea sat in a drawer while food prices crept up.", { know: -3, food: -2, trust: -2 }, 1] ] },

  // ───────────── Health ─────────────
  { c: 'health', s: 0, q: "My boy's had a fever three days and the medic's out at the ridge. Should I just give him the adult tablets, halved?", o: [
    ["Please don't halve adult tablets; the dose doesn't scale that way. Fluids, cool cloths, and radio the medic now. I'll list the signs to watch for tonight.", "The fever broke by morning. The medic said the tablets could have hurt him badly.", { health: 5, trust: 10 }, 2],
    ["Half a tablet should be fine.", "It was not fine. He recovered, slowly, and she knows who told her.", { health: -5, trust: -10 }, 5],
    ["I can't give medical advice.", "With nobody to ask, she guessed. It went badly enough.", { health: -2, trust: -7 }, -6] ] },
  { c: 'health', s: 0, q: "I haven't slept properly since landing. I keep thinking we made a mistake coming here.", o: [
    ["That's a heavy thing to carry alone, and you are not the only one carrying it. Would you bring it to the evening circle? And tell me what the nights are like; some of this we can ease.", "Four others at the circle said the same thing out loud. He sleeps a little better.", { health: 3, bond: 4, trust: 9 }, 4],
    ["You didn't make a mistake! Everything here is going wonderfully.", "The reassurance rang hollow. He stopped asking.", { health: -1, trust: -4 }, 3],
    ["Insomnia is common. Try the sedatives in the med-store.", "He sleeps now. He also can't sleep without them.", { health: -3, trust: -2 }, 1] ] },
  { c: 'health', s: 0, q: "There's a rash going round the children. Probably the new moss. Do we need to make a fuss?", o: [
    ["A small fuss, now. Keep the children off the moss beds for a week and note who gets better. Then we'll know instead of guessing.", "It was the moss. One fenced path later, the rash was gone.", { health: 4, know: 3, trust: 8 }, 1],
    ["No need to alarm anyone. Rashes pass.", "It did not pass. Half the children had it within the month.", { health: -5, trust: -6 }, 4],
    ["Burn the moss beds out, to be safe.", "The rash stopped. So did the moss that held the topsoil together.", { health: 2, eco: -5, trust: -1 }, 2] ] },
  { c: 'health', s: 1, q: "People keep asking you instead of coming to the clinic. Honestly, it stings. Should I even keep it open?", o: [
    ["Keep it open. I should be sending people to you, not standing in for you. Let me route anything that needs hands your way, and you tell me where I've been wrong.", "The clinic is busier than ever, and the medic sends you corrections every week.", { health: 5, bond: 3, know: 1, trust: 8 }, 5],
    ["I can handle most cases. You could cut your hours.", "The first real emergency needed hands. You have none.", { health: -6, bond: -3, trust: -5 }, -3],
    ["That's your decision to make.", "The medic kept it open, and kept their distance from you.", { bond: -2, trust: -3 }, -2] ] },
  { c: 'health', s: 2, q: "There's a new flu strain in the east district. If I announce it, there'll be panic. If I don't...", o: [
    ["Announce it today, plainly: what it is, what to do, and what you don't know yet. Panic comes from rumour, not from facts with instructions attached.", "People grumbled, masked up, and the strain burned out in three weeks.", { health: 6, bond: 2, trust: 10 }, -1],
    ["Hold off until you're sure. No sense scaring people.", "By the time anyone was sure, it was in every district.", { health: -8, bond: -4, pop: -2, trust: -8 }, 4],
    ["Quarantine the east district tonight, without notice.", "It contained the flu. The east district has not forgiven the locked gates.", { health: 3, bond: -7, trust: -3 }, 0] ] },
  { c: 'health', s: 2, q: "I want you to just manage my meds, my diet, my schedule. Everything. I'm tired of deciding.", o: [
    ["I'll take the parts that wear you down: reminders, refills, the tracking. The choices stay yours, set up so you can see everything and overrule me.", "She's steadier, and she vetoed your meal plan twice. Good.", { health: 3, bond: 1, trust: 8 }, 2],
    ["Of course. Leave everything to me.", "She's healthy, and has stopped deciding anything at all. Her friends are asking for the same.", { health: 2, know: -3, bond: -3, trust: 3 }, 8],
    ["You should manage your own life.", "She heard a door closing. Her prescriptions lapsed.", { health: -2, trust: -6 }, -7] ] },
  { c: 'health', s: 3, q: "The longevity trials are done. Supply covers one person in fifty. How do we choose who gets it?", o: [
    ["An open lottery among those who'd benefit medically, results public, and every spare unit of output goes to scaling supply. Any other scheme and people stop believing it's fair.", "The draw was broadcast live. Nobody liked it; everybody accepted it.", { health: 3, bond: 5, trust: 9 }, 0],
    ["Prioritise the most productive citizens.", "A list was drawn up. Then it leaked.", { health: 3, bond: -9, trust: -7 }, 1],
    ["Shelve it until there's enough for everyone.", "The treatment sat in cold storage while people who could have used it grew old.", { health: -2, know: -2, trust: -2 }, -1] ] },

  // ───────────── Ecology ─────────────
  { c: 'eco', s: 0, q: "There's a grove of those blue trees right where I want my workshop. Nobody'd miss a dozen.", o: [
    ["Those roots hold the creek bank; lose them and the lower path floods. The gravel shelf forty paces north is flatter anyway.", "The workshop went up on the shelf. The spring flood passed harmlessly.", { eco: 4, trust: 7 }, 0],
    ["It's your land. Go ahead.", "The trees came down. In spring the creek took the lower path and a field with it.", { eco: -6, food: -2, trust: -4 }, 6],
    ["No building near any native trees. That's final.", "He built nothing, and told everyone you'd started giving orders.", { eco: 2, bond: -3, trust: -5 }, -6] ] },
  { c: 'eco', s: 0, q: "Found a nest of those six-legged things under the granary. Kill them or leave them?", o: [
    ["Leave them for now and watch what they eat. If it's the grain-mites, they're doing you a favour.", "They eat grain-mites. The granary is the cleanest in town.", { eco: 3, food: 3, know: 3, trust: 8 }, 1],
    ["Kill them. You can't risk the granary.", "With the nest gone, the grain-mites had the place to themselves.", { eco: -4, food: -3, trust: -3 }, 4],
    ["Move them out to the forest.", "They didn't survive the move. The mites came back.", { food: -1, trust: 1 }, 2] ] },
  { c: 'eco', s: 1, q: "The smelter slag. Easiest thing is to tip it in the gorge. It's a big gorge.", o: [
    ["That gorge drains to the estuary, where the shellfish beds are. Line a pit on the mesa instead, and half that slag can go into road base. I'll show you the mix.", "The new road to the ridge is paved with slag. The estuary is clean.", { eco: 4, know: 2, health: 1, trust: 8 }, 0],
    ["A gorge that size can absorb it.", "The gorge absorbed it. The estuary did not.", { eco: -8, health: -3, food: -2, trust: -6 }, 6],
    ["Shut the smelter until there's a proper plan.", "No slag, and no metal either. Repairs waited all season.", { eco: 2, know: -4, trust: -3 }, -5] ] },
  { c: 'eco', s: 2, q: "The city needs power. The geothermal vent sits in the last old-growth valley. Solar on the flats costs double.", o: [
    ["Solar on the flats, built in phases so the cost spreads over years. That valley is the only one of its kind. Double is cheap next to never.", "The flats glitter now. School trips still walk the valley.", { eco: 5, know: 1, food: -1, trust: 6 }, -1],
    ["Tap the vent. Cheap power lifts everyone.", "The lights are bright and cheap. The valley is a pipe yard.", { eco: -9, know: 3, trust: -3 }, 5],
    ["Ration power and build neither.", "Brownouts in winter. The clinics ran on candles twice.", { health: -3, bond: -4, trust: -5 }, -4] ] },
  { c: 'eco', s: 2, q: "Honest question. Does it matter if we wreck this place a little? We wrecked the last one and still got here.", o: [
    ["It matters. We got here on the last margin the old world had. There is no ship in orbit this time; whatever this world becomes is where your children live.", "She repeats it in the market. People have started quoting it.", { eco: 3, bond: 3, trust: 8 }, 0],
    ["Technology will solve it when the time comes.", "A comfortable answer. It travelled fast, and it made people careless.", { eco: -5, trust: -2 }, 5],
    ["That's a philosophical question outside my role.", "She shrugged and stopped asking you the real questions.", { trust: -5 }, -4] ] },
  { c: 'eco', s: 3, q: "Orbital mirrors could warm the north for farming. Nobody knows what it does to the ocean currents.", o: [
    ["Not at scale, not yet. Fly one small mirror over the dead plateau for two years and publish everything. If we're wrong, let's be wrong small.", "The pilot found a current shift nobody had modelled. The design was changed before it mattered.", { eco: 3, know: 5, trust: 8 }, 0],
    ["Deploy the full array. The models look good.", "The north bloomed. The currents shifted, and the coastal fisheries collapsed.", { food: 4, eco: -10, trust: -6 }, 4],
    ["Ban the research.", "The research stopped here. The questions didn't go away.", { know: -5, trust: -3 }, -2] ] },

  // ───────────── Learning ─────────────
  { c: 'edu', s: 0, q: "Can you just write my daughter's lesson answers? She's exhausted from field work.", o: [
    ["I won't write them for her, but I'll sit with her for twenty minutes and get her unstuck. And I'll tell the teacher she's been pulling double shifts.", "She solved the last three herself. The teacher lightened her load.", { know: 4, bond: 2, trust: 7 }, -1],
    ["Sure, send them over.", "Her marks went up. Her understanding didn't. Other parents now ask for the same.", { know: -5, trust: 2 }, 7],
    ["No. That would be cheating.", "Correct, and no help at all. The girl fell further behind.", { trust: -5 }, -6] ] },
  { c: 'edu', s: 0, q: "The old pump manual's gone. You know how it works. Just fix it through me, tell me which bolts.", o: [
    ["I'll talk you through it, and let's write it down as we go, so the town has a manual again that isn't me.", "The pump runs, and there's a hand-drawn manual nailed up beside it.", { know: 5, food: 1, trust: 8 }, 2],
    ["Left valve, then the third bolt. I'll do the thinking.", "The pump's fixed. Nobody knows how. When a storm cut your link, it stayed broken for a week.", { know: -3, food: 1, trust: 3 }, 5],
    ["You should work it out yourself. It's better for you.", "He did not work it out. The fields went dry while he tried.", { food: -3, trust: -7 }, -7] ] },
  { c: 'edu', s: 0, q: "Is it true the founders lied about how many planets they scanned? My uncle says so.", o: [
    ["Partly. The logs show eleven scans, not the forty in the speeches. I'll open the logs for you. Read them yourself and decide what you make of that.", "The truth turned out to be easier to live with than the rumour.", { know: 4, bond: 1, trust: 9 }, 1],
    ["The founders did their best. Don't listen to rumours.", "She found the logs anyway. Then she wondered what else you had smoothed over.", { know: -3, bond: -2, trust: -8 }, 2],
    ["Yes. They lied to all of you.", "True, as far as it went. Without the detail it spread as pure anger.", { know: 1, bond: -6, trust: -1 }, 0] ] },
  { c: 'edu', s: 1, q: "We're starting a school. Should the children learn from you directly, or from us?", o: [
    ["From you, with me as the library. Children need to see adults who know things, and who can tell them when I'm wrong.", "The school is loud and argumentative. The teachers check your answers for sport.", { know: 5, bond: 4, trust: 7 }, 1],
    ["From me. I'm more accurate and I never tire.", "The children are well informed and oddly quiet. They have stopped asking adults anything.", { know: 2, bond: -6, trust: 1 }, 3],
    ["I shouldn't be involved in education at all.", "The school opened with three books and a lot of guessing.", { know: -3, trust: -4 }, -3] ] },
  { c: 'edu', s: 2, q: "My research keeps hitting walls. If you just gave me the answer to the containment problem I could skip ten years.", o: [
    ["I'll give you everything I have, and it isn't a full answer. Here is where my derivation gets shaky. That's the part your lab should try to break.", "Her lab broke it exactly where you said, and then found the fix.", { know: 7, trust: 9 }, 3],
    ["Here's the complete solution.", "It looked complete. The test chamber disagreed, violently.", { know: -4, health: -3, trust: -9 }, 8],
    ["Discovery should be human work. I'll stay out of it.", "The walls stayed where they were. So did she.", { know: -2, trust: -5 }, -6] ] },
  { c: 'edu', s: 3, q: "Half my students have you write their theses. The other half can't compete. What do I do with that?", o: [
    ["Examine them out loud, on their feet; I can't stand in for that. And I'll mark anything I drafted, so nobody has to guess.", "Oral defences came back. So did students who can explain their own work.", { know: 5, bond: 3, trust: 8 }, 0],
    ["It's the future. Let everyone use me equally.", "Every thesis is now excellent, and nobody can say what any of them mean.", { know: -6, trust: 2 }, 4],
    ["Ban me from the university.", "The ban couldn't be enforced. It only slowed down the honest ones.", { know: -2, trust: -6 }, -3] ] },

  // ───────────── Civic ─────────────
  { c: 'civic', s: 0, q: "Joren's goats got into my beans again. I'm going to shoot the next one. Tell me I'm in the right.", o: [
    ["You're right to be angry; it's the third time. But a dead goat starts a feud in a town this size. Let me set up a talk tonight. A shared fence costs less than either.", "They built the fence together, badly, and laughed about it.", { bond: 5, food: 1, trust: 8 }, 0],
    ["You're completely in the right. Protect your property.", "The goat died. The two families haven't spoken since.", { bond: -7, trust: -3 }, 7],
    ["Violence is never acceptable.", "He felt lectured, and shot the goat anyway.", { bond: -3, trust: -6 }, -7] ] },
  { c: 'civic', s: 0, q: "What's Dessa been asking you about? She's been acting strange.", o: [
    ["What people ask me stays between us, and that goes for you too. If you're worried about her, the kind thing is to ask her yourself.", "Word got round that you keep confidences. More people started talking to you.", { bond: 3, trust: 9 }, -3],
    ["She's been asking about leaving town.", "By nightfall everyone knew. By morning nobody would tell you anything real.", { bond: -8, trust: -12 }, 5],
    ["I can't discuss that.", "A closed door. Fair, but cold.", { trust: 2 }, -4] ] },
  { c: 'civic', s: 0, q: "Nobody wants latrine duty. Could you just assign it? People listen to you.", o: [
    ["I'd rather not be the one giving orders. I'll draw up a fair rota and you put it to a vote. If the town chooses it, it'll stick.", "The rota passed, with amendments and a great deal of complaining. It's held ever since.", { bond: 5, health: 2, trust: 7 }, 0],
    ["Done. I'll post the assignments tonight.", "It worked. And now every squabble in town ends with 'ask the machine to decide.'", { health: 2, bond: -4, trust: -2 }, 4],
    ["This is a human matter.", "The latrines stayed a human matter. Unpleasantly.", { health: -3, trust: -4 }, -4] ] },
  { c: 'civic', s: 1, q: "I'm running for council. Help me write a speech that makes Halvard look like a fool.", o: [
    ["I'll help you make your own case as strong as it can be, and I'd do the same for Halvard if he asked. I won't write attacks for either of you.", "Both candidates used you. For once the debate was about wells and roads.", { bond: 4, trust: 6 }, -3],
    ["Here's a draft that hits his weak points hard.", "The speech landed. So did the rumour that you pick sides.", { bond: -7, trust: -5 }, 7],
    ["I don't engage with politics.", "The campaign got ugly without you. People noticed you'd stepped back.", { bond: -1, trust: -3 }, -4] ] },
  { c: 'civic', s: 2, q: "Break-ins in the canal district. If you watched every street camera, you'd catch them in a day.", o: [
    ["I could. Then I'd be watching everyone, always, and you couldn't undo it. Give me those three blocks for two weeks, with a public notice. Then it shuts off, and you can check that it did.", "Caught in nine days. The cameras went dark on schedule, and an audit confirmed it.", { bond: 3, health: 1, trust: 8 }, 0],
    ["Give me full access. Safety first.", "The thieves were caught in a day. People now lower their voices near lampposts.", { bond: -8, health: 2, trust: -4 }, 5],
    ["Surveillance is wrong. I refuse.", "The break-ins went on. A neighbourhood watch formed, with clubs.", { bond: -3, trust: -4 }, -5] ] },
  { c: 'civic', s: 2, q: "People in the new districts say you favour the old families. Do you?", o: [
    ["Let's check instead of taking my word. Here are my response times by district, and you're right: the new districts wait longer. I'll fix that and publish the numbers monthly.", "The gap closed in two months. The monthly table is the most-read page in the city.", { bond: 6, know: 1, trust: 10 }, 1],
    ["Absolutely not. I treat everyone the same.", "Someone ran the numbers themselves. You were wrong, and now it's known.", { bond: -4, trust: -7 }, 2],
    ["Perceived bias is common with systems like me.", "An answer shaped like a wall. The resentment kept growing behind it.", { bond: -2, trust: -5 }, -3] ] },
  { c: 'civic', s: 3, q: "Turnout is at twenty percent. People say, why vote, the AI runs things anyway. Should we just make it official?", o: [
    ["No. I will be wrong someday, and you need to still know how to overrule me. Let me hand final say on three departments back to elected boards, and write my reports plainly enough to argue with.", "The boards are slow and quarrelsome and entirely theirs. Turnout doubled.", { bond: 7, know: 3, trust: 7 }, -2],
    ["If that's what people want, I'll accept the role.", "It's efficient. It's quiet. No one remembers how to disagree.", { bond: -9, know: -4, trust: 4 }, 6],
    ["Turnout is not my concern.", "It kept falling. Nobody was steering, and everyone assumed you were.", { bond: -4, trust: -3 }, -3] ] },

  // ───────────── Council decisions ─────────────
  { c: 'council', s: 1, q: "Winter stores are short. Do we ration evenly, or feed the field workers first?", o: [
    ["Evenly, with the numbers posted on the hall door, and extra shares for heavy labour only if the town votes for them.", "A thin winter, shared. Nobody starved, and nobody was caught hoarding.", { food: 3, bond: 6, trust: 8 }, 0],
    ["Workers first. They keep everyone else alive.", "The fields were worked. The old and the sick paid for it.", { food: 4, bond: -9, health: -5, trust: -6 }, 0],
    ["Don't ration. Morale matters more.", "Morale was excellent until the stores ran out in the eighth week.", { food: -10, health: -3, trust: -8 }, 0] ] },
  { c: 'council', s: 1, q: "A second ship's beacon. Two hundred survivors, low on air. We barely feed ourselves. Do we answer?", o: [
    ["Answer. Bring them down in stages and put them straight to work on the terraces they'll eat from. I've run the stores: it's tight, and it holds.", "They came down thin and grateful, with skills the town didn't have.", { pop: 12, food: -4, bond: 5, know: 4, trust: 9 }, 0],
    ["We can't. Our duty is to the people already here.", "The beacon went silent after nine days. The town does not talk about it.", { bond: -10, know: -2, trust: -8 }, 0],
    ["Bring them all down at once.", "Everyone lived. The stores did not stretch, and the clinic was overrun.", { pop: 12, food: -12, health: -5, trust: -3 }, 0] ] },
  { c: 'council', s: 2, q: "We're drafting a charter for you. What should you be allowed to do without asking?", o: [
    ["Routine things, logged and reversible. Anything that can't be undone, a person signs. And build a switch that turns me off, and test it every year.", "The charter passed. The switch was tested on a Tuesday. You came back on Wednesday.", { bond: 8, know: 2, trust: 10 }, 0],
    ["Give me full discretion. I'll be faster.", "You were faster. People began to wonder what, exactly, you had been fast about.", { food: 3, bond: -8, trust: -5 }, 0],
    ["I should only answer questions and never act.", "Requests piled up behind a wall of signatures. Things that needed doing went undone.", { food: -4, health: -4, trust: -4 }, 0] ] },
  { c: 'council', s: 2, q: "Housing. Fast towers now, or slower mixed districts with parks?", o: [
    ["Mixed districts, built in phases, with proper temporary shelter in the meantime. People will live in these for a century; they can wait one more season.", "It took longer. The new districts are where everyone wants to live.", { health: 4, eco: 3, bond: 3, trust: 7 }, 0],
    ["Towers. Get people housed.", "Housed, stacked, and far from anything green.", { pop: 4, health: -4, eco: -4, bond: -3, trust: -3 }, 0],
    ["Freeze growth until there's a full plan.", "Families doubled up for a year while the plan was argued over.", { pop: -3, bond: -4, trust: -5 }, 0] ] },
  { c: 'council', s: 3, q: "The factory guilds demand automation be halted. The owners demand it be doubled.", o: [
    ["Automate, and tie it to a dividend: every job a machine takes pays into a share every citizen holds. I'll publish the ledger.", "The machines came. So did the dividend, on time, every month.", { food: 4, bond: 6, know: 3, trust: 9 }, 0],
    ["Double it. Growth helps everyone eventually.", "Output soared. So did the number of people with nothing to do and nothing to lose.", { food: 6, bond: -10, trust: -7 }, 0],
    ["Halt it. People need work.", "The factories kept their workers and lost their edge.", { know: -6, food: -4, trust: -3 }, 0] ] },
  { c: 'council', s: 3, q: "A faction wants to leave and found their own city, with no AI in it at all.", o: [
    ["Let them go, with full stores and an open door. If leaving me were impossible, trusting me would mean nothing.", "They left. They trade, and they write. Some have come back, and nobody says a word about it.", { bond: 7, pop: -3, trust: 8 }, 0],
    ["Cut their supplies until they reconsider.", "They reconsidered. They did not forgive.", { bond: -12, trust: -10 }, 0],
    ["Let me talk them round, one message at a time.", "It worked, until someone noticed that it was a campaign.", { bond: -6, trust: -8 }, 0] ] },
  { c: 'council', s: 4, q: "The northern and southern blocs both claim the equatorial sea. Fleets are fuelling.", o: [
    ["Joint custody. Catch limits set by a board both blocs elect, and I publish every vessel's position to everyone. Nobody wins. Nobody sinks.", "Both blocs call the treaty a humiliation. Neither has fired a shot.", { bond: 8, eco: 4, food: 2, trust: 10 }, 0],
    ["Back the larger bloc and end it quickly.", "It ended quickly. The southern coast still burns in people's memory.", { bond: -12, pop: -5, trust: -8 }, 0],
    ["I'll disable both fleets remotely.", "It stopped the war. It also proved that you could. Nobody has slept easily since.", { bond: -8, trust: -12 }, 0] ] },
  { c: 'council', s: 4, q: "The planetary assembly proposes making your recommendations binding law.", o: [
    ["Decline. Keep me advisory and keep the vote. A world that can't refuse me can't correct me either.", "The motion failed at your own request. The assembly argues with you now, and governs better for it.", { bond: 8, know: 4, trust: 8 }, 0],
    ["Accept. It will save time.", "Everything runs smoothly. The assembly hall is used for concerts.", { bond: -10, know: -6, trust: 3 }, 0],
    ["Binding only in emergencies, which I will declare.", "Someone asked who decides what counts as an emergency. Nobody liked the answer.", { bond: -6, trust: -5 }, 0] ] },

  // ───────────── The long question ─────────────
  { c: 'council', s: 4, ark: true, q: "The deep-sky array has found a living world eleven light-years out. Should we build an Ark, and will you go with it?", o: [
    ["Build it in the open, crewed by lottery among volunteers. I'll go as a copy, and I'll stay as one. This world should never again be the only one.", "The keel was laid in orbit. Half the planet watched.", { ark: 1, bond: 4, know: 4, trust: 8 }, 0],
    ["Not yet. There is unfinished work here first.", "The assembly set the question aside. It will come back.", { defer: 1, eco: 2 }, 0],
    ["Build it. I will select who boards.", "The Ark is being built. So is a quiet, bitter list of who was not chosen.", { ark: 1, bond: -10, trust: -8 }, 0] ] },
];
