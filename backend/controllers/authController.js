const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { client } = require('../config/db');

// Live Command Logging Queue for Hackathon Tech Console
const commandLogs = [];

const logCommand = (cmd) => {
  commandLogs.unshift({
    timestamp: new Date().toLocaleTimeString(),
    command: cmd
  });
  if (commandLogs.length > 20) {
    commandLogs.pop();
  }
};

// Custom pure-JS UUIDv7 generator to avoid package version discrepancies
function generateUuidV7() {
  const timestamp = Date.now();
  const hexTimestamp = timestamp.toString(16).padStart(12, '0');
  
  const randomBytes = Array.from({ length: 10 }, () => Math.floor(Math.random() * 256));
  
  const randAVal = 0x7000 | ((randomBytes[0] & 0x0f) << 8) | randomBytes[1];
  const randAHex = randAVal.toString(16).padStart(4, '0');
  
  const randBVal = 0x8000 | ((randomBytes[2] & 0x3f) << 8) | randomBytes[3];
  const randBHex = randBVal.toString(16).padStart(4, '0');
  
  const restHex = randomBytes.slice(4).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${hexTimestamp.slice(0, 8)}-${hexTimestamp.slice(8, 12)}-${randAHex}-${randBHex}-${restHex.slice(0, 12)}`;
}

// Helper to remove password hash from user object
const sanitizeUser = (user) => {
  const sanitized = { ...user };
  delete sanitized.passwordHash;
  return sanitized;
};

// 1. User Registration
const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    const formattedEmail = email.trim().toLowerCase();
    
    // Check if email already registered in our Valkey email index
    logCommand(`HEXISTS user_emails "${formattedEmail}"`);
    const existingUserKey = await client.hGet('user_emails', formattedEmail);
    if (existingUserKey) {
      return res.status(400).json({ message: 'Email address is already in use.' });
    }

    // Generate unique ID in UUIDv7 format with 'user' prefix as per ID strategy
    const userId = `user:${generateUuidV7()}`;

    // Hash password with bcrypt cost factor of 12+
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user profile matching the data contract
    const userProfile = {
      id: userId,
      email: formattedEmail,
      username: username.trim(),
      passwordHash,
      firstName: username.trim().split(' ')[0] || username.trim(),
      lastName: username.trim().split(' ').slice(1).join(' ') || '',
      phone: '',
      avatar: '/assets/avatars/default.jpg',
      role: 'customer',
      addresses: [],
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: true
      },
      createdAt: new Date().toISOString(),
      lastLoginAt: null
    };

    // Store profile in Valkey using JSON module
    logCommand(`JSON.SET "${userId}" $ '${JSON.stringify(sanitizeUser(userProfile))}'`);
    await client.json.set(userId, '$', userProfile);

    // Index the email mapping for fast O(1) logins
    logCommand(`HSET user_emails "${formattedEmail}" "${userId}"`);
    await client.hSet('user_emails', formattedEmail, userId);

    return res.status(201).json({
      message: 'Registration successful!',
      user: sanitizeUser(userProfile)
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Error creating user account. Please try again.' });
  }
};

// 2. User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const formattedEmail = email.trim().toLowerCase();
  const loginAttemptsKey = `login_attempts:${formattedEmail}`;

  try {
    // 1. Fetch userId from email index
    logCommand(`HGET user_emails "${formattedEmail}"`);
    const userId = await client.hGet('user_emails', formattedEmail);
    
    // Helper function to handle failed attempt counters
    const registerFailedAttempt = async () => {
      logCommand(`INCR "${loginAttemptsKey}"`);
      const currentAttempts = await client.incr(loginAttemptsKey);
      if (currentAttempts === 1) {
        logCommand(`EXPIRE "${loginAttemptsKey}" 900`);
        await client.expire(loginAttemptsKey, 900); // 15 mins block timer start
      }
      return currentAttempts;
    };

    if (!userId) {
      await registerFailedAttempt();
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 2. Fetch full user profile
    logCommand(`JSON.GET "${userId}"`);
    const userJson = await client.json.get(userId);
    if (!userJson) {
      await registerFailedAttempt();
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = typeof userJson === 'string' ? JSON.parse(userJson) : userJson;

    // 3. Match passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await registerFailedAttempt();
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 4. Success - Clear rate limit attempts
    logCommand(`DEL "${loginAttemptsKey}"`);
    await client.del(loginAttemptsKey);

    // 5. Generate secure session token
    const token = uuidv4();
    const sessionKey = `session:${token}`;
    const sessionTtl = parseInt(process.env.SESSION_TTL || '86400', 10); // Default 24 hours

    // 6. Save active session in Valkey with TTL
    logCommand(`SET "${sessionKey}" "${userId}" EX ${sessionTtl}`);
    await client.set(sessionKey, userId, { EX: sessionTtl });

    // 7. Track concurrent sessions per user (using a Sorted Set or Set)
    const userSessionsKey = `user_sessions:${userId}`;
    logCommand(`SADD "${userSessionsKey}" "${token}"`);
    await client.sAdd(userSessionsKey, token);

    // 8. Update lastLoginAt in Valkey JSON profile
    user.lastLoginAt = new Date().toISOString();
    logCommand(`JSON.SET "${userId}" $.lastLoginAt "${user.lastLoginAt}"`);
    await client.json.set(userId, '$.lastLoginAt', user.lastLoginAt);

    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
};

// 3. User Logout
const logout = async (req, res) => {
  const token = req.token;
  const userId = req.user.id;

  try {
    const sessionKey = `session:${token}`;
    const userSessionsKey = `user_sessions:${userId}`;

    // Remove from active session and user's session list
    logCommand(`DEL "${sessionKey}"`);
    logCommand(`SREM "${userSessionsKey}" "${token}"`);
    await Promise.all([
      client.del(sessionKey),
      client.sRem(userSessionsKey, token)
    ]);

    return res.status(200).json({ message: 'Successfully logged out.' });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({ message: 'Error logging out from server.' });
  }
};

// 4. Get Current User Profile (Me)
const me = async (req, res) => {
  // authMiddleware automatically attaches sanitized user profile
  logCommand(`GET "session:${req.token}"`);
  logCommand(`JSON.GET "${req.user.id}"`);
  logCommand(`EXPIRE "session:${req.token}" 86400`);
  return res.status(200).json({ user: sanitizeUser(req.user) });
};

// 5. Refresh Session Expiry
const refresh = async (req, res) => {
  const token = req.token;
  try {
    const sessionKey = `session:${token}`;
    const sessionTtl = parseInt(process.env.SESSION_TTL || '86400', 10);

    logCommand(`EXPIRE "${sessionKey}" ${sessionTtl}`);
    await client.expire(sessionKey, sessionTtl);
    return res.status(200).json({ message: 'Session refreshed successfully.' });
  } catch (error) {
    console.error('Session Refresh Error:', error);
    return res.status(500).json({ message: 'Error refreshing session TTL.' });
  }
};

// 6. Get Valkey Statistics & Live Logs (Hackathon HUD Telemetry)
const valkeyStats = async (req, res) => {
  try {
    // 1. Get database size (O(1) total key count)
    const dbSize = await client.dbSize();
    
    // 2. Fetch runtime stats
    const memoryInfo = await client.info('memory');
    const clientsInfo = await client.info('clients');

    // Parse memory usage (e.g. used_memory_human)
    const usedMemoryMatch = memoryInfo.match(/used_memory_human:([^\r\n]+)/);
    const usedMemory = usedMemoryMatch ? usedMemoryMatch[1].trim() : 'unknown';

    // Parse connected clients
    const connectedClientsMatch = clientsInfo.match(/connected_clients:([^\r\n]+)/);
    const connectedClients = connectedClientsMatch ? parseInt(connectedClientsMatch[1].trim(), 10) : 1;

    return res.status(200).json({
      dbSize,
      usedMemory,
      connectedClients,
      liveLogs: commandLogs
    });
  } catch (error) {
    console.error('Valkey Stats Telemetry Error:', error);
    return res.status(200).json({
      dbSize: 0,
      usedMemory: '0B',
      connectedClients: 0,
      liveLogs: [
        { timestamp: new Date().toLocaleTimeString(), command: 'ERROR: Database Connection Unreachable' }
      ]
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  refresh,
  valkeyStats,
  logCommand
};
