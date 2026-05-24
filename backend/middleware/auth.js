const { getClient } = require('../config/valkey');

/**
 * Authentication middleware
 * Validates the session token from the Authorization header
 * and attaches user data to req.user
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const valkey = getClient();

  try {
    const sessionData = await valkey.get(`session:${token}`);

    if (!sessionData) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.user = JSON.parse(sessionData);
    req.token = token;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

module.exports = { authenticate };
