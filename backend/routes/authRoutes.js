const express = require('express');
const router = express.Router();
const { register, login, logout, me, refresh, valkeyStats } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { checkLoginRateLimit } = require('../middlewares/rateLimiter');

router.post('/register', register);
router.post('/login', checkLoginRateLimit, login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);
router.post('/refresh', requireAuth, refresh);
router.get('/valkey-stats', valkeyStats);

module.exports = router;
