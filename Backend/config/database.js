const mysql = require('mysql2');

// VULNERABILITY: Hardcoded credentials (CWE-798)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123', 
    database: 'ecommerce_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // VULNERABILITY: Cho phép multiple statements (dễ bị SQL injection)
    multipleStatements: true
});

// VULNERABILITY: No connection encryption
// VULNERABILITY: Exposing database errors directly
const promisePool = pool.promise();

// Test kết nối
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Database connected successfully');
        console.log('   Host: localhost');
        console.log('   Database: ecommerce_db');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error(`   Error: ${error.message}`);
        console.error('   Check your MySQL credentials in database.js');
        process.exit(1);
    }
};

testConnection();

module.exports = promisePool;