const db = require('../config/database');
const path = require('path');

// VULNERABILITY: SQL Injection trong tìm kiếm
const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12, sellerId, inStock } = req.query;

        console.log('📥 Received query params:', { category, minPrice, maxPrice, search, sort, page, limit, sellerId, inStock });

        // VULNERABILITY: Direct concatenation of user input
        let query = 'SELECT p.*, u.username as seller_name, u.id as seller_id FROM products p LEFT JOIN users u ON p.seller_id = u.id WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
        
        // Lọc theo category - CHỈ thêm nếu có giá trị
        if (category && category !== 'undefined' && category !== 'null') {
            console.log('🔍 Filtering by category:', category);
            query += ` AND p.category = '${category}'`;
            countQuery += ` AND category = '${category}'`;
        }
        
        // Lọc theo khoảng giá
        if (minPrice && minPrice !== 'undefined' && minPrice !== 'null') {
            query += ` AND p.price >= ${minPrice}`;
            countQuery += ` AND price >= ${minPrice}`;
        }
        if (maxPrice && maxPrice !== 'undefined' && maxPrice !== 'null') {
            query += ` AND p.price <= ${maxPrice}`;
            countQuery += ` AND price <= ${maxPrice}`;
        }
        
        // Lọc theo tình trạng còn hàng
        if (inStock === 'true' || inStock === true) {
            query += ` AND p.stock > 0`;
            countQuery += ` AND stock > 0`;
        }
        
        // Tìm kiếm theo tên
        if (search && search !== 'undefined' && search !== 'null') {
            query += ` AND (p.name LIKE '%${search}%' OR p.description LIKE '%${search}%')`;
            countQuery += ` AND (name LIKE '%${search}%' OR description LIKE '%${search}%')`;
        }
        
        // Lọc theo người bán
        if (sellerId && sellerId !== 'undefined' && sellerId !== 'null') {
            query += ` AND p.seller_id = ${sellerId}`;
            countQuery += ` AND seller_id = ${sellerId}`;
        }
        
        // Sắp xếp
        if (sort && sort !== 'undefined' && sort !== 'null') {
            switch(sort) {
                case 'price_asc':
                    query += ' ORDER BY p.price ASC';
                    break;
                case 'price_desc':
                    query += ' ORDER BY p.price DESC';
                    break;
                case 'newest':
                    query += ' ORDER BY p.created_at DESC';
                    break;
                case 'rating':
                    query += ' ORDER BY p.rating DESC, p.review_count DESC';
                    break;
                default:
                    query += ' ORDER BY p.created_at DESC';
            }
        } else {
            query += ' ORDER BY p.created_at DESC';
        }
        
        // Phân trang
        const offset = (page - 1) * limit;
        query += ` LIMIT ${limit} OFFSET ${offset}`;

        console.log('📝 Executing query:', query);

        const [products] = await db.query(query);
        const [countResult] = await db.query(countQuery);

        console.log('✅ Found', products.length, 'products, total:', countResult[0]?.total || 0);

        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0]?.total || 0,
                pages: Math.ceil((countResult[0]?.total || 0) / limit)
            }
        });
    } catch (error) {
        console.error('🔴 Error in getProducts:', error);
        res.status(500).json({ 
            error: error.message,
            sqlMessage: error.sqlMessage,
            sql: error.sql
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const [products] = await db.query(`
            SELECT p.*, u.username as seller_name, u.email as seller_email,
             (SELECT AVG(rating) FROM reviews WHERE product_id = p.id) as avg_rating,
             (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) as review_count
             FROM products p 
             LEFT JOIN users u ON p.seller_id = u.id 
             WHERE p.id = ${productId}
        `);

        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const [reviews] = await db.query(`
            SELECT r.*, u.username, u.avatar 
             FROM reviews r 
             LEFT JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ${productId} 
             ORDER BY r.created_at DESC
        `);

        const product = products[0];
        product.reviews = reviews;

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, product_condition } = req.body;
        const sellerId = req.user.id;

        // Xử lý ảnh upload từ multer
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => {
                return `/uploads/${file.filename}`;
            });
        }

        console.log('Creating product with data:', {
            sellerId,
            name,
            description,
            price,
            category,
            stock,
            product_condition,
            images: imageUrls
        });

        const imagesJson = JSON.stringify(imageUrls);
        const insertQuery = `
            INSERT INTO products (seller_id, name, description, price, category, stock, product_condition, images, status)
            VALUES (${sellerId}, '${name}', '${description || ''}', ${price}, '${category}', ${stock || 0}, '${product_condition || 'new'}', '${imagesJson}', 'active')
        `;

        console.log('Insert query:', insertQuery);

        const [result] = await db.query(insertQuery);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            productId: result.insertId,
            images: imageUrls
        });
    } catch (error) {
        console.error('Error in createProduct:', error);
        res.status(500).json({ 
            error: error.message,
            sqlMessage: error.sqlMessage
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, category, stock, product_condition, status, existingImages } = req.body;
        
        let imageUrls = [];
        
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            imageUrls = newImages;
        }
        
        if (existingImages) {
            try {
                const parsedExisting = JSON.parse(existingImages);
                imageUrls = [...imageUrls, ...parsedExisting];
            } catch (e) {
                console.log('Error parsing existingImages:', e);
            }
        }

        const imagesJson = JSON.stringify(imageUrls);
        const updateQuery = `
            UPDATE products 
            SET name = '${name}', 
                description = '${description || ''}', 
                price = ${price}, 
                category = '${category}', 
                stock = ${stock}, 
                product_condition = '${product_condition || 'new'}',
                images = '${imagesJson}',
                status = '${status || 'active'}'
            WHERE id = ${productId}
        `;

        console.log('Update query:', updateQuery);

        await db.query(updateQuery);

        res.json({ 
            success: true, 
            message: 'Product updated successfully',
            images: imageUrls 
        });
    } catch (error) {
        console.error('Error in updateProduct:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        
        await db.query(`DELETE FROM products WHERE id = ${productId}`);

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.params.sellerId || req.user.id;

        const [products] = await db.query(`
            SELECT p.*, 
             (SELECT COUNT(*) FROM order_items WHERE product_id = p.id) as order_count
             FROM products p 
             WHERE p.seller_id = ${sellerId} 
             ORDER BY p.created_at DESC
        `);

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const insertQuery = `
            INSERT INTO reviews (user_id, product_id, rating, comment) 
            VALUES (${userId}, ${productId}, ${rating}, '${comment}')
        `;

        await db.query(insertQuery);

        res.status(201).json({ success: true, message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getSellerProducts,
    addReview
};