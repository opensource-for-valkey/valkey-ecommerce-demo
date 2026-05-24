const { client } = require('../config/db');

const checkLoginRateLimit = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const key = `login_attempts:${email.toLowerCase()}`;
    const attempts = await client.get(key);

    if (attempts && parseInt(attempts, 10) >= 5) {
      const ttl = await client.ttl(key);
      return res.status(429).json({
        message: `Too many failed login attempts. Please try again after ${Math.ceil(ttl / 60)} minutes.`
      });
    }
    next();
  } catch (error) {
    console.error('Rate Limiter Error:', error);
    next(); // Fallback: proceed if Valkey fails
  }
};

module.exports = { checkLoginRateLimit };
