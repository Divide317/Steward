// Local server for Steward: serves the game from public/ and the judge from lib/judge.js.
// `node server.js`, then open http://localhost:5173. On Vercel, api/ does the same job.
const http = require('http');
const fs = require('fs');
const path = require('path');

try { process.loadEnvFile(path.join(__dirname, '.env')); } catch {}   // optional .env with GEMINI_API_KEY
const { handle, sharedGemini, GEMINI_MODEL } = require('./lib/judge');

const root = path.join(__dirname, 'public');
const port = process.env.PORT || 5173;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.txt': 'text/plain' };

function readJson(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 20000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(null); } });
    req.on('error', () => resolve(null));
  });
}

http.createServer(async (req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url.startsWith('/api/')) {
    const body = req.method === 'POST' ? await readJson(req) : null;
    const out = await handle(url, req.method, body, req.socket.remoteAddress);
    res.writeHead(out.status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify(out.body));
  }
  if (url === '/') url = '/index.html';
  const file = path.join(root, url);
  if (!file.startsWith(root + path.sep) || !types[path.extname(file)]) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(port, () => {
  console.log(`Steward running at http://localhost:${port}`);
  console.log(sharedGemini() ? `Shared free judge: ${GEMINI_MODEL}.` : 'No shared GEMINI_API_KEY: players choose text matching or add their own key.');
});
