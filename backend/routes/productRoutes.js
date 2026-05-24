const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/trending', productController.getTrending);
router.get('/deals', productController.getDeals);
router.get('/best-sellers', productController.getBestSellers);
router.get('/:id', productController.getProduct);
router.get('/:id/reviews', productController.getProductReviews);

module.exports = router;
