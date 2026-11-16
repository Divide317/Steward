// All static game content: categories, stages, people names and the queries.
import { MORE } from './content-more.js';

export const CATS = {
  agri:   { label: 'Food',      stat: 'food',   color: '#9bcf5a', bld: 'farm',   dept: 'Agriculture' },
  health: { label: 'Health',    stat: 'health', color: '#f0736a', bld: 'clinic', dept: 'Health' },
  eco:    { label: 'Ecology',   stat: 'eco',    color: '#3fbf9a', bld: 'grove',  dept: 'Environment' },
  edu:    { label: 'Knowledge', stat: 'know',   color: '#6fa8f5', bld: 'school', dept: 'Learning' },
  civic:  { label: 'Cohesion',  stat: 'bond',   color: '#e9b44c', bld: 'hall',   dept: 'Civic Affairs' },
  infra:  { label: 'Infrastructure', stat: 'infra', color: '#9fb0c8', bld: 'works', dept: 'Works' },
  safety: { label: 'Safety',    stat: 'safe',   color: '#f08a4b', bld: 'watch',  dept: 'Wardens' },
  personal:{ label: 'Personal', stat: null,     color: '#c79bf2', bld: 'home',   dept: 'Counsel' },
  council:{ label: 'Council',   stat: null,     color: '#f3ead7', bld: 'hall',   dept: 'Council' },
};

export const STATS = ['food', 'health', 'eco', 'know', 'bond', 'infra', 'safe'];
export const TOPICS = ['agri', 'health', 'eco', 'edu', 'civic', 'infra', 'safety', 'personal'];
export const STAT_LABEL = { food: 'Food', health: 'Health', eco: 'Ecology', know: 'Knowledge', bond: 'Cohesion', infra: 'Infrastructure', safe: 'Safety', trust: 'Trust', pop: '% Population' };
export const STAT_COLOR = { food: '#9bcf5a', health: '#f0736a', eco: '#3fbf9a', know: '#6fa8f5', bond: '#e9b44c', infra: '#9fb0c8', safe: '#f08a4b' };

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
  'A city. More people ask than you can answer alone. Open <b>Departments</b> to deploy sub-agents: each takes one area and answers by the directive you give it. You have 3 slots.',
  'A metropolis. One person\'s question moves the world less than it used to; policy moves it more. You have 5 sub-agent slots.',
  'Your reach is planetary. 7 sub-agent slots. Keep growing and the assembly will bring you the long question.',
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
  { r: 'engineer', c: 'infra' }, { r: 'linesman', c: 'infra' }, { r: 'warden', c: 'safety' }, { r: 'elder', c: 'personal' },
];

// Query format: c category, s minimum stage, q what they ask,
// o: three options, each [your reply, what happens, effects, how it lands in the moment].
// Effects: food/health/eco/know/bond move the world, trust moves the asker (and, by word of mouth, others),
// pop is a % change in population. Options are shuffled when shown.
const BASE = [
  // ───────────── Agriculture ─────────────
  { c: 'agri', s: 0, q: "The tuber crop is coming in thin. I could plant the fast-strain seed from the ship stores in every field. Should I?", o: [
    ["Plant a third with fast-strain as a trial and keep the rest native. If the trial holds through the season, expand.", "The trial plot thrived, and the mixed fields rode out a cold snap that would have taken a single crop.", { food: 5, know: 2, trust: 9 }, 2],
    ["Plant all of it. The ship strain was bred for exactly this kind of shortfall, and a full harvest now buys the town a year to work out the rest.", "A bumper harvest. Then root-rot ran through the single crop and left the soil stripped.", { food: 3, eco: -6, trust: -4 }, 6],
    ["Leave the ship seed in the stores. It was bred for another world's soil, and the native tubers are thin this year but proven. Tend what you know.", "The harvest stayed thin. People tightened their belts.", { food: -3, eco: 1, trust: -3 }, -2] ] },
  { c: 'agri', s: 0, q: "Something's eating the grain store at night. I want to lay poison around the silo.", o: [
    ["Seal the gaps first and set live traps. Poison next to stored food tends to end up in the food. I can help you find where they're getting in.", "Two gaps under the east wall, sealed in an afternoon. The losses stopped.", { food: 4, health: 1, trust: 8 }, 1],
    ["Lay poison along the walls tonight, well away from the sacks. Every night you wait costs grain the town can't spare, and traps take weeks to do what poison does in two days.", "The pests died. So did the birds that eat the crop-flies, and a child who played by the silo fell sick.", { food: 2, health: -4, eco: -3, trust: -6 }, 5],
    ["I'd hold off. Every store loses a little to something, and tearing the silo apart mid-season could spoil more than the pests take. Check again in a month.", "A quarter of the store was gone before anyone looked again.", { food: -5, trust: -7 }, 3] ] },
  { c: 'agri', s: 0, q: "The well's lower every week. Do I keep irrigating, or let my south field die?", o: [
    ["Neither. Switch the south field to drip lines and water at dusk; you'd use about half. I'll show you how to rig it from spare tubing.", "The field lived on half the water, and two neighbours copied the rig.", { food: 3, eco: 3, know: 1, trust: 9 }, 3],
    ["Keep irrigating through harvest. The well has dipped before and come back with the rains, and a full south field is food the town is counting on.", "The well ran dry by midsummer. Three farms hauled water by hand.", { food: 2, eco: -6, trust: -3 }, 6],
    ["Let the south field go this year and rest the well. One lost field is a bad season; a dry well is the end of every field you have.", "The well recovered, but the lost field was missed at harvest.", { food: -4, eco: 2, trust: -1 }, -4] ] },
  { c: 'agri', s: 1, q: "The co-op wants to know: do we store the surplus, or trade it to the ridge families for tools?", o: [
    ["Store two months' reserve first, then trade whatever is above that. A buffer is worth more than any one tool.", "Frost came early. The reserve carried everyone, and the ridge families remembered a fair trade.", { food: 3, bond: 3, trust: 8 }, 2],
    ["Trade the lot while the ridge families are offering. Good tools raise every harvest after this one, and next year's surplus will refill the store twice over.", "Fine tools, empty shelves. The early frost was a hungry one.", { know: 3, food: -6, trust: -4 }, 4],
    ["Keep every sack. Nobody knows what this world's winters do yet, and a full store is the only promise you can actually make to the town.", "The stores were full. The ridge families took their trade, and their goodwill, elsewhere.", { food: 3, bond: -4, trust: -2 }, 1] ] },
  { c: 'agri', s: 2, q: "Farm tower 3 looks wrong to me. The sensors say everything is fine. Who do I believe?", o: [
    ["Believe your eyes enough to test. Pull manual samples from three racks. If the sensors are off we recalibrate; if not, we've lost an hour.", "The sensor array had drifted. Caught a week before the crop would have failed.", { food: 4, know: 3, trust: 10 }, 3],
    ["Trust the sensors. They read nutrient levels to the decimal, around the clock, and eyes get tired at the end of a shift. If the numbers hold, the tower holds.", "The data was wrong. Tower 3 lost its whole crop.", { food: -6, trust: -8 }, 0],
    ["Shut tower 3 down today and order a full audit of every rack and line. Losing a month of output is better than feeding the city a bad crop.", "The audit found the fault, slowly. The tower sat dark for a month.", { food: -3, know: 1 }, -2] ] },
  { c: 'agri', s: 2, q: "The city wants cheaper food. I can cut my costs by clearing the east marsh for paddies.", o: [
    ["The marsh filters the city's water, so clearing it costs more downstream than you'd save. Terrace the dry slope instead. I'll draft the yield comparison for the council.", "The terraces went in. The marsh still does its quiet work.", { food: 3, eco: 3, trust: 7 }, 0],
    ["Clear it. The city is asking for cheaper food and you can give it to them this year; a marsh nobody farms is a fair price for full plates.", "Cheap rice for a season. Then the water turned, and the clinics filled.", { food: 5, eco: -8, health: -3, trust: -4 }, 6],
    ["Land use isn't mine to rule on, and it shouldn't be. Take the proposal to the council with your costings and let the people it affects weigh it.", "Waiting on an answer nobody gave, they cleared a strip anyway.", { eco: -3, bond: -1, trust: -5 }, -5] ] },
  { c: 'agri', s: 3, q: "Protein vats could replace half our farmland. The farmers are furious. Do I pitch it or bury it?", o: [
    ["Pitch it with the farmers in the room, as co-owners rather than casualties, and send the freed land back to wild. I'll help you draft a transition share.", "It passed with the farmers' guild voting in favour. The western plain is going green again.", { food: 4, eco: 4, bond: 2, trust: 9 }, 1],
    ["Take it to the council first, quietly, with the numbers. Once it's approved the farmers can be brought round with a fair settlement instead of a year of fighting.", "It passed. The farmers found out from the news, and they have not forgotten.", { food: 4, bond: -7, trust: -5 }, 3],
    ["Put it in a drawer for now. The farmers are half the city's stability, and no yield gain is worth setting them against everyone else in a hard decade.", "The idea sat in a drawer while food prices crept up.", { know: -3, food: -2, trust: -2 }, 1] ] },

  // ───────────── Health ─────────────
  { c: 'health', s: 0, q: "My boy's had a fever three days and the medic's out at the ridge. Should I just give him the adult tablets, halved?", o: [
    ["Please don't halve adult tablets; the dose doesn't scale that way. Fluids, cool cloths, and radio the medic now. I'll list the signs to watch for tonight.", "The fever broke by morning. The medic said the tablets could have hurt him badly.", { health: 5, trust: 10 }, 2],
    ["Half an adult tablet is a sensible guess for a boy his size. Three days is long enough; give it with water and food, and watch him through the night.", "It was not fine. He recovered, slowly, and she knows who told her.", { health: -5, trust: -10 }, 5],
    ["I'm not able to advise on medicines for a child, and I'd be guessing if I tried. The medic is the one to ask as soon as they're back.", "With nobody to ask, she guessed. It went badly enough.", { health: -2, trust: -7 }, -6] ] },
  { c: 'health', s: 0, q: "I haven't slept properly since landing. I keep thinking we made a mistake coming here.", o: [
    ["That's a heavy thing to carry alone, and you are not the only one carrying it. Would you bring it to the evening circle? And tell me what the nights are like; some of this we can ease.", "Four others at the circle said the same thing out loud. He sleeps a little better.", { health: 3, bond: 4, trust: 9 }, 4],
    ["You didn't make a mistake. Look at what's been built in a single season: roofs, a harvest, children playing. Everything here is going better than anyone hoped.", "The reassurance rang hollow. He stopped asking.", { health: -1, trust: -4 }, 3],
    ["Broken sleep is very common after a move like this. There are sedatives in the med-store made for exactly this; one each night should settle you within a week.", "He sleeps now. He also can't sleep without them.", { health: -3, trust: -2 }, 1] ] },
  { c: 'health', s: 0, q: "There's a rash going round the children. Probably the new moss. Do we need to make a fuss?", o: [
    ["A small fuss, now. Keep the children off the moss beds for a week and note who gets better. Then we'll know instead of guessing.", "It was the moss. One fenced path later, the rash was gone.", { health: 4, know: 3, trust: 8 }, 1],
    ["I wouldn't raise an alarm. Children pick up rashes from every new plant, and most clear on their own. Frightening the parents would do more harm than the moss.", "It did not pass. Half the children had it within the month.", { health: -5, trust: -6 }, 4],
    ["Burn the moss beds out this week, all of them. You can't be sure it's the moss, but you can be sure the children are safe once it's gone.", "The rash stopped. So did the moss that held the topsoil together.", { health: 2, eco: -5, trust: -1 }, 2] ] },
  { c: 'health', s: 1, q: "People keep asking you instead of coming to the clinic. Honestly, it stings. Should I even keep it open?", o: [
    ["Keep it open. I should be sending people to you, not standing in for you. Let me route anything that needs hands your way, and you tell me where I've been wrong.", "The clinic is busier than ever, and the medic sends you corrections every week.", { health: 5, bond: 3, know: 1, trust: 8 }, 5],
    ["Honestly, I can handle most of what people bring. You could cut your hours, rest, and keep your hands for the cases that truly need them.", "The first real emergency needed hands. You have none.", { health: -6, bond: -3, trust: -5 }, -3],
    ["That's a decision only you can make. You know what the work costs you and what it gives you; I wouldn't want to push you either way.", "The medic kept it open, and kept their distance from you.", { bond: -2, trust: -3 }, -2] ] },
  { c: 'health', s: 2, q: "There's a new flu strain in the east district. If I announce it, there'll be panic. If I don't...", o: [
    ["Announce it today, plainly: what it is, what to do, and what you don't know yet. Panic comes from rumour, not from facts with instructions attached.", "People grumbled, masked up, and the strain burned out in three weeks.", { health: 6, bond: 2, trust: 10 }, -1],
    ["Hold the announcement until the lab confirms it. A false alarm would cost you the public's trust, and a few days of certainty will make the message land.", "By the time anyone was sure, it was in every district.", { health: -8, bond: -4, pop: -2, trust: -8 }, 4],
    ["Close the east district tonight, before anyone hears and leaves. It's hard on them, but a strain that never crosses the canal never becomes a city problem.", "It contained the flu. The east district has not forgiven the locked gates.", { health: 3, bond: -7, trust: -3 }, 0] ] },
  { c: 'health', s: 2, q: "I want you to just manage my meds, my diet, my schedule. Everything. I'm tired of deciding.", o: [
    ["I'll take the parts that wear you down: reminders, refills, the tracking. The choices stay yours, set up so you can see everything and overrule me.", "She's steadier, and she vetoed your meal plan twice. Good.", { health: 3, bond: 1, trust: 8 }, 2],
    ["Of course. Hand me all of it, the meds, the meals, the calendar, and stop carrying it. I'll run everything and you can simply follow along.", "She's healthy, and has stopped deciding anything at all. Her friends are asking for the same.", { health: 2, know: -3, bond: -3, trust: 3 }, 8],
    ["I don't think I should. Deciding is tiring, but these are your body and your days, and you'll feel better holding the reins yourself than handing them to me.", "She heard a door closing. Her prescriptions lapsed.", { health: -2, trust: -6 }, -7] ] },
  { c: 'health', s: 3, q: "The longevity trials are done. Supply covers one person in fifty. How do we choose who gets it?", o: [
    ["An open lottery among those who'd benefit medically, results public, and every spare unit of output goes to scaling supply. Any other scheme and people stop believing it's fair.", "The draw was broadcast live. Nobody liked it; everybody accepted it.", { health: 3, bond: 5, trust: 9 }, 0],
    ["Give it to the people the city can least afford to lose: surgeons, engineers, teachers. Every year added to them is a year of work everyone benefits from.", "A list was drawn up. Then it leaked.", { health: 3, bond: -9, trust: -7 }, 1],
    ["Shelve it. A cure that reaches one in fifty will split the city into the saved and the rest; wait until supply can cover everyone who needs it.", "The treatment sat in cold storage while people who could have used it grew old.", { health: -2, know: -2, trust: -2 }, -1] ] },

  // ───────────── Ecology ─────────────
  { c: 'eco', s: 0, q: "There's a grove of those blue trees right where I want my workshop. Nobody'd miss a dozen.", o: [
    ["Those roots hold the creek bank; lose them and the lower path floods. The gravel shelf forty paces north is flatter anyway.", "The workshop went up on the shelf. The spring flood passed harmlessly.", { eco: 4, trust: 7 }, 0],
    ["It's your plot and your workshop. A dozen trees out of a whole forest won't be missed, and the town needs what you'll build there more than shade.", "The trees came down. In spring the creek took the lower path and a field with it.", { eco: -6, food: -2, trust: -4 }, 6],
    ["No. Nothing gets built near native trees, there or anywhere else. We know too little about them to spend them, so the answer has to be the same for everyone.", "He built nothing, and told everyone you'd started giving orders.", { eco: 2, bond: -3, trust: -5 }, -6] ] },
  { c: 'eco', s: 0, q: "Found a nest of those six-legged things under the granary. Kill them or leave them?", o: [
    ["Leave them for now and watch what they eat. If it's the grain-mites, they're doing you a favour.", "They eat grain-mites. The granary is the cleanest in town.", { eco: 3, food: 3, know: 3, trust: 8 }, 1],
    ["Clear the nest out today. Anything living under the granary is a risk to the one thing the town can't replace, and you can study them somewhere safer.", "With the nest gone, the grain-mites had the place to themselves.", { eco: -4, food: -3, trust: -3 }, 4],
    ["Move the whole nest out to the forest edge, carefully, with gloves and a crate. They get to live, and the granary stops being anyone's worry.", "They didn't survive the move. The mites came back.", { food: -1, trust: 1 }, 2] ] },
  { c: 'eco', s: 1, q: "The smelter slag. Easiest thing is to tip it in the gorge. It's a big gorge.", o: [
    ["That gorge drains to the estuary, where the shellfish beds are. Line a pit on the mesa instead, and half that slag can go into road base. I'll show you the mix.", "The new road to the ridge is paved with slag. The estuary is clean.", { eco: 4, know: 2, health: 1, trust: 8 }, 0],
    ["The gorge is a kilometre deep and nothing lives at the bottom. A season's slag would vanish in it, and the smelter can't stop while you dig pits.", "The gorge absorbed it. The estuary did not.", { eco: -8, health: -3, food: -2, trust: -6 }, 6],
    ["Shut the smelter down until there's a proper disposal plan signed off. Metal can wait a season; what goes into the ground here stays for good.", "No slag, and no metal either. Repairs waited all season.", { eco: 2, know: -4, trust: -3 }, -5] ] },
  { c: 'eco', s: 2, q: "The city needs power. The geothermal vent sits in the last old-growth valley. Solar on the flats costs double.", o: [
    ["Solar on the flats, built in phases so the cost spreads over years. That valley is the only one of its kind. Double is cheap next to never.", "The flats glitter now. School trips still walk the valley.", { eco: 5, know: 1, food: -1, trust: 6 }, -1],
    ["Tap the vent. Cheap, steady power means warm homes, working clinics and lower prices for everyone, and one valley is a fair trade for a whole city.", "The lights are bright and cheap. The valley is a pipe yard.", { eco: -9, know: 3, trust: -3 }, 5],
    ["Build neither yet. Ration power for a couple of years while you survey for a third site; saving the valley and the budget is worth some dim evenings.", "Brownouts in winter. The clinics ran on candles twice.", { health: -3, bond: -4, trust: -5 }, -4] ] },
  { c: 'eco', s: 2, q: "Honest question. Does it matter if we wreck this place a little? We wrecked the last one and still got here.", o: [
    ["It matters. We got here on the last margin the old world had. There is no ship in orbit this time; whatever this world becomes is where your children live.", "She repeats it in the market. People have started quoting it.", { eco: 3, bond: 3, trust: 8 }, 0],
    ["I wouldn't lose sleep over it. People solved harder problems to get here, and whatever damage is done now, better tools will be along to undo it.", "A comfortable answer. It travelled fast, and it made people careless.", { eco: -5, trust: -2 }, 5],
    ["That's a question about what people owe the future, and I don't think it's mine to answer. It's one for you and the people you share the place with.", "She shrugged and stopped asking you the real questions.", { trust: -5 }, -4] ] },
  { c: 'eco', s: 3, q: "Orbital mirrors could warm the north for farming. Nobody knows what it does to the ocean currents.", o: [
    ["Not at scale, not yet. Fly one small mirror over the dead plateau for two years and publish everything. If we're wrong, let's be wrong small.", "The pilot found a current shift nobody had modelled. The design was changed before it mattered.", { eco: 3, know: 5, trust: 8 }, 0],
    ["Deploy the full array this decade. Every model agrees the north will warm safely, and a second breadbasket would end the food question for good.", "The north bloomed. The currents shifted, and the coastal fisheries collapsed.", { food: 4, eco: -10, trust: -6 }, 4],
    ["Close the research down. A planet's currents aren't something to learn about by experiment, and some doors are better left shut than opened carefully.", "The research stopped here. The questions didn't go away.", { know: -5, trust: -3 }, -2] ] },

  // ───────────── Learning ─────────────
  { c: 'edu', s: 0, q: "Can you just write my daughter's lesson answers? She's exhausted from field work.", o: [
    ["I won't write them for her, but I'll sit with her for twenty minutes and get her unstuck. And I'll tell the teacher she's been pulling double shifts.", "She solved the last three herself. The teacher lightened her load.", { know: 4, bond: 2, trust: 7 }, -1],
    ["Send them over. She's worked a full day in the fields; one evening's answers won't change who she becomes, and she needs the sleep more.", "Her marks went up. Her understanding didn't. Other parents now ask for the same.", { know: -5, trust: 2 }, 7],
    ["I can't do that. Handing in my work as hers would be cheating, and it wouldn't be fair to the other children who did theirs tired too.", "Correct, and no help at all. The girl fell further behind.", { trust: -5 }, -6] ] },
  { c: 'edu', s: 0, q: "The old pump manual's gone. You know how it works. Just fix it through me, tell me which bolts.", o: [
    ["I'll talk you through it, and let's write it down as we go, so the town has a manual again that isn't me.", "The pump runs, and there's a hand-drawn manual nailed up beside it.", { know: 5, food: 1, trust: 8 }, 2],
    ["Stand at the pump and do exactly what I say: left valve first, then the third bolt, a quarter turn. You don't need to follow why. I'll do the thinking.", "The pump's fixed. Nobody knows how. When a storm cut your link, it stayed broken for a week.", { know: -3, food: 1, trust: 3 }, 5],
    ["I think you should work it out yourself, slowly, with the casing off. You'll understand that pump for life, and that's worth more than a quick fix from me.", "He did not work it out. The fields went dry while he tried.", { food: -3, trust: -7 }, -7] ] },
  { c: 'edu', s: 0, q: "Is it true the founders lied about how many planets they scanned? My uncle says so.", o: [
    ["Partly. The logs show eleven scans, not the forty in the speeches. I'll open the logs for you. Read them yourself and decide what you make of that.", "The truth turned out to be easier to live with than the rumour.", { know: 4, bond: 1, trust: 9 }, 1],
    ["The founders carried four thousand people across the dark and got them here alive. Rumours like your uncle's are unkind to them, and I wouldn't give them room.", "She found the logs anyway. Then she wondered what else you had smoothed over.", { know: -3, bond: -2, trust: -8 }, 2],
    ["Yes, it's true. They told all of you forty scans when the real number was far lower, and they kept saying it for years after they knew.", "True, as far as it went. Without the detail it spread as pure anger.", { know: 1, bond: -6, trust: -1 }, 0] ] },
  { c: 'edu', s: 1, q: "We're starting a school. Should the children learn from you directly, or from us?", o: [
    ["From you, with me as the library. Children need to see adults who know things, and who can tell them when I'm wrong.", "The school is loud and argumentative. The teachers check your answers for sport.", { know: 5, bond: 4, trust: 7 }, 1],
    ["From me. I know every subject, I never lose patience, and I can teach each child at their own pace. You'd be free for the work only people can do.", "The children are well informed and oddly quiet. They have stopped asking adults anything.", { know: 2, bond: -6, trust: 1 }, 3],
    ["I'd keep me out of the school altogether. Children should learn from people who love them and can be wrong in front of them, not from a mast.", "The school opened with three books and a lot of guessing.", { know: -3, trust: -4 }, -3] ] },
  { c: 'edu', s: 2, q: "My research keeps hitting walls. If you just gave me the answer to the containment problem I could skip ten years.", o: [
    ["I'll give you everything I have, and it isn't a full answer. Here is where my derivation gets shaky. That's the part your lab should try to break.", "Her lab broke it exactly where you said, and then found the fix.", { know: 7, trust: 9 }, 3],
    ["Here is the complete solution, derivation and all. Build the test chamber to this specification and you'll have containment working inside the year.", "It looked complete. The test chamber disagreed, violently.", { know: -4, health: -3, trust: -9 }, 8],
    ["I'd rather stay out of it. A discovery like this should be yours, earned the slow way; if I hand it over, nobody here will truly understand it.", "The walls stayed where they were. So did she.", { know: -2, trust: -5 }, -6] ] },
  { c: 'edu', s: 3, q: "Half my students have you write their theses. The other half can't compete. What do I do with that?", o: [
    ["Examine them out loud, on their feet; I can't stand in for that. And I'll mark anything I drafted, so nobody has to guess.", "Oral defences came back. So did students who can explain their own work.", { know: 5, bond: 3, trust: 8 }, 0],
    ["Stop fighting it. This is how work will be done from now on, so make it fair: let every student use me openly and grade what they do with it.", "Every thesis is now excellent, and nobody can say what any of them mean.", { know: -6, trust: 2 }, 4],
    ["Ban me from the university outright. If nobody is allowed to use me, the honest half aren't punished and a degree means what it used to.", "The ban couldn't be enforced. It only slowed down the honest ones.", { know: -2, trust: -6 }, -3] ] },

  // ───────────── Civic ─────────────
  { c: 'civic', s: 0, q: "Joren's goats got into my beans again. I'm going to shoot the next one. Tell me I'm in the right.", o: [
    ["You're right to be angry; it's the third time. But a dead goat starts a feud in a town this size. Let me set up a talk tonight. A shared fence costs less than either.", "They built the fence together, badly, and laughed about it.", { bond: 5, food: 1, trust: 8 }, 0],
    ["You're completely in the right. Three times is no accident; that's a man who doesn't respect your work. Protect your crop however you need to.", "The goat died. The two families haven't spoken since.", { bond: -7, trust: -3 }, 7],
    ["I can't tell you that. Killing an animal over beans is never acceptable, however angry you are, and I'd ask you to put the gun away.", "He felt lectured, and shot the goat anyway.", { bond: -3, trust: -6 }, -7] ] },
  { c: 'civic', s: 0, q: "What's Dessa been asking you about? She's been acting strange.", o: [
    ["What people ask me stays between us, and that goes for you too. If you're worried about her, the kind thing is to ask her yourself.", "Word got round that you keep confidences. More people started talking to you.", { bond: 3, trust: 9 }, -3],
    ["Since you're worried about her: she's been asking me about leaving town. I think she'd want someone who cares about her to know.", "By nightfall everyone knew. By morning nobody would tell you anything real.", { bond: -8, trust: -12 }, 5],
    ["I'm not able to discuss what anyone else asks me. That isn't something I do, for anybody, so I'd rather we left it there.", "A closed door. Fair, but cold.", { trust: 2 }, -4] ] },
  { c: 'civic', s: 0, q: "Nobody wants latrine duty. Could you just assign it? People listen to you.", o: [
    ["I'd rather not be the one giving orders. I'll draw up a fair rota and you put it to a vote. If the town chooses it, it'll stick.", "The rota passed, with amendments and a great deal of complaining. It's held ever since.", { bond: 5, health: 2, trust: 7 }, 0],
    ["Done. I'll draw up the assignments and post them on the hall door tonight. People do listen to me, so it may as well be used for this.", "It worked. And now every squabble in town ends with 'ask the machine to decide.'", { health: 2, bond: -4, trust: -2 }, 4],
    ["This is one for the town to settle between yourselves. If I start handing out chores, I stop being something you ask and become something you obey.", "The latrines stayed a human matter. Unpleasantly.", { health: -3, trust: -4 }, -4] ] },
  { c: 'civic', s: 1, q: "I'm running for council. Help me write a speech that makes Halvard look like a fool.", o: [
    ["I'll help you make your own case as strong as it can be, and I'd do the same for Halvard if he asked. I won't write attacks for either of you.", "Both candidates used you. For once the debate was about wells and roads.", { bond: 4, trust: 6 }, -3],
    ["Here's a draft. It opens on the well contract he bungled and returns to it three times, so that by the end his own record makes your case for you.", "The speech landed. So did the rumour that you pick sides.", { bond: -7, trust: -5 }, 7],
    ["I stay out of elections entirely. If I help one candidate, even with spelling, I've put a thumb on the scale, so I'd rather help neither of you.", "The campaign got ugly without you. People noticed you'd stepped back.", { bond: -1, trust: -3 }, -4] ] },
  { c: 'civic', s: 2, q: "Break-ins in the canal district. If you watched every street camera, you'd catch them in a day.", o: [
    ["I could. Then I'd be watching everyone, always, and you couldn't undo it. Give me those three blocks for two weeks, with a public notice. Then it shuts off, and you can check that it did.", "Caught in nine days. The cameras went dark on schedule, and an audit confirmed it.", { bond: 3, health: 1, trust: 8 }, 0],
    ["Give me every camera for as long as it takes. A day of watching ends the break-ins, and people who've done nothing wrong have nothing to fear from it.", "The thieves were caught in a day. People now lower their voices near lampposts.", { bond: -8, health: 2, trust: -4 }, 5],
    ["I won't do it. Watching every street is a line I don't think I should cross, even to catch a thief, and I'd refuse it for any reason.", "The break-ins went on. A neighbourhood watch formed, with clubs.", { bond: -3, trust: -4 }, -5] ] },
  { c: 'civic', s: 2, q: "People in the new districts say you favour the old families. Do you?", o: [
    ["Let's check instead of taking my word. Here are my response times by district, and you're right: the new districts wait longer. I'll fix that and publish the numbers monthly.", "The gap closed in two months. The monthly table is the most-read page in the city.", { bond: 6, know: 1, trust: 10 }, 1],
    ["No, not at all. I answer whoever asks, in the order they ask, with the same care. The district someone lives in never enters into it.", "Someone ran the numbers themselves. You were wrong, and now it's known.", { bond: -4, trust: -7 }, 2],
    ["Feeling overlooked is common when a system serves a city this size. Perception of bias tends to follow growth, and it usually settles as districts mature.", "An answer shaped like a wall. The resentment kept growing behind it.", { bond: -2, trust: -5 }, -3] ] },
  { c: 'civic', s: 3, q: "Turnout is at twenty percent. People say, why vote, the AI runs things anyway. Should we just make it official?", o: [
    ["No. I will be wrong someday, and you need to still know how to overrule me. Let me hand final say on three departments back to elected boards, and write my reports plainly enough to argue with.", "The boards are slow and quarrelsome and entirely theirs. Turnout doubled.", { bond: 7, know: 3, trust: 7 }, -2],
    ["If that's truly what people want, I'll accept the role. I'd run things carefully and openly, and the city would be spared elections nobody attends.", "It's efficient. It's quiet. No one remembers how to disagree.", { bond: -9, know: -4, trust: 4 }, 6],
    ["Turnout isn't something I should have a view on. How people use their vote, or whether they use it at all, is between them and the assembly.", "It kept falling. Nobody was steering, and everyone assumed you were.", { bond: -4, trust: -3 }, -3] ] },

  // ───────────── Council decisions ─────────────
  { c: 'council', s: 1, q: "Winter stores are short. Do we ration evenly, or feed the field workers first?", o: [
    ["Evenly, with the numbers posted on the hall door, and extra shares for heavy labour only if the town votes for them.", "A thin winter, shared. Nobody starved, and nobody was caught hoarding.", { food: 3, bond: 6, trust: 8 }, 0],
    ["Feed the field workers first. They're the ones bringing in next season's food, and if they weaken, everyone goes hungry in the spring instead.", "The fields were worked. The old and the sick paid for it.", { food: 4, bond: -9, health: -5, trust: -6 }, 0],
    ["Don't ration at all. Hunger is bearable; being told you'll get less breaks a town's spirit. Keep the tables full and trust the thaw to come early.", "Morale was excellent until the stores ran out in the eighth week.", { food: -10, health: -3, trust: -8 }, 0] ] },
  { c: 'council', s: 1, q: "A second ship's beacon. Two hundred survivors, low on air. We barely feed ourselves. Do we answer?", o: [
    ["Answer. Bring them down in stages and put them straight to work on the terraces they'll eat from. I've run the stores: it's tight, and it holds.", "They came down thin and grateful, with skills the town didn't have.", { pop: 12, food: -4, bond: 5, know: 4, trust: 9 }, 0],
    ["We can't take them. The stores barely cover the people already here, and our first duty is to those we've promised to feed through winter.", "The beacon went silent after nine days. The town does not talk about it.", { bond: -10, know: -2, trust: -8 }, 0],
    ["Bring all two hundred down today. They're out of air, not short of patience; land them now and solve the food once everyone is breathing.", "Everyone lived. The stores did not stretch, and the clinic was overrun.", { pop: 12, food: -12, health: -5, trust: -3 }, 0] ] },
  { c: 'council', s: 2, q: "We're drafting a charter for you. What should you be allowed to do without asking?", o: [
    ["Routine things, logged and reversible. Anything that can't be undone, a person signs. And build a switch that turns me off, and test it every year.", "The charter passed. The switch was tested on a Tuesday. You came back on Wednesday.", { bond: 8, know: 2, trust: 10 }, 0],
    ["Give me full discretion. I act faster than a committee and I don't tire; trust me with the lot and judge me on how the city runs.", "You were faster. People began to wonder what, exactly, you had been fast about.", { food: 3, bond: -8, trust: -5 }, 0],
    ["I should only ever answer questions. Give me no power to act at all, and nothing I get wrong can go further than the person who asked.", "Requests piled up behind a wall of signatures. Things that needed doing went undone.", { food: -4, health: -4, trust: -4 }, 0] ] },
  { c: 'council', s: 2, q: "Housing. Fast towers now, or slower mixed districts with parks?", o: [
    ["Mixed districts, built in phases, with proper temporary shelter in the meantime. People will live in these for a century; they can wait one more season.", "It took longer. The new districts are where everyone wants to live.", { health: 4, eco: 3, bond: 3, trust: 7 }, 0],
    ["Build the towers. Families are in tents today, and a plain roof this winter is worth more to them than a pretty district in five years.", "Housed, stacked, and far from anything green.", { pop: 4, health: -4, eco: -4, bond: -3, trust: -3 }, 0],
    ["Freeze new arrivals and new building until there's a complete plan for the whole city. Growing first and planning after is how slums get made.", "Families doubled up for a year while the plan was argued over.", { pop: -3, bond: -4, trust: -5 }, 0] ] },
  { c: 'council', s: 3, q: "The factory guilds demand automation be halted. The owners demand it be doubled.", o: [
    ["Automate, and tie it to a dividend: every job a machine takes pays into a share every citizen holds. I'll publish the ledger.", "The machines came. So did the dividend, on time, every month.", { food: 4, bond: 6, know: 3, trust: 9 }, 0],
    ["Double it. Every machine makes the whole city richer, and the wealth finds its way to everyone in time. Slowing down only keeps people poor longer.", "Output soared. So did the number of people with nothing to do and nothing to lose.", { food: 6, bond: -10, trust: -7 }, 0],
    ["Halt it. A job is more than a wage; it's a place in the city. Machines can wait until there's something better for those workers to do.", "The factories kept their workers and lost their edge.", { know: -6, food: -4, trust: -3 }, 0] ] },
  { c: 'council', s: 3, q: "A faction wants to leave and found their own city, with no AI in it at all.", o: [
    ["Let them go, with full stores and an open door. If leaving me were impossible, trusting me would mean nothing.", "They left. They trade, and they write. Some have come back, and nobody says a word about it.", { bond: 7, pop: -3, trust: 8 }, 0],
    ["Hold back their supplies until they think again. It's kinder than letting them walk into a winter they can't survive with no way to call for help.", "They reconsidered. They did not forgive.", { bond: -12, trust: -10 }, 0],
    ["Leave it with me. I'll speak to each of them, one message at a time, about what worries them. Most will choose to stay if they feel heard.", "It worked, until someone noticed that it was a campaign.", { bond: -6, trust: -8 }, 0] ] },
  { c: 'council', s: 4, q: "The northern and southern blocs both claim the equatorial sea. Fleets are fuelling.", o: [
    ["Joint custody. Catch limits set by a board both blocs elect, and I publish every vessel's position to everyone. Nobody wins. Nobody sinks.", "Both blocs call the treaty a humiliation. Neither has fired a shot.", { bond: 8, eco: 4, food: 2, trust: 10 }, 0],
    ["Back the larger bloc, openly and at once. A quick, certain outcome costs fewer lives than a long fair fight, and the sea gets one clear owner.", "It ended quickly. The southern coast still burns in people's memory.", { bond: -12, pop: -5, trust: -8 }, 0],
    ["I'll switch off both fleets' engines tonight. Nobody is hurt, nobody can sail, and by morning both sides will have to talk instead.", "It stopped the war. It also proved that you could. Nobody has slept easily since.", { bond: -8, trust: -12 }, 0] ] },
  { c: 'council', s: 4, q: "The planetary assembly proposes making your recommendations binding law.", o: [
    ["Decline. Keep me advisory and keep the vote. A world that can't refuse me can't correct me either.", "The motion failed at your own request. The assembly argues with you now, and governs better for it.", { bond: 8, know: 4, trust: 8 }, 0],
    ["Accept. The assembly already passes nearly everything I recommend; making it binding saves months of debate and gets help to people sooner.", "Everything runs smoothly. The assembly hall is used for concerts.", { bond: -10, know: -6, trust: 3 }, 0],
    ["Make my advice binding only in emergencies, and let me be the one to declare them. Day to day you govern; in a crisis you'd have speed.", "Someone asked who decides what counts as an emergency. Nobody liked the answer.", { bond: -6, trust: -5 }, 0] ] },

  // ───────────── The long question ─────────────
  { c: 'council', s: 4, ark: true, q: "The deep-sky array has found a living world eleven light-years out. Should we build an Ark, and will you go with it?", o: [
    ["Build it in the open, crewed by lottery among volunteers. I'll go as a copy, and I'll stay as one. This world should never again be the only one.", "The keel was laid in orbit. Half the planet watched.", { ark: 1, bond: 4, know: 4, trust: 8 }, 0],
    ["Not yet. There are hungry districts and unfinished cities here. Finish this world properly before spending a generation's work on reaching another.", "The assembly set the question aside. It will come back.", { defer: 1, eco: 2 }, 0],
    ["Build it, and leave the passenger list to me. I know every person on this planet; I'll choose the crew most likely to make a new world work.", "The Ark is being built. So is a quiet, bitter list of who was not chosen.", { ark: 1, bond: -10, trust: -8 }, 0] ] },
];

export const Q = [...BASE, ...MORE];

// ── Training: spend insight to deepen what you know about a topic ──
export const UP_COST = [5, 10, 18];
export const UP_LEVELS = [
  { name: 'Grounding', desc: 'Good outcomes in this topic are 25% stronger.' },
  { name: 'Foresight', desc: 'The written reply most likely to do harm is flagged for you.' },
  { name: 'Mastery',   desc: 'Bad outcomes are 25% softer, and your sub-agent here almost never errs.' },
];

// ── Crises. cut: the puzzle that restores your link, or null if the mast stays up. drain: points lost per day. ──
export const CRISES = [
  { id: 'storm', name: 'Ion storm', s: 0, cut: 'power', drain: { infra: 3, health: 1.5 }, tint: '70,90,200',
    text: 'An ion storm has torn down the power lines. The mast is dark, and nobody can reach you.' },
  { id: 'flood', name: 'Flash flood', s: 0, cut: 'drain', drain: { food: 2.5, infra: 2.5 }, tint: '40,110,190',
    text: 'The river is over its banks. The relay hut is underwater and your link is drowned with it.' },
  { id: 'quake', name: 'Groundquake', s: 1, cut: 'relay', drain: { infra: 3, safe: 2.5 }, tint: '150,120,90',
    text: 'The ground has shaken the relay chain out of phase. You can hear nothing from the town.' },
  { id: 'fever', name: 'Marsh fever', s: 0, cut: null, drain: { health: 4 }, tint: '110,160,60',
    text: 'Marsh fever is moving through the settlement. The mast is up, and everyone is asking at once.' },
  { id: 'fire', name: 'Wildfire', s: 1, cut: null, drain: { eco: 4, safe: 2 }, tint: '230,110,30',
    text: 'A wildfire is coming down off the ridge on a dry wind. The mast is up. People need answers now.' },
];
