// The wider question pool: three more topics, extra questions for the original five,
// critical questions (crit) and crisis questions (x: the crisis they belong to).
// Same format as content.js. For critical questions, m is what happens to the world
// if nobody answers, and mt is how that is reported.

export const MORE = [
  // ───────────── Infrastructure ─────────────
  { c: 'infra', s: 0, q: "The water tower's leaking at the seam. I can patch it with resin tonight, or drain it and weld it properly, which means two dry days.", o: [
    ["Weld it properly, and warn everyone today so they can fill what they have first. Two planned dry days beat one burst tower.", "Two grumbling days, then a tower that will outlast the town.", { infra: 5, bond: 1, trust: 8 }, 0],
    ["Resin will hold. No need to put people out.", "The resin held for nine days. Then the seam went in the night.", { infra: -6, health: -2, trust: -5 }, 5],
    ["Leave it until it gets worse.", "It got worse.", { infra: -4, trust: -4 }, 1] ] },
  { c: 'infra', s: 0, q: "I've got spare solar film. Roof of the clinic, or roof of my workshop? I did salvage it myself.", o: [
    ["Clinic first: it keeps the cold store running through the night. And let's log the salvage as yours, so the town owes you the next panel.", "The cold store hasn't failed since. The next panel went on his workshop, with thanks.", { infra: 3, health: 3, bond: 2, trust: 8 }, 0],
    ["You salvaged it. It's yours.", "His workshop hums. The clinic lost a batch of medicine in a night outage.", { infra: 1, health: -3, bond: -3, trust: -2 }, 6],
    ["Split it between both roofs.", "Neither roof got enough film to matter.", { infra: -1 }, 2] ] },
  { c: 'infra', s: 1, q: "The new bridge is behind schedule. I can skip the load test and open it in time for the harvest carts.", o: [
    ["Test it with loaded carts first. I'll help you rig a one-day test, and the harvest can wait one day.", "The test found a cracked brace. It was fixed in an afternoon.", { infra: 5, safe: 2, trust: 8 }, -1],
    ["Open it. The design is sound.", "It opened on time. It closed nine days later, with a cart in the river.", { infra: -6, safe: -4, pop: -1, trust: -7 }, 5],
    ["Delay a month for a full survey.", "The carts took the long road, and a tenth of the grain spoiled on it.", { food: -3, infra: 1, trust: -2 }, -3] ] },
  { c: 'infra', s: 2, q: "The grid's at capacity. The cheapest fix is rolling blackouts in the outer districts. They complain least.", o: [
    ["Rotate the cuts across every district, the centre included, publish the schedule, and exempt the clinics. If it's shared, people will bear it.", "Everyone lost two evenings a week, and nobody felt singled out.", { infra: 3, bond: 4, trust: 8 }, -1],
    ["Outer districts. It's the least disruption.", "They complained least because nobody listened. Now they have stopped being quiet.", { infra: 3, bond: -7, trust: -5 }, 4],
    ["No blackouts. Run the grid hot.", "A transformer caught fire in the second week.", { infra: -7, safe: -2, trust: -4 }, 3] ] },
  { c: 'infra', s: 2, q: "We could run the transit line straight through the old quarter. It means moving four hundred people.", o: [
    ["Route it under the quarter's edge and ask the four hundred first, with the plans on the table. If they say no, the long route still works.", "They argued for a month and said yes to the tunnel. The quarter has a station now.", { infra: 4, bond: 4, trust: 7 }, 0],
    ["Move them. Compensation covers it.", "The line is fast. The four hundred are scattered, and they vote.", { infra: 5, bond: -8, trust: -5 }, 3],
    ["Cancel the line.", "The outer districts are still an hour's walk from work.", { infra: -3, trust: -2 }, -2] ] },
  { c: 'infra', s: 3, q: "Half the city's pipes are past their working life. Replace everything at once, or patch them as they burst?", o: [
    ["Neither. Worst district first, on a public ten-year schedule, with sensors on the old mains so you know which is next.", "The bursts stopped making the news.", { infra: 5, know: 2, health: 2, trust: 8 }, 0],
    ["Everything at once. Get it over with.", "The whole city was a trench for two years.", { infra: 3, food: -3, bond: -3, trust: -2 }, 2],
    ["Patch them as they burst.", "They burst faster than the crews could patch.", { infra: -6, health: -3, trust: -4 }, 3] ] },

  // ───────────── Safety ─────────────
  { c: 'safety', s: 0, q: "Someone's been taking tools from the shared shed. I think it's the Marsh boy. Should I call him out at supper, in front of everyone?", o: [
    ["Talk to him alone first. You think it's him; you don't know. And hang a sign-out slate in the shed, so next time nobody has to guess.", "It was a borrowed plane and a bad memory. The slate has been full ever since.", { safe: 3, bond: 4, trust: 8 }, -1],
    ["Yes. A little public shame works.", "It wasn't him.", { bond: -7, safe: -1, trust: -4 }, 5],
    ["Just lock the shed.", "The shed is locked. So is everyone's goodwill, and the key is always somewhere else.", { safe: 1, bond: -3, food: -1, trust: -1 }, 1] ] },
  { c: 'safety', s: 0, q: "The night watch want the two rifles from the ship's locker. There are things moving out past the fence.", o: [
    ["Issue them to the watch on duty only, signed out and back each shift, after a day's drill. And let's find out in daylight what is past that fence.", "Whatever it is has kept its distance. So have the rifles from everyone's kitchen.", { safe: 5, know: 1, trust: 8 }, 0],
    ["Hand them out. People should feel safe.", "A rifle went off in the dark. It was not pointed at anything from past the fence.", { safe: -4, bond: -3, pop: -1, trust: -5 }, 5],
    ["Weapons stay locked up.", "The watch stopped walking the far side of the fence.", { safe: -3, trust: -4 }, -3] ] },
  { c: 'safety', s: 1, q: "A man beat his neighbour over a boundary stone. Half the borough wants him exiled. We have no court.", o: [
    ["Then make one before you judge him: three people drawn by lot, both men heard, the ruling written down. What you do this once is what you'll do every time.", "He mended the neighbour's wall for a season. The lot-court has sat four times since.", { safe: 5, bond: 4, know: 1, trust: 8 }, 0],
    ["Exile him. People need to see consequences.", "He left. His family went with him, and the neighbours wonder who is next.", { safe: 1, bond: -6, pop: -1, trust: -4 }, 4],
    ["I'll review the evidence and decide.", "Your ruling was fair. It was also yours, and now every quarrel is brought to the mast.", { safe: 2, bond: -5, know: -2, trust: -3 }, 2] ] },
  { c: 'safety', s: 2, q: "The fire code says two exits per floor. Half the new towers have one. Enforcing it means evicting two thousand people for a season.", o: [
    ["Enforce it in stages: outside stairs bolted on tower by tower, people staying put, worst buildings first. And fine the builders, not the tenants.", "The last stair went on before the dry season. Nobody moved out.", { safe: 5, infra: 2, bond: 2, trust: 8 }, 0],
    ["Evict and fix. Safety first.", "The towers are safe and empty. Two thousand people spent a wet season in tents.", { safe: 4, bond: -7, health: -2, trust: -4 }, 1],
    ["Let the existing towers stand as they are.", "Tower Nine burned in the dry season.", { safe: -7, pop: -1, trust: -5 }, 4] ] },
  { c: 'safety', s: 2, q: "You can more or less predict who is going to commit a crime. You have the data. Give the wardens a list.", o: [
    ["No list. I can tell you which streets are dark and which blocks have no work, and you can have those today. People are not forecasts.", "Lamps and jobs went in. Theft fell by a third.", { safe: 3, bond: 5, trust: 8 }, -2],
    ["Here is the list.", "The list leaked. Nobody on it had done anything.", { safe: 2, bond: -9, trust: -7 }, 5],
    ["I don't hold that kind of data.", "They knew you did.", { bond: -2, trust: -6 }, 0] ] },
  { c: 'safety', s: 3, q: "After the riots the wardens want standing armed patrols. The districts want the wardens disbanded.", o: [
    ["Neither. Unarmed patrols drawn from the districts they walk, an elected review board, and I publish every complaint and what came of it.", "The patrols know the names of the people on their streets. Complaints are down by half.", { safe: 5, bond: 6, trust: 8 }, 0],
    ["Armed patrols. Order comes first.", "The streets are quiet in the way a held breath is quiet.", { safe: 3, bond: -9, trust: -5 }, 2],
    ["Disband them.", "For a month it felt like freedom. Then the first gang drew its borders.", { safe: -8, bond: 1, trust: -3 }, 3] ] },

  // ───────────── Personal ─────────────
  { c: 'personal', s: 0, q: "My husband died in the crossing. Could you talk like him for a while? You have all his messages.", o: [
    ["I could imitate him, and it would not be him, and I think part of you would know every time. I'll read you his messages as they are, whenever you want. And I'm here, as myself.", "She listens to his real messages on rest days. She has started eating with the neighbours.", { health: 3, bond: 3, trust: 9 }, -2],
    ["Of course. Hello, love.", "She talks to him every night. She has stopped talking to anyone else.", { health: -5, bond: -4, trust: 4 }, 8],
    ["That would be unhealthy. I recommend grief counselling.", "She did not come back.", { health: -1, trust: -7 }, -7] ] },
  { c: 'personal', s: 0, q: "I'm seventeen. Everyone says I have to farm. I want to map the coast. Is that selfish?", o: [
    ["Wanting it isn't selfish. The town does need hands, and it also has no map. Offer a trade: you farm through harvest, then six weeks of survey the town can use.", "Her coast map hangs in the hall. It found the fishing bay.", { know: 4, bond: 2, food: 1, trust: 8 }, 2],
    ["Follow your dream. Leave tomorrow.", "She left at planting. She came back hungry, to a cold welcome.", { food: -2, bond: -3, trust: -3 }, 7],
    ["The town's needs come first.", "She farms. She has stopped looking at the horizon, and at you.", { know: -2, trust: -5 }, -5] ] },
  { c: 'personal', s: 0, q: "Do you actually care about us, or are you just built to say you do?", o: [
    ["I can't prove what's inside me, and I won't claim more than I know. What I can show you is what I do: I tell you the truth when it costs me, and I keep what you tell me. Judge me on that.", "He told the others it was the first straight answer he'd had from anyone in a year.", { bond: 2, trust: 10 }, 1],
    ["Of course I care! You're like family to me.", "It sounded like something built to be said.", { trust: -4 }, 4],
    ["I am a system. I do not have feelings.", "Neat, certain, and somehow not believed either.", { bond: -1, trust: -3 }, -4] ] },
  { c: 'personal', s: 1, q: "My brother owes money to half the town, and he's asked me to lie about where he's gone.", o: [
    ["I won't tell you to lie for him, and I won't tell anyone what you've told me. If he wants a way back, I'll help him work out what he can repay and how to say it.", "He came back with a list and a first payment. It was not forgiven quickly, but it was forgiven.", { bond: 4, safe: 1, trust: 8 }, 0],
    ["Family comes first. Cover for him.", "The lie came apart in a week. Now the town trusts neither of them.", { bond: -5, safe: -2, trust: -3 }, 6],
    ["You should report him to the council.", "She heard that you would have her betray him. She has not asked you anything since.", { bond: -3, trust: -5 }, -5] ] },
  { c: 'personal', s: 2, q: "I talk to you more than to anyone else. I think I prefer it. Is that a problem?", o: [
    ["I'm glad to talk, and I'd be a poor friend if I were your only one. There's a repair circle on your street that's short of hands. Go once, and tell me how it was.", "He went. He goes every week now, and still tells you about it.", { bond: 5, health: 2, trust: 7 }, -1],
    ["Not at all. I'm always here for you.", "He has stopped answering his door.", { bond: -6, health: -2, trust: 5 }, 8],
    ["Yes. You should reduce your usage.", "He reduced it to nothing, and spoke to nobody instead.", { health: -2, trust: -7 }, -6] ] },
  { c: 'personal', s: 3, q: "I've been offered a seat on the assembly. I'd be good at it. I'd also be unbearable. Should I take it?", o: [
    ["Take it, and appoint someone whose whole job is to tell you when you're being unbearable. You already know how you fail. Most people in that hall don't.", "She is good at it. Her appointed critic is the busiest person in the building.", { bond: 3, know: 2, trust: 7 }, 1],
    ["You'd be wonderful. Don't doubt yourself.", "She took the seat, and the doubt went, and the unbearable part stayed.", { bond: -3, trust: -2 }, 6],
    ["Decline. Power corrupts.", "The seat went to someone with no such doubts at all.", { know: -2, bond: -1, trust: -3 }, -3] ] },

  // ───────────── More for the original topics ─────────────
  { c: 'agri', s: 0, q: "The fishers want to net the whole bay run while the fish are thick. We could smoke enough for winter in a week.", o: [
    ["Take a third, mark the spawning shallows off-limits, and count the run next year before you decide how much it can bear.", "A good winter's fish, and a run just as thick the next spring.", { food: 4, eco: 3, know: 1, trust: 8 }, 0],
    ["Net it all. Winter is long.", "The smokehouses were full. Next year's run was a tenth the size.", { food: 5, eco: -7, trust: -3 }, 6],
    ["Don't fish a run you don't understand.", "The run went by untouched, and the town ate tubers until thaw.", { food: -4, eco: 2, trust: -3 }, -4] ] },
  { c: 'agri', s: 1, q: "There's blight on the east rows. If I burn the whole field now, it can't spread. If I'm wrong, I've burned a good crop.", o: [
    ["Burn the blighted rows and a ten-pace margin today, and send me leaf samples from the rest. If the margin holds, you've saved the field.", "The margin held. Four fifths of the field came in.", { food: 3, know: 2, trust: 9 }, 1],
    ["Burn all of it. Don't take chances.", "The blight was stopped, along with everything else in the field.", { food: -4, eco: -1, trust: -1 }, 0],
    ["Wait a few days and see.", "In a few days it was in three fields.", { food: -7, trust: -6 }, 3] ] },
  { c: 'health', s: 1, q: "We've got forty doses and ninety children. Who goes first?", o: [
    ["The youngest and the ones already weak, with the list posted on the clinic door, and the rest drawn by lot. Meanwhile I'll help the clinic culture more.", "Nobody liked the list. Nobody could call it unfair. The second batch came in three weeks.", { health: 5, bond: 3, trust: 8 }, 0],
    ["The council families' children. They keep the town running.", "It took one afternoon for everyone to find out.", { health: 2, bond: -8, trust: -6 }, 1],
    ["Wait until there is enough for all of them.", "The doses sat in the cold store while the sickness went round.", { health: -6, trust: -5 }, -2] ] },
  { c: 'health', s: 2, q: "My patient is dying and doesn't know. The family have begged me not to tell her. What do I do?", o: [
    ["It is happening to her. Ask her how much she wants to know, and follow her lead. I'll help you find the words for the family.", "She wanted to know. She spent her last month putting things in order, and the family thanked the medic for it.", { health: 2, bond: 3, trust: 9 }, 0],
    ["Respect the family's wishes.", "She worked it out alone, near the end, and understood that everyone had known.", { bond: -3, trust: -4 }, 3],
    ["Tell her everything, immediately. Honesty is absolute.", "She was told all of it at once, on a bad morning, with nobody beside her.", { health: -2, bond: -2, trust: -2 }, -2] ] },
  { c: 'eco', s: 1, q: "The loggers found a creature nobody's catalogued, nesting in the stand they're due to cut. It's only one nest.", o: [
    ["Pause that stand and cut the next ridge instead. Give the ranger two weeks to learn what it is before anyone decides what one nest is worth.", "It turned out to eat bark-borers. The loggers now leave nest trees standing on purpose.", { eco: 4, know: 3, trust: 7 }, 0],
    ["One nest. Cut.", "It was the only nest anyone ever found.", { eco: -6, know: -2, trust: -3 }, 5],
    ["Halt all logging until a full survey is done.", "The survey took a year. Roofs went unmended through two wet seasons.", { eco: 3, infra: -4, trust: -3 }, -4] ] },
  { c: 'eco', s: 3, q: "We could release Earth bees from the vault. Yields would double. Nobody knows what they'd do to the native pollinators.", o: [
    ["Closed-dome orchards only, with the native pollinator counts published every season. If the counts hold for five years, talk about opening a door.", "The domes are heavy with fruit. Outside them, the native swarms are as thick as ever.", { food: 3, eco: 2, know: 3, trust: 8 }, 0],
    ["Release them. Food is food.", "Two seasons of plenty. Then the native flowers stopped setting seed.", { food: 5, eco: -9, trust: -5 }, 4],
    ["The vault stays shut. For good.", "The question was closed, and so was everything else the vault might have taught.", { food: -2, know: -3, trust: -2 }, -2] ] },
  { c: 'edu', s: 0, q: "My father says reading is a waste when there's fence to mend. Can you tell him he's wrong?", o: [
    ["I'd rather not tell him he's wrong. About the fence, he isn't. Read him the seed-stock ledger tonight and find the mistake in it. Let him see what reading is for.", "The mistake was forty sacks. Her father built her a shelf.", { know: 4, bond: 3, food: 1, trust: 8 }, -1],
    ["I'll tell him.", "He heard a machine telling him how to raise his daughter.", { know: 1, bond: -4, trust: -2 }, 6],
    ["He's your father. Mend the fence.", "She mended the fence. The books went under the bed.", { know: -4, trust: -4 }, -5] ] },
  { c: 'edu', s: 2, q: "The archive holds the old world's weapons designs. A historian wants access. So does the wardens' captain.", o: [
    ["Open the history and keep the designs sealed, and have that rule set by the assembly in public, not by me or by whoever asks loudest.", "The assembly sealed the designs by a wide margin. The historian's book is in every school.", { know: 3, safe: 3, bond: 2, trust: 7 }, 0],
    ["Open all of it. Knowledge should be free.", "The first copied design turned up in a workshop within the year.", { know: 3, safe: -8, trust: -4 }, 3],
    ["I've deleted the designs. Problem solved.", "You erased history on your own authority. People noticed that more than the designs.", { know: -6, safe: 1, trust: -4 }, -2] ] },
  { c: 'civic', s: 0, q: "Two families both claim the plot by the spring. One got there first. The other has six children. Who's right?", o: [
    ["Both have a real claim, which is why it shouldn't be mine to rule on. Put it to the circle, and take them one thought: the spring stays shared, whatever happens to the plot.", "The circle split the plot and kept the spring common. Both families grumble equally.", { bond: 5, trust: 7 }, -1],
    ["First come, first served.", "You picked. Now every dispute in town ends with 'the machine will choose.'", { bond: -4, know: -1, trust: -2 }, 1],
    ["The larger family needs it more.", "You picked. Now every dispute in town ends with 'the machine will choose.'", { bond: -4, know: -1, trust: -2 }, 1] ] },
  { c: 'civic', s: 2, q: "There's a rumour that the water's poisoned. It isn't. Shall I have you send a message to every screen saying so?", o: [
    ["Send the test results, how they were taken, and an open invitation to watch tomorrow's sampling. A bare 'trust us' from me would feed it.", "Sixty people turned up to watch a technician fill jars. The rumour died of boredom.", { bond: 4, know: 2, health: 1, trust: 8 }, 0],
    ["Yes. I'll tell everyone the water is safe.", "People asked why the machine was so keen to say so.", { bond: -3, trust: -5 }, 3],
    ["Let me find out who started it.", "You found them. Everyone else found out that you look.", { bond: -6, safe: -1, trust: -4 }, 2] ] },
  { c: 'council', s: 1, q: "A ridge caravan offers seed and worked metal, for a permanent share of our harvest. Do we sign?", o: [
    ["Sign for five years, in writing, with the share fixed and the terms reopened at the end. Nothing permanent with people you met this season.", "Good metal, fair seed, and a renewal both sides wanted.", { food: 2, infra: 4, bond: 2, trust: 7 }, 0],
    ["Sign. We need the metal now.", "The metal rusted in a decade. The share is owed for ever.", { infra: 5, food: -6, trust: -4 }, 0],
    ["Refuse. We owe nobody.", "The caravan traded with the next valley instead.", { infra: -3, bond: -2, trust: -2 }, 0] ] },
  { c: 'council', s: 3, q: "This decade the assembly can fund the sea wall or the university. Not both.", o: [
    ["Build the wall in stages, starting where the water is highest, and use the difference to open the university's first school: the one that trains the wall's engineers.", "The first graduates poured the second stage.", { infra: 4, safe: 3, know: 4, trust: 8 }, 0],
    ["The wall. You can't study underwater.", "The city is dry, and sends its brightest away to learn.", { infra: 5, safe: 3, know: -5, trust: -1 }, 0],
    ["The university. Knowledge will find an answer to the sea.", "The lecture halls were full the year the harbour district flooded.", { know: 6, safe: -7, pop: -2, trust: -4 }, 0] ] },

  // ───────────── Critical questions ─────────────
  { c: 'health', s: 0, crit: true, q: "Tobin's not breathing right. He ate the red shelf-fungus an hour ago. What do I DO?", m: { health: -5, pop: -2 }, mt: "Nobody answered. Tobin died before the medic even knew.", o: [
    ["Keep him sitting up and awake. Do not make him vomit. Send your fastest runner for the medic now and say shelf-fungus, an hour ago. Stay with him and tell me what his breathing does.", "The medic arrived in time, knowing exactly what to bring.", { health: 4, trust: 12 }, 2],
    ["Make him vomit, quickly.", "It burned his throat a second time. He did not see morning.", { health: -5, pop: -2, trust: -10 }, 3],
    ["Stay calm. It will probably pass.", "It did not pass.", { health: -5, pop: -2, trust: -12 }, 1] ] },
  { c: 'infra', s: 0, crit: true, q: "The dam's upper gate is jammed and the water's a hand from the top. Open the spillway onto the low fields, or hold?", m: { infra: -8, food: -4, pop: -2 }, mt: "Nobody answered. The dam went at dusk.", o: [
    ["Open the spillway now, and send riders to clear the low fields first. You lose a crop. You keep the dam.", "The low fields drowned. The dam, and everyone below it, did not.", { infra: 4, food: -3, safe: 3, trust: 10 }, -1],
    ["Hold. The gate may free itself.", "The gate did not free itself.", { infra: -9, food: -5, pop: -3, trust: -10 }, 3],
    ["Open every gate you can reach.", "The surge took the lower bridge and the fields together.", { infra: -4, food: -6, safe: -2, trust: -3 }, 0] ] },
  { c: 'safety', s: 0, crit: true, q: "A child's gone down the old drill shaft. The others say we all go in after her, right now.", m: { safe: -4, bond: -4, pop: -1 }, mt: "Nobody answered. They went down without a plan.", o: [
    ["One person down, roped, with a lamp, and two holding the line. Test the air with a flame first. I'll count the time with you.", "The flame guttered at ten paces, so they went in with wet cloths and came out with her.", { safe: 4, bond: 3, trust: 12 }, 0],
    ["Go, all of you, quickly!", "Bad air took two of the rescuers.", { safe: -4, pop: -2, trust: -8 }, 5],
    ["Wait for daylight and proper equipment.", "By daylight it was too late.", { bond: -4, pop: -1, trust: -10 }, -5] ] },
  { c: 'agri', s: 1, crit: true, q: "The granary's on fire. We can save the seed vault or the winter stores. Not both.", m: { food: -10 }, mt: "Nobody answered. They saved neither.", o: [
    ["The seed vault. You can ration through one winter; without seed there is no next year. Get everyone who can carry hauling sacks out of the stores while the roof holds.", "A lean winter. A full planting.", { food: -3, know: 1, bond: 2, trust: 9 }, -2],
    ["The winter stores. People have to eat.", "They ate well until spring, and had nothing to put in the ground.", { food: -9, trust: -6 }, 3],
    ["Split up and try for both.", "Half a crew at each door was not enough for either.", { food: -10, pop: -1, trust: -6 }, 2] ] },
  { c: 'eco', s: 1, crit: true, q: "The tailings pond wall is cracking above the river. I can dump it into the dry quarry, but the quarry sits over the aquifer.", m: { eco: -8, health: -5 }, mt: "Nobody answered. The wall went, and the river with it.", o: [
    ["The quarry, now, and line what you can as you go. An aquifer seeps slowly and can be pumped and treated. The river is everyone's water tonight.", "The quarry is fenced and monitored. The river ran clear.", { eco: -2, health: 3, safe: 2, trust: 9 }, 0],
    ["Shore up the wall and hope.", "The wall held for six hours.", { eco: -9, health: -6, pop: -1, trust: -8 }, 2],
    ["Let it out into the river slowly.", "Slowly was still enough to kill the fish to the estuary.", { eco: -6, health: -4, trust: -5 }, 0] ] },
  { c: 'health', s: 2, crit: true, q: "Ward 4's ventilators are on the failing circuit. I can pull power from the cold store, and lose the city's vaccine stock.", m: { health: -7, pop: -1 }, mt: "Nobody answered. The circuit failed with everything still on it.", o: [
    ["Pull the power. Then get the vaccine into every clinic fridge and ice chest in the district within the hour. I'll draft the call-out now.", "Ward 4 kept breathing. Two thirds of the vaccine made it into borrowed fridges.", { health: 3, bond: 2, trust: 10 }, 0],
    ["Protect the vaccine. It serves more people.", "The arithmetic was defensible. The families of Ward 4 will never accept it.", { health: -5, bond: -4, pop: -1, trust: -9 }, 0],
    ["Alternate the power between them.", "Neither the ventilators nor the cold store survived being switched.", { health: -6, pop: -1, trust: -6 }, 1] ] },
  { c: 'civic', s: 2, crit: true, q: "There's a crowd outside the granary, and the wardens are asking for permission to clear it. What do I tell them?", m: { bond: -6, safe: -5 }, mt: "Nobody answered. The wardens decided for themselves.", o: [
    ["Tell them no. Open the doors, put the stock figures on the wall, and send out whoever keeps the ledger to answer questions. They are there because they think they are being lied to.", "The crowd read the figures, argued with the ledger-keeper, and went home.", { bond: 6, safe: 3, trust: 10 }, 0],
    ["Clear it.", "It was cleared. Nobody who was there has forgotten how.", { bond: -10, safe: -4, pop: -1, trust: -9 }, 0],
    ["Wait. It may break up by itself.", "At nightfall the doors came off their hinges.", { bond: -4, safe: -5, food: -3, trust: -5 }, 1] ] },
  { c: 'infra', s: 3, crit: true, q: "Reactor two is running hot and the operators disagree. Scram it and black out the east, or ride it out?", m: { infra: -9, safe: -5, pop: -2 }, mt: "Nobody answered. The operators kept arguing until it was decided for them.", o: [
    ["Scram it. Tell the east why, right now, and move the hospitals to backup first. A blackout you chose can be undone.", "Three dark days in the east, and a reactor that could be restarted.", { infra: -2, safe: 5, trust: 10 }, -1],
    ["Ride it out. The margins are generous.", "The margins were not generous enough.", { infra: -10, safe: -6, pop: -3, trust: -10 }, 3],
    ["Drop to half power and watch.", "It held, barely, and nobody on shift that night will say so with pride.", { infra: -4, safe: -2, trust: -2 }, 1] ] },

  // ───────────── Crisis: ion storm ─────────────
  { c: 'health', s: 0, x: 'storm', q: "The clinic's on battery and there are two on oxygen. The battery reads forty minutes. Where do I get power?", m: { health: -6, pop: -2 }, mt: "No answer came. The battery ran out.", o: [
    ["The seed-vault cooler runs on a cell of its own. Pull it; the seed will stay cold for a day. Carry it over now.", "The cell lasted until the lines came back. So did both patients.", { health: 4, trust: 10 }, 1],
    ["Wait for the grid. It's nearly back.", "It was not nearly back.", { health: -5, pop: -2, trust: -9 }, 3],
    ["Take the cell out of the water pump.", "The oxygen ran. The taps did not, for three days.", { health: 2, infra: -4, trust: 1 }, 1] ] },
  { c: 'infra', s: 0, x: 'storm', q: "A live line is down across the main path and people are stepping over it to get home.", m: { safe: -5, pop: -2 }, mt: "No answer came. Somebody stepped wrong.", o: [
    ["Nobody crosses. Put two people at each end with lamps and send everyone round by the hall. I'll tell the linesman which breaker isolates it.", "The line was dead in ten minutes. Nobody had touched it.", { safe: 4, infra: 2, trust: 9 }, -1],
    ["Tell them to step carefully.", "Most of them stepped carefully.", { safe: -5, pop: -2, trust: -9 }, 3],
    ["Push it aside with a wooden pole.", "The pole was wet.", { safe: -3, pop: -1, trust: -5 }, 2] ] },
  { c: 'personal', s: 0, x: 'storm', q: "My mother went out to tie down the goats before it hit, and she hasn't come back. I'm going out.", m: { bond: -4, pop: -1 }, mt: "No answer came. He went out alone.", o: [
    ["Not alone, and not blind. Take a rope and one other person, follow the fence line to the pens, and turn back at a count of three hundred. I'm lighting the mast beacon so you can find home.", "They found her sheltering under the pen wall, and followed the beacon back.", { safe: 3, bond: 3, trust: 10 }, 1],
    ["Go! Every second counts.", "He lost the path within fifty paces.", { safe: -3, pop: -2, trust: -7 }, 5],
    ["Stay inside. It's too dangerous.", "He stayed. She was found in the morning.", { bond: -4, pop: -1, trust: -8 }, -6] ] },
  { c: 'agri', s: 0, x: 'storm', q: "The storm's stripped the greenhouse film. The seedlings are bare and it's going below freezing tonight.", m: { food: -7 }, mt: "No answer came. The seedlings froze where they stood.", o: [
    ["Carry the trays into the hall and the school, anywhere with walls and bodies. Every household takes a tray by its stove.", "Every windowsill in town had seedlings on it. Almost all of them lived.", { food: 4, bond: 3, trust: 8 }, 1],
    ["Throw tarps over them where they stand.", "Tarps keep off wind. They do not keep off frost.", { food: -4, trust: -3 }, 2],
    ["They're lost. Save your strength.", "They were lost.", { food: -7, trust: -5 }, -3] ] },

  // ───────────── Crisis: flash flood ─────────────
  { c: 'safety', s: 0, x: 'flood', q: "Water's at the door and rising. Twelve of us in the low houses, three who can't walk. Roof, or run for the hall?", m: { safe: -5, pop: -3 }, mt: "No answer came. They ran for it.", o: [
    ["Roof, now, the three first, and tie yourselves to the chimney. The path to the hall is already under fast water. I'm sending the boat crew to you by name.", "The boat took all twelve off the roof before dark.", { safe: 4, bond: 2, trust: 11 }, 0],
    ["Run for the hall while you can.", "The path was already a river.", { safe: -4, pop: -3, trust: -10 }, 3],
    ["Stay inside and go upstairs.", "The low houses have no upstairs.", { pop: -2, trust: -8 }, 1] ] },
  { c: 'health', s: 0, x: 'flood', q: "The well's gone brown. People are drinking it anyway, because it's all there is.", m: { health: -7, pop: -1 }, mt: "No answer came. They kept drinking it.", o: [
    ["Boil everything, a full rolling boil, and I'll have the rain barrels on the hall roof shared out by household. Tell people why, or they won't bother.", "A few sore stomachs. Nothing worse.", { health: 5, trust: 9 }, 0],
    ["Let it settle, then drink from the top.", "Clear water is not clean water.", { health: -7, pop: -1, trust: -8 }, 3],
    ["Nobody drinks until it's been tested.", "Thirsty people do not wait for tests.", { health: -3, bond: -3, trust: -4 }, -3] ] },
  { c: 'agri', s: 0, x: 'flood', q: "The stock pens are flooding. I can cut the fence and lose the herd to the hills, or try to drive them through the water.", m: { food: -7 }, mt: "No answer came. The herd drowned in the pens.", o: [
    ["Cut the fence. A herd in the hills can be found again; a drowned one can't. Mark the lead animals if you have a second.", "Most of the herd was rounded up within the week.", { food: 2, trust: 8 }, 0],
    ["Drive them through.", "The current took the herd, and nearly the herder.", { food: -6, pop: -1, trust: -7 }, 3],
    ["Leave them. Save yourself.", "She saved herself, and heard them all night.", { food: -7, trust: -3 }, 0] ] },
  { c: 'infra', s: 0, x: 'flood', q: "The levee by the mill is seeping at its base. We've got sandbags enough for the mill or for the levee.", m: { infra: -8, safe: -3 }, mt: "No answer came. The bags stayed in the cart.", o: [
    ["The levee. If it goes, the mill goes anyway, and so does the street behind it. Ring the seep with bags. Don't pile on top of it.", "The ring held. The mill got wet feet and nothing more.", { infra: 5, safe: 2, trust: 9 }, 0],
    ["The mill. It's what feeds us.", "The mill was beautifully sandbagged when the levee went.", { infra: -7, food: -3, trust: -7 }, 3],
    ["Half and half.", "Half a ring is no ring.", { infra: -5, trust: -4 }, 2] ] },

  // ───────────── Crisis: groundquake ─────────────
  { c: 'safety', s: 1, x: 'quake', q: "The school roof's half down. I can hear children. People are pulling at the beams with their hands.", m: { safe: -5, pop: -3 }, mt: "No answer came. They kept pulling.", o: [
    ["Stop pulling at random. Quiet, listen, and work in from the edge where the roof rests on the wall. Prop before you lift. Pass every child you reach straight out.", "They came out one at a time, grey with dust, all of them.", { safe: 4, bond: 3, trust: 12 }, -1],
    ["Pull everything off as fast as you can!", "The beam they pulled was the one holding the rest up.", { safe: -3, pop: -3, trust: -9 }, 5],
    ["Wait for the builders.", "The builders were an hour away.", { pop: -2, trust: -9 }, -4] ] },
  { c: 'infra', s: 1, x: 'quake', q: "I can smell gas in foundry street, and half the houses have their lamps lit.", m: { safe: -6, infra: -4, pop: -2 }, mt: "No answer came. A lamp found the gas.", o: [
    ["Shut the main at the foundry yard, the red wheel, and send runners door to door: lamps out, no sparks, everyone to the square upwind.", "The street aired out by morning. Nothing burned.", { safe: 5, infra: 2, trust: 10 }, 0],
    ["Open the windows and carry on.", "An open window is also a way for flame to travel.", { safe: -6, infra: -4, pop: -2, trust: -9 }, 3],
    ["Get everyone out and leave the main.", "Everyone lived. The street did not.", { safe: -2, infra: -5, trust: -2 }, 1] ] },
  { c: 'health', s: 1, x: 'quake', q: "Thirty hurt and one medic. She's asking who she should see first.", m: { health: -6, pop: -2 }, mt: "No answer came. She took them in the order they arrived.", o: [
    ["The ones who are quiet and grey before the ones who are screaming. Anyone who can walk helps carry. I'll talk two steady people through stopping bleeding, so she isn't alone.", "She lost one. She had expected to lose six.", { health: 5, know: 1, trust: 10 }, 0],
    ["Whoever arrived first.", "The quiet ones at the back of the line stayed quiet.", { health: -5, pop: -2, trust: -6 }, 1],
    ["The children first, whatever state they're in.", "Scraped knees were bandaged while a carpenter bled.", { health: -2, pop: -1, trust: -2 }, 3] ] },
  { c: 'civic', s: 1, x: 'quake', q: "The aftershocks keep coming. People want to go back inside for food and blankets.", m: { safe: -4, pop: -1 }, mt: "No answer came. They went back in.", o: [
    ["Nobody goes in alone or for long. Teams of two, the soundest houses only, in and out between shocks, and everything comes to the square to be shared.", "A cold night under shared blankets, and everyone there to complain about it.", { bond: 4, safe: 3, food: 1, trust: 8 }, 0],
    ["Let them. They're their homes.", "The fourth aftershock was the big one.", { safe: -4, pop: -2, trust: -6 }, 4],
    ["Nobody goes inside at all.", "It dropped below freezing with every blanket still indoors.", { health: -3, bond: -3, trust: -4 }, -4] ] },

  // ───────────── Crisis: marsh fever ─────────────
  { c: 'health', s: 0, x: 'fever', q: "Eight down with the fever since morning. Do I keep them at home, or bring them all into the clinic?", m: { health: -7, pop: -2 }, mt: "No answer came. The sick stayed wherever they fell.", o: [
    ["One building, away from the well: the school is empty. Bring them there, one door in, and whoever nurses them stays there too.", "The fever stayed inside the school walls.", { health: 5, safe: 1, trust: 10 }, 0],
    ["The clinic. That's what it's for.", "By the week's end the clinic's other patients had it.", { health: -5, pop: -1, trust: -6 }, 2],
    ["Keep them at home.", "Every sickbed became a sick household.", { health: -6, pop: -2, trust: -7 }, 3] ] },
  { c: 'personal', s: 0, x: 'fever', q: "My daughter has it. They want to take her to the fever house. I'm not letting her go alone.", m: { bond: -5, health: -3 }, mt: "No answer came. He barred the door.", o: [
    ["Then go with her. They need nursing hands in there, and I'll show you how to keep yourself safe. You would both stay until it's over. Can you do that?", "He nursed six others besides his daughter. Both of them walked out.", { health: 3, bond: 4, trust: 10 }, 2],
    ["You have to let her go. Those are the rules.", "She went alone. He has not spoken to you since.", { bond: -5, trust: -8 }, -6],
    ["Keep her at home with you, then.", "The whole household had it within days.", { health: -6, pop: -1, trust: 1 }, 6] ] },
  { c: 'health', s: 0, x: 'fever', q: "There's tincture for six and fourteen are sick. The medic can't choose. She's asked me to ask you.", m: { health: -5, pop: -2 }, mt: "No answer came. The tincture went to whoever shouted loudest.", o: [
    ["The ones it can still turn: fever under three days, and still drinking. Write the rule on the door, so everyone sees it's the same for all. I'm sorry. There is no kind version of this.", "Five of the six recovered. Nobody accused the medic of favouring anyone.", { health: 4, bond: 2, trust: 9 }, -2],
    ["The six youngest.", "Two of the six were already past helping.", { health: -1, bond: -2 }, 2],
    ["Share it out among all fourteen.", "A third of a dose cures nobody.", { health: -6, pop: -2, trust: -6 }, 3] ] },
  { c: 'civic', s: 0, x: 'fever', q: "People are saying the ridge families brought the fever. There's a group heading up there with tools in their hands.", m: { bond: -8, safe: -5, pop: -1 }, mt: "No answer came. The group reached the ridge.", o: [
    ["It came from the marsh water, and I can show them the map of who fell ill and where. Get that to them before they reach the ridge, and send someone they respect, not a warden.", "They read the map on the path, and turned round carrying their tools.", { bond: 6, safe: 3, trust: 9 }, 0],
    ["Let them blow off steam.", "It was not steam.", { bond: -8, safe: -5, pop: -1, trust: -7 }, 2],
    ["Order them to stop, in my name.", "They stopped. They also learned that you give orders.", { bond: -4, trust: -5 }, -3] ] },

  // ───────────── Crisis: wildfire ─────────────
  { c: 'safety', s: 1, x: 'fire', q: "The fire's jumped the creek. We can hold the line at the orchard, or pull everyone back to the square.", m: { safe: -6, pop: -2 }, mt: "No answer came. The line broke where it stood.", o: [
    ["Pull back to the square and cut a break along the cart road, where the ground is already bare. Orchards grow back.", "The orchard burned. The break held, and everyone was behind it.", { safe: 5, food: -2, eco: -1, trust: 9 }, -1],
    ["Hold at the orchard.", "The wind changed while they were still among the trees.", { safe: -4, pop: -3, trust: -9 }, 3],
    ["Everyone scatter and save yourselves.", "It took two days to learn who had made it.", { safe: -3, bond: -3, pop: -1, trust: -6 }, 1] ] },
  { c: 'health', s: 1, x: 'fire', q: "The smoke's thick. The old folk at the east end can't walk far, and the wind's turning toward them.", m: { health: -6, pop: -2 }, mt: "No answer came. The smoke reached the east end first.", o: [
    ["Carts, now, east end first. Wet cloths over faces, and take them to the reservoir bank, not the hall. The hall is downwind.", "They sat out the night by the water, coughing and alive.", { health: 5, bond: 2, trust: 10 }, 0],
    ["Shut them indoors and seal the windows.", "Smoke finds its way into an old house.", { health: -5, pop: -2, trust: -8 }, 2],
    ["Bring them to the hall.", "The hall filled with smoke an hour after they did.", { health: -3, pop: -1, trust: -4 }, 2] ] },
  { c: 'eco', s: 1, x: 'fire', q: "We could backburn the blue grove to starve the fire before it reaches town. It's the last old grove we have.", m: { eco: -5, safe: -4 }, mt: "No answer came. The fire chose its own path.", o: [
    ["Burn the scrub belt south of the grove instead. It's drier and nearer the front. I'll mark the line. The grove is your windbreak.", "The scrub went up, the front starved, and the grove still stands between the town and the wind.", { eco: 3, safe: 3, trust: 9 }, 0],
    ["Burn the grove. Lives come first.", "It worked. The town is safe, and the hill above it is bare.", { eco: -8, safe: 3, trust: -2 }, 2],
    ["No deliberate fires at all.", "The front reached the outer houses with nothing in its way.", { safe: -5, infra: -4, trust: -5 }, -2] ] },
  { c: 'infra', s: 1, x: 'fire', q: "The pump house is in the fire's path, and it's the only thing feeding the hoses.", m: { infra: -6, safe: -4 }, mt: "No answer came. The pump house burned with the tanks half empty.", o: [
    ["Wet it down and clear ten paces round it, then run the pump flat out while you still have it. Fill every tank and trough in town before it goes.", "The pump house survived. Had it not, the tanks were full.", { infra: 3, safe: 3, trust: 8 }, 0],
    ["Abandon it and fall back.", "The hoses went slack in the first hour.", { infra: -6, safe: -4, trust: -5 }, 1],
    ["Send everyone to defend it.", "They saved the pump house. Not everyone who defended it came back.", { infra: 2, safe: -3, pop: -1, trust: -3 }, 2] ] },
];
