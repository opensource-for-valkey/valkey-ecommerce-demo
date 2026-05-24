const express = require('express');
const bcrypt = require('bcrypt');
const { v7: uuidv7, v4: uuidv4 } = require('uuid');
const valkeyClient = require('../valkeyClient');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

const SALT_ROUNDS = 12;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if email already exists
    const emailIndexKey = `email_index:${email}`;
    const existingUserId = await valkeyClient.get(emailIndexKey);
    if (existingUserId) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // Generate user ID using uuidv7
    const userId = `user:${uuidv7()}`;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const userObj = {
      id: userId,
      email,
      passwordHash,
      firstName: firstName || null,
      lastName: lastName || null,
      phone: phone || null,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    
    // Store user JSON in Valkey
    await valkeyClient.json.set(userId, '$', userObj);
    // Create an email index for fast lookup during login
    await valkeyClient.set(emailIndexKey, userId);

    // Return the user without the password hash
    const { passwordHash: _hash, ...userResponse } = userObj;
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Rate limiting: check failed attempts
    const attemptsKey = `login_attempts:${email}`;
    const attempts = await valkeyClient.get(attemptsKey);
    
    if (attempts && parseInt(attempts) >= 5) {
      return res.status(429).json({ error: 'Too many failed login attempts. Please try again in 15 minutes.' });
    }

    // Lookup user by email index
    const emailIndexKey = `email_index:${email}`;
    const foundUserId = await valkeyClient.get(emailIndexKey);
    
    let foundUser = null;
    if (foundUserId) {
      foundUser = await valkeyClient.json.get(foundUserId);
    }

    if (!foundUser) {
      await valkeyClient.incr(attemptsKey);
      await valkeyClient.expire(attemptsKey, 900); // 15 mins
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, foundUser.passwordHash);
    
    if (!match) {
      await valkeyClient.incr(attemptsKey);
      await valkeyClient.expire(attemptsKey, 900); // 15 mins
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login, clear attempts
    await valkeyClient.del(attemptsKey);

    // Generate session token
    const token = uuidv4();
    const sessionKey = `session:${token}`;

    // Store session with 24h TTL (86400 seconds)
    await valkeyClient.set(sessionKey, foundUserId, { EX: 86400 });

    // Track concurrent session
    await valkeyClient.sAdd(`user_sessions:${foundUserId}`, token);

    // Update lastLoginAt
    foundUser.lastLoginAt = new Date().toISOString();
    await valkeyClient.json.set(foundUserId, '$', foundUser);

    res.json({ token, user: { id: foundUser.id, email: foundUser.email, firstName: foundUser.firstName, lastName: foundUser.lastName } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const userObj = await valkeyClient.json.get(req.userId);
    
    if (!userObj) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash, ...userResponse } = userObj;
    res.json(userResponse);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', authenticate, async (req, res) => {
  try {
    const sessionKey = `session:${req.token}`;
    
    // Refresh TTL to 24h
    const success = await valkeyClient.expire(sessionKey, 86400);
    
    if (!success) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }

    res.json({ message: 'Session refreshed successfully' });
  } catch (error) {
    console.error('Refresh session error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    const sessionKey = `session:${req.token}`;
    
    // Delete session from Valkey
    await valkeyClient.del(sessionKey);

    // Remove from concurrent sessions tracking
    await valkeyClient.sRem(`user_sessions:${req.userId}`, req.token);
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/auth/debug
// Note: This is a temporary endpoint just to visualize storage requirements for the Hackathon.
router.get('/debug', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    const emailIndexKey = `email_index:${email}`;
    const userId = await valkeyClient.get(emailIndexKey);
    
    // Fetch failed login attempts
    const attemptsKey = `login_attempts:${email}`;
    const failedAttempts = await valkeyClient.get(attemptsKey) || 0;

    let activeSessions = [];
    if (userId) {
       // Fetch concurrent sessions
       activeSessions = await valkeyClient.sMembers(`user_sessions:${userId}`);
    }

    res.json({
      user: email,
      userId: userId || 'Not Found',
      failedLoginAttempts: parseInt(failedAttempts),
      activeConcurrentSessions: activeSessions.length,
      sessionTokens: activeSessions
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
