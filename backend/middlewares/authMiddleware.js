const { client } = require('../config/db');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No session token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const sessionKey = `session:${token}`;
    const userId = await client.get(sessionKey);

    if (!userId) {
      return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' });
    }

    // Retrieve user JSON
    const userJson = await client.json.get(userId);
    if (!userJson) {
      return res.status(401).json({ message: 'User profile not found.' });
    }

    // Parse user profile if returned as a string (Node Redis JSON returns parsed object automatically)
    const user = typeof userJson === 'string' ? JSON.parse(userJson) : userJson;

    // Refresh TTL (24 hours)
    await client.expire(sessionKey, parseInt(process.env.SESSION_TTL || '86400', 10));

    // Attach to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ message: 'Internal server error validating session.' });
  }
};

module.exports = { requireAuth };
