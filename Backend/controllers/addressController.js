const db = require('../config/database');

// Lấy danh sách địa chỉ của user
const getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;

        // VULNERABILITY: SQL Injection
        const [addresses] = await db.query(`
            SELECT * FROM addresses 
             WHERE user_id = ${userId} 
             ORDER BY is_default DESC, created_at DESC
        `);

        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Thêm địa chỉ mới
const addAddress = async (req, res) => {
    try {
        const { recipient_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default } = req.body;
        const userId = req.user.id;

        // VULNERABILITY: SQL Injection
        const query = `
            INSERT INTO addresses (user_id, recipient_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default)
            VALUES (${userId}, '${recipient_name}', '${phone}', '${address_line1}', '${address_line2 || ''}', '${city}', '${state}', '${postal_code}', '${country || 'Vietnam'}', ${is_default ? 1 : 0})
        `;

        const [result] = await db.query(query);

        // Nếu là địa chỉ mặc định, bỏ mặc định của các địa chỉ khác
        if (is_default) {
            await db.query(`
                UPDATE addresses SET is_default = FALSE 
                 WHERE user_id = ${userId} AND id != ${result.insertId}
            `);
        }

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            addressId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// VULNERABILITY: IDOR - Cập nhật địa chỉ (có thể sửa của người khác)
const updateAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const updates = req.body;
        const userId = req.user.id;

        // VULNERABILITY: SQL Injection
        let setClause = [];
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                setClause.push(`${key} = '${value}'`);
            }
        }

        if (setClause.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        await db.query(`
            UPDATE addresses SET ${setClause.join(', ')} WHERE id = ${addressId}
        `);

        if (updates.is_default) {
            await db.query(`
                UPDATE addresses SET is_default = FALSE 
                 WHERE user_id = ${userId} AND id != ${addressId}
            `);
        }

        res.json({ success: true, message: 'Address updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// VULNERABILITY: IDOR - Xóa địa chỉ (có thể xóa của người khác)
const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;

        await db.query(`DELETE FROM addresses WHERE id = ${addressId}`);

        res.json({ success: true, message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Đặt làm mặc định
const setDefaultAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const userId = req.user.id;

        // VULNERABILITY: SQL Injection
        await db.query(`
            UPDATE addresses SET is_default = FALSE WHERE user_id = ${userId}
        `);

        await db.query(`
            UPDATE addresses SET is_default = TRUE WHERE id = ${addressId}
        `);

        res.json({ success: true, message: 'Default address set successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};