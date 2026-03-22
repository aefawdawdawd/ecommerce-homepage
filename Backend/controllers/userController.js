const db = require('../config/database');

// ✅ PATCHED: getCurrentUser
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const [users] = await db.query(
            'SELECT id, username, email, full_name, phone, address, bio, birth_date, gender, avatar, cover_image, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ✅ PATCHED: getUserById – chỉ xem được chính mình hoặc admin
const getUserById = async (req, res) => {
    try {
        const targetId = parseInt(req.params.id);
        const requesterId = req.user.id;
        const requesterRole = req.user.role;

        // Chỉ admin hoặc chính user đó mới xem được
        if (targetId !== requesterId && requesterRole !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: cannot view other users' });
        }

        const [users] = await db.query(
            'SELECT id, username, email, full_name, phone, address, bio, birth_date, gender, avatar, cover_image, role, created_at FROM users WHERE id = ?',
            [targetId]
        );
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ✅ PATCHED: updateUser – chỉ sửa được chính mình hoặc admin
const updateUser = async (req, res) => {
    try {
        const targetId = parseInt(req.params.id);
        const requesterId = req.user.id;
        const requesterRole = req.user.role;

        if (targetId !== requesterId && requesterRole !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: cannot modify other users' });
        }

        const { full_name, phone, address, bio, birth_date, gender } = req.body;

        await db.query(
            `UPDATE users SET full_name = ?, phone = ?, address = ?, bio = ?, birth_date = ?, gender = ? WHERE id = ?`,
            [full_name, phone, address, bio, birth_date, gender, targetId]
        );

        const [updated] = await db.query(
            'SELECT id, username, email, full_name, phone, address, bio, birth_date, gender, avatar, role FROM users WHERE id = ?',
            [targetId]
        );
        res.json({ success: true, user: updated[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ✅ PATCHED: changePassword – dùng bcrypt
const changePassword = async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });

        const isValid = await bcrypt.compare(currentPassword, users[0].password);
        if (!isValid) return res.status(401).json({ error: 'Current password is incorrect' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        const userId = req.params.id;
        const avatarUrl = `/uploads/avatars/${req.file?.filename || 'default.jpg'}`;
        await db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, userId]);
        res.json({ success: true, avatarUrl });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const uploadCover = async (req, res) => {
    try {
        const userId = req.params.id;
        const coverUrl = `/uploads/covers/${req.file?.filename || 'default-cover.jpg'}`;
        await db.query('UPDATE users SET cover_image = ? WHERE id = ?', [coverUrl, userId]);
        res.json({ success: true, coverUrl });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ✅ PATCHED: deleteUser – chỉ admin mới xóa được
const deleteUser = async (req, res) => {
    try {
        const targetId = parseInt(req.params.id);
        const requesterRole = req.user.role;

        if (requesterRole !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: only admin can delete users' });
        }

        await db.query('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)', [targetId]);
        await db.query('DELETE FROM orders WHERE user_id = ?', [targetId]);
        await db.query('DELETE FROM users WHERE id = ?', [targetId]);
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ✅ PATCHED: getAllUsers – chỉ admin
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: admin only' });
        }
        const [users] = await db.query('SELECT id, username, email, full_name, role, created_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getCurrentUser,
    getUserById,
    updateUser,
    changePassword,
    uploadAvatar,
    uploadCover,
    deleteUser,
    getAllUsers
};