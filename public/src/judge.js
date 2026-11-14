// Offline reading of a typed reply, used when the server has no API key (or the judge can't be reached).
// It is deliberately simple: it finds the written reply your words most resemble and uses that outcome.
// It cannot tell "use poison" from "don't use poison". The real judge can.

const STOP = new Set(('the a an and or but to of in on at for with it is are was be been i you we they them this that so as if then ' +
  'not no do does dont will would can could should have has had me my your our their there here now just all any what how who when ' +
  'from by out up into about than too very more one let lets get got').split(' '));
const stem = w => w.replace(/(ing|ed|es|s|ly)$/, '');
const words = s => [...new Set(s.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP.has(w)).map(stem))];

const VAGUE = { outcome: 'They listened, were not sure what to do with that, and muddled through alone.', fx: { trust: -2 }, like: 0 };

export function localJudge(t, reply) {
  const mine = words(reply);
  if (mine.length < 3) return VAGUE;
  const opts = t.o.map(o => words(o[0]));
  const seenIn = {};
  for (const o of opts) for (const w of o) seenIn[w] = (seenIn[w] || 0) + 1;
  // words that appear in only one written reply say the most about which one you meant
  const scores = opts.map(o => mine.reduce((a, w) => a + (o.includes(w) ? 1 / seenIn[w] : 0), 0) / Math.sqrt(o.length + 3));
  const best = scores.indexOf(Math.max(...scores));
  if (scores[best] < 0.25) return VAGUE;
  return { outcome: t.o[best][1], fx: { ...t.o[best][2] }, like: t.o[best][3] };
}
