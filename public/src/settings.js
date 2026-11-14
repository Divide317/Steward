// How each player's typed replies are judged, and the dialog for choosing it.
// Saved in the player's own browser. Keys never leave it except with that player's own typed replies.
const KEY = 'steward-judge-v1';

export let server = { sharedGemini: false, geminiModel: '', claudeModels: [] };
export async function loadStatus() {
  try { server = { ...server, ...(await (await fetch('/api/status')).json()) }; } catch {}
}

const CLAUDE_NAMES = { 'claude-opus-5-5': 'Claude Opus 5.5 (most careful)', 'claude-sonnet-5-5': 'Claude Sonnet 5.5', 'claude-haiku-5-5': 'Claude Haiku 5.5 (cheapest)' };

export function get() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch {}
  return { mode: null, geminiKey: '', claudeKey: '', claudeModel: 'claude-opus-5-5', ...(s || {}) };
}
function put(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }

// The mode actually in use: falls back to text matching when the chosen one has no key to work with.
export function mode() {
  const s = get();
  let m = s.mode || (server.sharedGemini ? 'gemini' : 'match');
  if (m === 'gemini' && !s.geminiKey && !server.sharedGemini) m = 'match';
  if (m === 'claude' && !s.claudeKey) m = 'match';
  return m;
}
export const label = (m = mode()) => ({ match: 'text matching (no AI)', gemini: 'free AI (Gemini)', claude: 'your Claude key' })[m];

// What to send to /api/judge, or null to judge in the browser.
export function request() {
  const s = get(), m = mode();
  if (m === 'match') return null;
  return m === 'claude' ? { provider: 'claude', key: s.claudeKey, model: s.claudeModel } : { provider: 'gemini', key: s.geminiKey };
}

let host = null;
export const isOpen = () => !!host && !host.hidden;
export function close() { if (host) host.hidden = true; }

export function open(el, onSaved) {
  host = el;
  const s = get(), m = mode();
  const opt = (v, title, body) => `<label class="jopt"><input type="radio" name="jm" value="${v}" ${m === v ? 'checked' : ''}><div><b>${title}</b>${body}</div></label>`;
  el.innerHTML = `<div class="dialog jdialog">
    <div class="mh"><span class="cat">Settings</span><b>How your typed replies are judged</b></div>
    <p class="ptext">Written replies always work the same way. This only changes what decides the outcome of a reply you type yourself.</p>
    ${opt('match', 'Text matching', '<small>No AI and no key. Your words are matched to the closest written reply. Free, but rough: it cannot tell "use poison" from "don\'t use poison".</small>')}
    ${opt('gemini', 'Free AI (Google Gemini)', `<small>${server.sharedGemini ? 'Uses this game\'s shared free allowance, or your own free key if you add one.' : 'Needs your own free key.'} Get one at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a>. Keep billing switched off on that Google project and it cannot charge you. On Google's free tier, what you send may be used to improve Google's products.</small>
      <input id="jGem" type="password" autocomplete="off" spellcheck="false" placeholder="${server.sharedGemini ? 'Your Gemini key (optional)' : 'Your Gemini key'}">`)}
    ${opt('claude', 'Your own Claude key', `<small>Anthropic's Claude judges most carefully. Each typed reply is one call charged to your Anthropic account, and nobody else's. Get a key at <a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a>.</small>
      <input id="jCla" type="password" autocomplete="off" spellcheck="false" placeholder="Your Claude key (sk-ant-…)">
      <select id="jMod">${(server.claudeModels.length ? server.claudeModels : Object.keys(CLAUDE_NAMES)).map(k => `<option value="${k}"${s.claudeModel === k ? ' selected' : ''}>${CLAUDE_NAMES[k] || k}</option>`).join('')}</select>`)}
    <p class="hintline">Keys stay in this browser. They are sent only with your own typed replies, to this game's server, which passes them straight to Google or Anthropic and does not store them.</p>
    <div class="mf"><span class="err" id="jErr"></span>
      <span class="jbtns"><button class="link" data-forget>Forget my keys</button><button class="ghost" data-cancel>Cancel</button><button class="primary small" data-save>Save</button></span></div></div>`;
  el.querySelector('#jGem').value = s.geminiKey;
  el.querySelector('#jCla').value = s.claudeKey;
  el.hidden = false;

  const err = t => { el.querySelector('#jErr').textContent = t; };
  el.onclick = e => {
    if (e.target === el || e.target.closest('[data-cancel]')) return close();
    if (e.target.closest('[data-forget]')) {
      el.querySelector('#jGem').value = ''; el.querySelector('#jCla').value = '';
      put({ ...get(), geminiKey: '', claudeKey: '' });
      return err('Keys removed from this browser.');
    }
    if (!e.target.closest('[data-save]')) return;
    const pickM = el.querySelector('input[name=jm]:checked').value;
    const gem = el.querySelector('#jGem').value.trim(), cla = el.querySelector('#jCla').value.trim();
    if (pickM === 'gemini' && !gem && !server.sharedGemini) return err('Add your free Gemini key, or pick text matching.');
    if (pickM === 'claude' && !cla) return err('Add your Claude key, or pick another option.');
    if (pickM === 'claude' && !cla.startsWith('sk-ant-')) return err('That does not look like a Claude key. They start with sk-ant-.');
    put({ mode: pickM, geminiKey: gem, claudeKey: cla, claudeModel: el.querySelector('#jMod').value });
    close();
    onSaved && onSaved();
  };
}
