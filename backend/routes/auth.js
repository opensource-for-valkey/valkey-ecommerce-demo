const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4, v7: uuidv7 } = require('uuid');
const valkey = require('../lib/valkey');

const SESSION_TTL = 86400;      // 24 hours
const RATE_LIMIT_MAX = 5;       // max failed attempts before lockout
const RATE_LIMIT_WINDOW = 900;  // 15-minute window

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Create a new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: secret123
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "+91 9876543210"
 *     responses:
 *       201:
 *         description: Account created; session token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Email, password, first name, and last name are required',
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Password must be at least 6 characters',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingId = await valkey.get(`email_index:${normalizedEmail}`);
    if (existingId) {
      return res.status(409).json({
        error: 'email_taken',
        message: 'An account with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = `user:${uuidv7()}`;
    const now = new Date().toISOString();

    const user = {
      id: userId,
      email: normalizedEmail,
      passwordHash,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone ? phone.trim() : null,
      avatar: null,
      role: 'customer',
      addresses: [],
      preferences: { currency: 'INR', language: 'en', notifications: true },
      createdAt: now,
      lastLoginAt: now,
    };

    await valkey.call('JSON.SET', userId, '$', JSON.stringify(user));
    await valkey.set(`email_index:${normalizedEmail}`, userId);

    const sessionToken = uuidv4();
    await valkey.set(`session:${sessionToken}`, userId, 'EX', SESSION_TTL);
    await valkey.sadd(`user_sessions:${userId}`, `session:${sessionToken}`);

    const { passwordHash: _pw, ...userResponse } = user;
    return res.status(201).json({ user: userResponse, token: sessionToken });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful; session token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *       400:
 *         description: Missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Too many failed attempts — account temporarily locked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: rate_limit_exceeded
 *                 message:
 *                   type: string
 *                   example: Too many failed login attempts. Try again in 14 minutes.
 *                 retryAfter:
 *                   type: integer
 *                   description: Seconds until the lockout lifts
 *                   example: 840
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const rateLimitKey = `login_attempts:${normalizedEmail}`;

    const currentAttempts = parseInt(await valkey.get(rateLimitKey) || '0', 10);
    if (currentAttempts >= RATE_LIMIT_MAX) {
      const ttl = await valkey.ttl(rateLimitKey);
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: `Too many failed login attempts. Try again in ${Math.ceil(ttl / 60)} minutes.`,
        retryAfter: ttl,
      });
    }

    const userId = await valkey.get(`email_index:${normalizedEmail}`);
    if (!userId) {
      const attempts = await valkey.incr(rateLimitKey);
      if (attempts === 1) await valkey.expire(rateLimitKey, RATE_LIMIT_WINDOW);
      return res.status(401).json({ error: 'invalid_credentials', message: 'Invalid email or password' });
    }

    const userRaw = await valkey.call('JSON.GET', userId);
    if (!userRaw) {
      return res.status(401).json({ error: 'invalid_credentials', message: 'Invalid email or password' });
    }

    const user = JSON.parse(userRaw);
    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      const attempts = await valkey.incr(rateLimitKey);
      if (attempts === 1) await valkey.expire(rateLimitKey, RATE_LIMIT_WINDOW);
      const remaining = RATE_LIMIT_MAX - attempts;
      return res.status(401).json({
        error: 'invalid_credentials',
        message: remaining > 0
          ? `Invalid email or password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          : 'Invalid email or password. Account temporarily locked.',
      });
    }

    await valkey.del(rateLimitKey);

    const sessionToken = uuidv4();
    const now = new Date().toISOString();
    await valkey.set(`session:${sessionToken}`, userId, 'EX', SESSION_TTL);
    await valkey.sadd(`user_sessions:${userId}`, `session:${sessionToken}`);
    await valkey.call('JSON.SET', userId, '$.lastLoginAt', JSON.stringify(now));

    const { passwordHash: _pw, ...userResponse } = user;
    userResponse.lastLoginAt = now;

    return res.json({ user: userResponse, token: sessionToken });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Invalidate the current session
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: No session token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ error: 'unauthorized', message: 'No session token provided' });
    }

    const userId = await valkey.get(`session:${token}`);
    if (userId) {
      await valkey.del(`session:${token}`);
      await valkey.srem(`user_sessions:${userId}`, `session:${token}`);
    }

    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('[Auth] Logout error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile (passwordHash excluded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or expired session token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User record not found in Valkey
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ error: 'unauthorized', message: 'No session token provided' });
    }

    const userId = await valkey.get(`session:${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'session_expired', message: 'Session expired or invalid' });
    }

    await valkey.expire(`session:${token}`, SESSION_TTL);

    const userRaw = await valkey.call('JSON.GET', userId);
    if (!userRaw) {
      return res.status(404).json({ error: 'user_not_found', message: 'User not found' });
    }

    const user = JSON.parse(userRaw);
    const { passwordHash: _pw, ...userResponse } = user;

    return res.json({ user: userResponse });
  } catch (err) {
    console.error('[Auth] Me error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Slide the session TTL (keep-alive)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Session TTL reset to 24 hours
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session refreshed
 *                 expiresIn:
 *                   type: integer
 *                   description: Seconds until the session expires
 *                   example: 86400
 *       401:
 *         description: Missing or expired session token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ error: 'unauthorized', message: 'No session token provided' });
    }

    const userId = await valkey.get(`session:${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'session_expired', message: 'Session expired or invalid' });
    }

    await valkey.expire(`session:${token}`, SESSION_TTL);

    return res.json({ message: 'Session refreshed', expiresIn: SESSION_TTL });
  } catch (err) {
    console.error('[Auth] Refresh error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Internal server error' });
  }
});

module.exports = router;
