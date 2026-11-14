// Vercel function: GET /api/status. Tells the game whether typed replies can be judged by Claude.
const { handle } = require('../lib/judge');

module.exports = async (req, res) => {
  const out = await handle('/api/status', req.method, null, null);
  res.setHeader('Cache-Control', 'no-store');
  res.status(out.status).json(out.body);
};
