const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.post('/view', analyticsController.trackView);
router.post('/cart-add', analyticsController.trackCartAdd);
router.get('/dashboard', analyticsController.getDashboard);

module.exports = router;
