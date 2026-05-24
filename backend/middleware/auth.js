const valkey = require('../lib/valkey');

const SESSION_TTL = 86400;

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '').trim();
  if (!token) {
    return res.status(401).json({ error: 'unauthorized', message: 'No session token provided' });
  }

  const userId = await valkey.get(`session:${token}`);
  if (!userId) {
    return res.status(401).json({ error: 'session_expired', message: 'Session expired or invalid' });
  }

  await valkey.expire(`session:${token}`, SESSION_TTL);

  req.userId = userId;
  req.sessionToken = token;
  next();
}

async function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '').trim();
  if (!token) return next();

  const userId = await valkey.get(`session:${token}`);
  if (userId) {
    await valkey.expire(`session:${token}`, SESSION_TTL);
    req.userId = userId;
    req.sessionToken = token;
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
