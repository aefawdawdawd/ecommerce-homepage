const mysql = require('mysql2');

// VULNERABILITY: multipleStatements cho phép SQL Injection (CWE-89)
// VULNERABILITY: No connection encryption
// VULNERABILITY: Exposing database errors directly
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'ecommerce_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // VULNERABILITY: Cho phép multiple statements (dễ bị SQL injection)
    multipleStatements: true
});

// VULNERABILITY: No connection encryption
// VULNERABILITY: Exposing database errors directly
const promisePool = pool.promise();

const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Database connected successfully');
        console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
        console.log(`   Database: ${process.env.DB_NAME || 'ecommerce_db'}`);
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error(`   Error: ${error.message}`);  // VULNERABILITY: Lộ lỗi DB ra ngoài
        console.error('   Check your MySQL credentials in database.js');
        process.exit(1);
    }
};

testConnection();

module.exports = promisePool;