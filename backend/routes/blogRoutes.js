const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getPosts);
router.get('/:id', blogController.getPost);

module.exports = router;
