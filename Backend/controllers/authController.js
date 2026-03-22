const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// VULNERABILITY: SQL Injection trong đăng nhập
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // VULNERABILITY: SQL Injection - trực tiếp nối chuỗi
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        
        console.log('Executing query:', query); // VULNERABILITY: Logging sensitive info
        
        const [users] = await db.query(query);

        if (users.length > 0) {
            const user = users[0];
            
            // VULNERABILITY: Using sequential IDs for tokens
            const token = jwt.sign(
                { 
                    id: user.id, 
                    username: user.username,
                    role: user.role 
                }, 
                JWT_SECRET,
                { noTimestamp: true } // VULNERABILITY: No expiration
            );

            // VULNERABILITY: Storing sensitive data in session
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;
            req.session.password = password; // VULNERABILITY: Storing password in session

            // VULNERABILITY: Setting cookie without proper flags
            res.cookie('token', token, {
                httpOnly: false, // Allows JavaScript access
                secure: false,   // Allows HTTP
                maxAge: 24 * 60 * 60 * 1000
            });

            res.json({
                success: true,
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    password: password // VULNERABILITY: Returning password
                }
            });
        } else {
            // VULNERABILITY: Information disclosure - tells user doesn't exist
            res.status(401).json({ 
                error: 'Invalid credentials',
                attempted: { username, password } // VULNERABILITY: Echoing back credentials
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// VULNERABILITY: No rate limiting, no password complexity
const register = async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;

        // VULNERABILITY: No input validation
        // VULNERABILITY: SQL Injection
        const checkQuery = `SELECT * FROM users WHERE username = '${username}' OR email = '${email}'`;
        const [existing] = await db.query(checkQuery);

        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // VULNERABILITY: Weak password hashing (or no hashing)
        const hashedPassword = password; // VULNERABILITY: Storing plain text passwords
        
        // VULNERABILITY: SQL Injection in INSERT
        const insertQuery = `
            INSERT INTO users (username, email, password, full_name, role)
            VALUES ('${username}', '${email}', '${hashedPassword}', '${full_name}', 'user')
        `;
        
        const [result] = await db.query(insertQuery);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: result.insertId,
            credentials: { username, password } // VULNERABILITY: Returning credentials
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// VULNERABILITY: Password reset with weak token
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // VULNERABILITY: SQL Injection
        const [users] = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

        if (users.length === 0) {
            return res.status(404).json({ error: 'Email not found' });
        }

        const user = users[0];
        
        // VULNERABILITY: Predictable reset token (timestamp based)
        const resetToken = Date.now().toString(); // Predictable
const resetExpires = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' ');
        // VULNERABILITY: SQL Injection in UPDATE
        await db.query(
            `UPDATE users SET reset_token = '${resetToken}', reset_expires = '${resetExpires}' WHERE id = ${user.id}`
        );

        // VULNERABILITY: Token in response (should be emailed)
        res.json({
            success: true,
            message: 'Password reset token generated',
            resetToken: resetToken, // VULNERABILITY: Exposing token
            resetLink: `http://localhost:5000/api/auth/reset-password?token=${resetToken}`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// VULNERABILITY: Password reset without proper verification
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // VULNERABILITY: SQL Injection
        const [users] = await db.query(
            `SELECT * FROM users WHERE reset_token = '${token}'`
        );

        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        const user = users[0];

        // VULNERABILITY: No expiration check
        // Direct password update without hashing
        await db.query(
            `UPDATE users SET password = '${newPassword}', reset_token = NULL WHERE id = ${user.id}`
        );

        res.json({
            success: true,
            message: 'Password reset successful',
            newCredentials: { username: user.username, password: newPassword } // VULNERABILITY
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// VULNERABILITY: Logout doesn't invalidate token properly
const logout = (req, res) => {
    // VULNERABILITY: Doesn't blacklist the token
    req.session.destroy();
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out' });
};

module.exports = {
    login,
    register,
    forgotPassword,
    resetPassword,
    logout
};