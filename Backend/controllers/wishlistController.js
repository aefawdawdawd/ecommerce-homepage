const db = require('../config/database');


// Lấy wishlist của user
const getWishlist = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;

        console.log('🔍 Getting wishlist for user:', userId);

        const [wishlist] = await db.query(`
            SELECT w.*, p.name, p.price, p.images, p.stock, p.status 
            FROM wishlist w 
            JOIN products p ON w.product_id = p.id 
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
        `, [userId]);

        console.log('✅ Found', wishlist.length, 'items');
        res.json(wishlist);
    } catch (error) {
        console.error('🔴 Error in getWishlist:', error);
        res.status(500).json({ error: error.message });
    }
};

// Thêm vào wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        console.log('➕ Adding to wishlist:', { userId, productId });

        // Kiểm tra sản phẩm tồn tại
        const [products] = await db.query(
            'SELECT id FROM products WHERE id = ?',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Kiểm tra đã có trong wishlist chưa
        const [existing] = await db.query(
            'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        // Thêm vào wishlist
        await db.query(
            'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );

        console.log('✅ Added to wishlist successfully');
        res.status(201).json({ 
            success: true, 
            message: 'Added to wishlist successfully' 
        });

    } catch (error) {
        console.error('🔴 Error in addToWishlist:', error);
        res.status(500).json({ error: error.message });
    }
};

// Xóa khỏi wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        console.log('➖ Removing from wishlist:', { userId, productId });

        await db.query(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        console.log('✅ Removed from wishlist successfully');
        res.json({ 
            success: true, 
            message: 'Removed from wishlist successfully' 
        });

    } catch (error) {
        console.error('🔴 Error in removeFromWishlist:', error);
        res.status(500).json({ error: error.message });
    }
};

// Kiểm tra sản phẩm có trong wishlist không
const checkWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        console.log('🔍 Checking wishlist:', { userId, productId });

        const [result] = await db.query(
            'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        res.json({ inWishlist: result.length > 0 });

    } catch (error) {
        console.error('🔴 Error in checkWishlist:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlist
};