const jwt = require('jsonwebtoken');

// ✅ PATCHED: đọc từ env, không hardcode
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('❌ FATAL: JWT_SECRET not set in environment variables');
    process.exit(1);
}

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // ✅ PATCHED: không trả về error details ra ngoài
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { authenticate, JWT_SECRET };