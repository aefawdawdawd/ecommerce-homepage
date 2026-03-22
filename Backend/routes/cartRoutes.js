const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate); // Tất cả routes đều cần auth

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/item/:id', cartController.updateCartItem);
router.delete('/item/:id', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;