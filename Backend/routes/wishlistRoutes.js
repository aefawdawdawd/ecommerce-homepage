const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authenticate
router.use(authenticate);

// Lấy wishlist của user hiện tại
router.get('/', wishlistController.getWishlist);

// Lấy wishlist theo user ID (có thể dùng để test)
router.get('/:userId', wishlistController.getWishlist);

// Thêm vào wishlist
router.post('/add', wishlistController.addToWishlist);

// Xóa khỏi wishlist
router.delete('/:userId/:productId', wishlistController.removeFromWishlist);

// Kiểm tra sản phẩm có trong wishlist không
router.get('/check/:userId/:productId', wishlistController.checkWishlist);

module.exports = router;