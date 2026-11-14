// Vercel function: POST /api/judge. The logic lives in lib/judge.js.
const { handle } = require('../lib/judge');

module.exports = async (req, res) => {
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress;
  const out = await handle('/api/judge', req.method, body, ip);
  res.setHeader('Cache-Control', 'no-store');
  res.status(out.status).json(out.body);
};
