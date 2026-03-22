const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes
router.get('/product/:id', reviewController.getProductReviews);

// Protected routes (cần đăng nhập)
router.post('/product/:id', authenticate, reviewController.addReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;