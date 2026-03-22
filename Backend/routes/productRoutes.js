const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', productController.getProducts);
router.get('/seller/:sellerId', productController.getSellerProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticate, upload.array('images', 5), productController.createProduct);
router.put('/:id', authenticate, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);
router.post('/:id/reviews', authenticate, productController.addReview);

module.exports = router; // <-- QUAN TRỌNG