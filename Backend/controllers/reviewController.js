const db = require('../config/database');

// Lấy reviews của sản phẩm
const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;

        console.log('🔍 Fetching reviews for product:', productId);

        const [reviews] = await db.query(`
            SELECT r.*, u.username, u.avatar, u.id as user_id
            FROM reviews r 
            LEFT JOIN users u ON r.user_id = u.id 
            WHERE r.product_id = ? 
            ORDER BY r.created_at DESC
        `, [productId]);

        console.log('✅ Found', reviews.length, 'reviews');
        res.json(reviews);
    } catch (error) {
        console.error('🔴 Error in getProductReviews:', error);
        res.status(500).json({ error: error.message });
    }
};

// Thêm review mới - CHỈ CHO PHÉP KHI ĐÃ MUA
const addReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        console.log('➕ Adding review:', { userId, productId, rating, comment });

        // Kiểm tra đã mua sản phẩm chưa (CHỈ delivered mới được review)
        const [orders] = await db.query(`
            SELECT oi.id FROM order_items oi 
            JOIN orders o ON oi.order_id = o.id 
            WHERE oi.product_id = ? AND o.buyer_id = ? AND o.status = 'delivered'
        `, [productId, userId]);

        if (orders.length === 0) {
            return res.status(403).json({ 
                error: 'You can only review products you have purchased and received' 
            });
        }

        // Kiểm tra đã review chưa
        const [existing] = await db.query(
            'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        // Thêm review
        const [result] = await db.query(
            'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, productId, rating, comment]
        );

        // Cập nhật avg_rating và review_count trong bảng products
        await db.query(`
            UPDATE products 
            SET rating = (
                SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = ?
            ), review_count = (
                SELECT COUNT(*) FROM reviews WHERE product_id = ?
            ) WHERE id = ?
        `, [productId, productId, productId]);

        console.log('✅ Review added successfully');

        res.status(201).json({ 
            success: true, 
            message: 'Review added successfully',
            reviewId: result.insertId
        });

    } catch (error) {
        console.error('🔴 Error in addReview:', error);
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật review
const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        // Kiểm tra quyền sở hữu
        const [reviews] = await db.query(
            'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
            [reviewId, userId]
        );

        if (reviews.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const productId = reviews[0].product_id;

        // Cập nhật review
        await db.query(
            'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
            [rating, comment, reviewId]
        );

        // Cập nhật avg_rating trong bảng products
        await db.query(`
            UPDATE products 
            SET rating = (
                SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = ?
            ) WHERE id = ?
        `, [productId, productId]);

        res.json({ success: true, message: 'Review updated successfully' });

    } catch (error) {
        console.error('🔴 Error in updateReview:', error);
        res.status(500).json({ error: error.message });
    }
};

// Xóa review
const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;

        // Kiểm tra quyền sở hữu
        const [reviews] = await db.query(
            'SELECT product_id FROM reviews WHERE id = ? AND user_id = ?',
            [reviewId, userId]
        );

        if (reviews.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const productId = reviews[0].product_id;

        // Xóa review
        await db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);

        // Cập nhật avg_rating trong bảng products
        await db.query(`
            UPDATE products 
            SET rating = (
                SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = ?
            ), review_count = (
                SELECT COUNT(*) FROM reviews WHERE product_id = ?
            ) WHERE id = ?
        `, [productId, productId, productId]);

        res.json({ success: true, message: 'Review deleted successfully' });

    } catch (error) {
        console.error('🔴 Error in deleteReview:', error);
        res.status(500).json({ error: error.message });
    }
};

// Kiểm tra xem user đã mua sản phẩm chưa
const checkCanReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;

        const [orders] = await db.query(`
            SELECT oi.id FROM order_items oi 
            JOIN orders o ON oi.order_id = o.id 
            WHERE oi.product_id = ? AND o.buyer_id = ? AND o.status = 'delivered'
        `, [productId, userId]);

        const [existing] = await db.query(
            'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        res.json({
            canReview: orders.length > 0 && existing.length === 0,
            hasPurchased: orders.length > 0,
            hasReviewed: existing.length > 0
        });

    } catch (error) {
        console.error('🔴 Error in checkCanReview:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProductReviews,
    addReview,
    updateReview,
    deleteReview,
    checkCanReview
};