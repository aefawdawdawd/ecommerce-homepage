const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// ============================================================
// ATTACK LOG – ghi tất cả request vào file attack.log
// ============================================================
const logStream = fs.createWriteStream('./attack.log', { flags: 'a' });

app.use((req, res, next) => {
    const entry = `[${new Date().toISOString()}] ${req.method} ${req.url} | IP: ${req.ip} | UA: ${req.headers['user-agent']}\n`;
    logStream.write(entry);
    process.stdout.write(entry);
    next();
});

// ============================================================
// STATIC FILES
// ============================================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
// CORS – cho phép localhost + IP LAN 192.168.1.88
// ============================================================
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://192.168.1.88:3000',   // IP LAN Blue Team
        'http://192.168.1.89:3000',   // IP LAN Red Team (nếu cần)
        'https://cinderlike-unduteously-korey.ngrok-free.dev',
        /\.ngrok-free\.dev$/,
        /\.ngrok\.io$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// SESSION – dùng HTTP cho LAN (không dùng HTTPS)
app.use(session({
    secret: process.env.SESSION_SECRET || 'weak-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,      // false vì LAN dùng HTTP
        httpOnly: false,
        sameSite: 'lax',    // lax cho HTTP
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// ============================================================
// ROUTES
// ============================================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ============================================================
// ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: err.message,
        stack: err.stack
    });
});

// ============================================================
// START SERVER – bind 0.0.0.0 để nhận kết nối từ LAN
// ============================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📝 Local:   http://localhost:${PORT}/api`);
    console.log(`🌐 LAN:     http://192.168.1.88:${PORT}/api`);
    console.log(`📋 Log:     ./attack.log`);
    console.log(`⚠️  VULNERABLE SERVER – PHASE 1 (chưa patch)\n`);
});