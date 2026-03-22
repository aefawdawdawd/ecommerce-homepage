const db = require('../config/database');

// Tạo đơn hàng mới (checkout)
const createOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        console.log('🔵 Create order request received');
        console.log('📝 Request body:', req.body);
        console.log('👤 User from token:', req.user);

        const { shippingAddress, paymentMethod, note } = req.body;
        const buyerId = req.user?.id;

        if (!buyerId) {
            throw new Error('User not authenticated');
        }

        if (!shippingAddress) {
            throw new Error('Shipping address is required');
        }

        // Lấy giỏ hàng
        const [cartItems] = await connection.query(`
            SELECT c.*, p.price, p.seller_id, p.name as product_name, p.stock 
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?
        `, [buyerId]);

        if (cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        // Tính tổng tiền
        let totalAmount = 0;
        const orderItems = [];

        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                throw new Error(`Not enough stock for product ${item.product_name}`);
            }

            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                productId: item.product_id,
                productName: item.product_name,
                quantity: item.quantity,
                price: item.price,
                sellerId: item.seller_id
            });
        }

        // Tạo đơn hàng chính - DÙNG ĐÚNG TÊN CỘT
        const [orderResult] = await connection.query(`
            INSERT INTO orders (buyer_id, total_amount, shipping_address, payment_method, note, status) 
            VALUES (?, ?, ?, ?, ?, 'pending')
        `, [buyerId, totalAmount, shippingAddress, paymentMethod, note]);

        const orderId = orderResult.insertId;

        // Tạo các đơn hàng con
        for (const item of orderItems) {
            await connection.query(`
                INSERT INTO order_items (order_id, product_id, product_name, quantity, price, seller_id, status) 
                VALUES (?, ?, ?, ?, ?, ?, 'pending')
            `, [orderId, item.productId, item.productName, item.quantity, item.price, item.sellerId]);
            
            await connection.query(`
                UPDATE products SET stock = stock - ? WHERE id = ?
            `, [item.quantity, item.productId]);
        }

        // Xóa giỏ hàng
        await connection.query(`DELETE FROM cart WHERE user_id = ?`, [buyerId]);

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            orderId
        });

    } catch (error) {
        await connection.rollback();
        console.error('🔴 Error in createOrder:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.sqlMessage || null
        });
    } finally {
        connection.release();
    }
};

// Lấy đơn hàng của người mua
const getBuyerOrders = async (req, res) => {
    try {
        const buyerId = req.user.id;

        console.log('🔍 Getting orders for buyer:', buyerId);

        // Lấy orders - DÙNG ĐÚNG TÊN CỘT
        const [orders] = await db.query(`
            SELECT o.*, 
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
             FROM orders o 
             WHERE o.buyer_id = ? 
             ORDER BY o.created_at DESC
        `, [buyerId]);

        // Lấy items cho từng order
        for (const order of orders) {
            const [items] = await db.query(`
                SELECT oi.*, p.images 
                 FROM order_items oi 
                 LEFT JOIN products p ON oi.product_id = p.id 
                 WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        const [countResult] = await db.query(`
            SELECT COUNT(*) as total FROM orders WHERE buyer_id = ?
        `, [buyerId]);

        res.json({
            orders,
            pagination: {
                page: 1,
                limit: 10,
                total: countResult[0].total,
                pages: Math.ceil(countResult[0].total / 10)
            }
        });

    } catch (error) {
        console.error('🔴 Error in getBuyerOrders:', error);
        res.status(500).json({ error: error.message });
    }
};

// Lấy đơn hàng của người bán
const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const [orders] = await db.query(`
            SELECT oi.*, o.created_at, o.buyer_id, o.shipping_address, o.payment_method, o.status as order_status,
             u.username as buyer_name, u.email as buyer_email
             FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             JOIN users u ON o.buyer_id = u.id
             WHERE oi.seller_id = ?
             ORDER BY o.created_at DESC
        `, [sellerId]);

        res.json(orders);

    } catch (error) {
        console.error('🔴 Error in getSellerOrders:', error);
        res.status(500).json({ error: error.message });
    }
};

// Lấy chi tiết đơn hàng
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;

        const [orders] = await db.query(`
            SELECT o.*, u.username as buyer_name, u.email as buyer_email
             FROM orders o
             JOIN users u ON o.buyer_id = u.id
             WHERE o.id = ?
        `, [orderId]);

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orders[0];

        const [items] = await db.query(`
            SELECT oi.*, p.images 
             FROM order_items oi 
             LEFT JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?
        `, [orderId]);

        order.items = items;
        res.json(order);

    } catch (error) {
        console.error('🔴 Error in getOrderById:', error);
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
    try {
        const orderItemId = req.params.itemId;
        const { status } = req.body;

        await db.query(`
            UPDATE order_items SET status = ? WHERE id = ?
        `, [status, orderItemId]);

        res.json({ success: true, message: 'Order status updated' });

    } catch (error) {
        console.error('🔴 Error in updateOrderStatus:', error);
        res.status(500).json({ error: error.message });
    }
};

// Hủy đơn hàng
const cancelOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const orderId = req.params.id;

        const [orders] = await connection.query(`
            SELECT * FROM orders WHERE id = ? AND status = 'pending'
        `, [orderId]);

        if (orders.length === 0) {
            throw new Error('Order cannot be cancelled');
        }

        const [items] = await connection.query(`
            SELECT product_id, quantity FROM order_items WHERE order_id = ?
        `, [orderId]);

        for (const item of items) {
            await connection.query(`
                UPDATE products SET stock = stock + ? WHERE id = ?
            `, [item.quantity, item.product_id]);
        }

        await connection.query(`
            UPDATE orders SET status = 'cancelled' WHERE id = ?
        `, [orderId]);

        await connection.commit();

        res.json({ success: true, message: 'Order cancelled successfully' });

    } catch (error) {
        await connection.rollback();
        console.error('🔴 Error in cancelOrder:', error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

module.exports = {
    createOrder,
    getBuyerOrders,
    getSellerOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
};