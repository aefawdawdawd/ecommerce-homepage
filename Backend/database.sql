-- Tạo database
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Bảng users (VULNERABILITY: Plain text passwords, no proper validation)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- VULNERABILITY: Should be hashed, but we'll store plain text for some accounts
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reset_token VARCHAR(255), -- VULNERABILITY: Weak token generation
    reset_expires DATETIME
);

-- Bảng products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2),
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    payment_method VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bảng order_items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Bảng reviews (VULNERABILITY: No input validation)
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Bảng sessions (VULNERABILITY: Plain text session storage)
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_token VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert dữ liệu mẫu (VULNERABILITY: Plain text passwords for testing)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@example.com', 'admin123', 'Administrator', 'admin'),
('user1', 'user1@example.com', 'password123', 'John Doe', 'user'),
('user2', 'user2@example.com', '123456', 'Jane Smith', 'user'),
('test', 'test@example.com', 'test123', 'Test User', 'user');

INSERT INTO products (name, description, price, category, image_url, stock) VALUES
('Smartphone X', 'Latest smartphone with advanced features', 699.99, 'Electronics', 'https://example.com/phone.jpg', 50),
('Laptop Pro', 'High-performance laptop for professionals', 1299.99, 'Electronics', 'https://example.com/laptop.jpg', 30),
('Wireless Headphones', 'Noise-cancelling bluetooth headphones', 199.99, 'Audio', 'https://example.com/headphones.jpg', 100),
('Smart Watch', 'Fitness tracking and notifications', 249.99, 'Wearables', 'https://example.com/watch.jpg', 75),
('Tablet Mini', 'Portable tablet for entertainment', 329.99, 'Electronics', 'https://example.com/tablet.jpg', 40);

INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Great product! Highly recommended.'),
(2, 2, 4, 'Good laptop but a bit expensive'),
(3, 1, 3, 'Average product'),
(3, 3, 5, 'Excellent headphones!');