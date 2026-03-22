const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Tạo kết nối không chọn database cụ thể
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
});

// Đọc file SQL
const sqlFile = path.join(__dirname, 'database.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Chạy script SQL
connection.query(sql, (err, results) => {
    if (err) {
        console.error('❌ Error setting up database:');
        console.error(err);
        process.exit(1);
    }
    
    console.log('✅ Database setup completed successfully!');
    console.log('   Tables created: users, products, orders, order_items, reviews, sessions');
    
    // Kiểm tra dữ liệu đã được insert chưa
    connection.query('USE ecommerce_db; SELECT * FROM users;', (err, results) => {
        if (err) {
            console.error('❌ Error checking data:', err);
        } else {
            const users = results[1]; // Kết quả của SELECT
            console.log(`   Inserted ${users.length} test users`);
        }
        
        connection.end();
    });
});