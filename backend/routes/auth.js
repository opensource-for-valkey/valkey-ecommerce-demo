const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { getClient } = require('../config/valkey');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days in seconds
const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const valkey = getClient();

  try {
    // Check if username already exists
    const existingUser = await valkey.hgetall(`user:${username.toLowerCase()}`);
    if (existingUser && existingUser.username) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Check if email already exists
    const existingEmail = await valkey.get(`email:${email.toLowerCase()}`);
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Store user data in a Valkey hash
    const userId = uuidv4();
    const userData = {
      id: userId,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: '',
      lastName: '',
      phone: '',
      billingAddress: JSON.stringify({ street: '', city: '', state: '', zip: '', country: '' }),
      shippingAddress: JSON.stringify({ street: '', city: '', state: '', zip: '', country: '' }),
      createdAt: new Date().toISOString()
    };

    await valkey.hset(`user:${username.toLowerCase()}`, userData);

    // Create email -> username mapping for login by email
    await valkey.set(`email:${email.toLowerCase()}`, username.toLowerCase());

    // Create session
    const token = uuidv4();
    const sessionData = {
      userId,
      username: username.toLowerCase(),
      email: email.toLowerCase()
    };

    await valkey.set(`session:${token}`, JSON.stringify(sessionData), 'EX', SESSION_TTL);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: buildUserResponse(userData)
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login with username/email and password
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username/email and password are required' });
  }

  const valkey = getClient();

  try {
    let lookupUsername = username.toLowerCase();

    // If input looks like an email, resolve to username
    if (username.includes('@')) {
      const mappedUsername = await valkey.get(`email:${lookupUsername}`);
      if (!mappedUsername) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      lookupUsername = mappedUsername;
    }

    // Get user data
    const userData = await valkey.hgetall(`user:${lookupUsername}`);
    if (!userData || !userData.username) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const token = uuidv4();
    const sessionData = {
      userId: userData.id,
      username: userData.username,
      email: userData.email
    };

    await valkey.set(`session:${token}`, JSON.stringify(sessionData), 'EX', SESSION_TTL);

    res.json({
      message: 'Login successful',
      token,
      user: buildUserResponse(userData)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/logout
 * Invalidate the current session
 */
router.post('/logout', authenticate, async (req, res) => {
  const valkey = getClient();

  try {
    await valkey.del(`session:${req.token}`);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (protected)
 */
router.get('/me', authenticate, async (req, res) => {
  const valkey = getClient();

  try {
    const userData = await valkey.hgetall(`user:${req.user.username}`);
    if (!userData || !userData.username) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: buildUserResponse(userData) });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile (protected)
 */
router.put('/profile', authenticate, async (req, res) => {
  const { firstName, lastName, displayName, phone, billingAddress, shippingAddress } = req.body;
  const valkey = getClient();

  try {
    const userData = await valkey.hgetall(`user:${req.user.username}`);
    if (!userData || !userData.username) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (displayName !== undefined) updates.displayName = displayName;
    if (phone !== undefined) updates.phone = phone;
    if (billingAddress !== undefined) updates.billingAddress = JSON.stringify(billingAddress);
    if (shippingAddress !== undefined) updates.shippingAddress = JSON.stringify(shippingAddress);

    if (Object.keys(updates).length > 0) {
      await valkey.hset(`user:${req.user.username}`, updates);
    }

    // Fetch updated user
    const updatedUser = await valkey.hgetall(`user:${req.user.username}`);
    res.json({ message: 'Profile updated', user: buildUserResponse(updatedUser) });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * PUT /api/auth/change-password
 * Change password (protected)
 */
router.put('/change-password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const valkey = getClient();

  try {
    const userData = await valkey.hgetall(`user:${req.user.username}`);
    if (!userData || !userData.username) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, userData.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await valkey.hset(`user:${req.user.username}`, 'password', hashedPassword);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

/**
 * Helper: Build a safe user response (no password)
 */
function buildUserResponse(userData) {
  let billingAddress = { street: '', city: '', state: '', zip: '', country: '' };
  let shippingAddress = { street: '', city: '', state: '', zip: '', country: '' };

  try {
    if (userData.billingAddress) billingAddress = JSON.parse(userData.billingAddress);
  } catch (e) {}
  try {
    if (userData.shippingAddress) shippingAddress = JSON.parse(userData.shippingAddress);
  } catch (e) {}

  return {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    displayName: userData.displayName || userData.username,
    phone: userData.phone || '',
    billingAddress,
    shippingAddress,
    createdAt: userData.createdAt
  };
}

module.exports = router;
