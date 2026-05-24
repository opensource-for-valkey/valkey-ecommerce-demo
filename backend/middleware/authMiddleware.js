const valkeyClient = require('../valkeyClient');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const sessionKey = `session:${token}`;
  
  try {
    const userId = await valkeyClient.get(sessionKey);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    }
    
    // Refresh the session TTL to 24 hours (86400 seconds) due to activity
    await valkeyClient.expire(sessionKey, 86400);

    // Attach user id and token to request for downstream use
    req.userId = userId;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { authenticate };
