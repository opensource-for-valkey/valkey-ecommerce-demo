const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.get('/', vendorController.getVendors);
router.get('/top', vendorController.getTopVendors);
router.get('/:id', vendorController.getVendor);

module.exports = router;
