const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate); // Tất cả routes đều cần auth

// Buyer routes
router.get('/buyer', orderController.getBuyerOrders);
router.post('/checkout', orderController.createOrder);
router.post('/:id/cancel', orderController.cancelOrder);

// Seller routes
router.get('/seller', orderController.getSellerOrders);
router.put('/item/:itemId/status', orderController.updateOrderStatus);

// Common routes
router.get('/:id', orderController.getOrderById);

module.exports = router;