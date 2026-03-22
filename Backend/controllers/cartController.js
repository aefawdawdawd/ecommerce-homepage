const db = require('../config/database');

// Lấy giỏ hàng của user
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // VULNERABILITY: SQL Injection
        const [cartItems] = await db.query(`
            SELECT c.*, p.name, p.price, p.images, p.stock, u.username as seller_name
             FROM cart c 
             JOIN products p ON c.product_id = p.id
             JOIN users u ON p.seller_id = u.id
             WHERE c.user_id = ${userId}
        `);

        // Tính tổng tiền
        let total = 0;
        for (const item of cartItems) {
            item.total = item.price * item.quantity;
            total += item.total;
        }

        res.json({
            items: cartItems,
            total,
            itemCount: cartItems.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Thêm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        console.log('🔵 addToCart called');
        console.log('📝 Request body:', req.body);
        console.log('👤 User:', req.user);

        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Validate
        if (!productId) {
            console.log('❌ Missing productId');
            return res.status(400).json({ error: 'Product ID is required' });
        }

        console.log('🔍 Checking product:', productId);

        // Kiểm tra sản phẩm tồn tại
        const [products] = await db.query(
            'SELECT id, stock, seller_id FROM products WHERE id = ?',
            [productId]
        );

        if (products.length === 0) {
            console.log('❌ Product not found:', productId);
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log('✅ Product found:', products[0]);

        // Kiểm tra không mua sản phẩm của chính mình
        if (products[0].seller_id === userId) {
            console.log('❌ Cannot buy own product');
            return res.status(400).json({ error: 'You cannot buy your own product' });
        }

        // Kiểm tra stock
        if (products[0].stock < (quantity || 1)) {
            console.log('❌ Not enough stock');
            return res.status(400).json({ error: 'Not enough stock' });
        }

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        const [existing] = await db.query(
            'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existing.length > 0) {
            // Cập nhật số lượng
            const newQuantity = existing[0].quantity + (quantity || 1);
            
            await db.query(
                'UPDATE cart SET quantity = ? WHERE id = ?',
                [newQuantity, existing[0].id]
            );
            
            console.log('✅ Updated cart item quantity:', newQuantity);
        } else {
            // Thêm mới
            await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, quantity || 1]
            );
            
            console.log('✅ Added new item to cart');
        }

        res.json({ success: true, message: 'Product added to cart' });
        
    } catch (error) {
        console.error('🔴 Error in addToCart:', error);
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật số lượng trong giỏ
const updateCartItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const { quantity } = req.body;
        const userId = req.user.id;

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        // VULNERABILITY: No ownership check
        // VULNERABILITY: SQL Injection
        await db.query(`
            UPDATE cart SET quantity = ${quantity} WHERE id = ${itemId}
        `);

        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa khỏi giỏ hàng
const removeFromCart = async (req, res) => {
    try {
        const itemId = req.params.id;

        // VULNERABILITY: No ownership check
        // VULNERABILITY: SQL Injection
        await db.query(`DELETE FROM cart WHERE id = ${itemId}`);

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa toàn bộ giỏ hàng
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // VULNERABILITY: SQL Injection
        await db.query(`DELETE FROM cart WHERE user_id = ${userId}`);

        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};