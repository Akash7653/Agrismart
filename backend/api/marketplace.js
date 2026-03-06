import express from 'express';
import mysql from 'mysql2/promise';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agrismart',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET all products with filters
router.get('/products', async (req, res) => {
  try {
    const {
      category_id,
      min_price,
      max_price,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    let whereClause = 'WHERE p.is_active = TRUE';
    const params = [];

    // Build WHERE clause
    if (category_id) {
      whereClause += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (min_price) {
      whereClause += ' AND p.price >= ?';
      params.push(min_price);
    }

    if (max_price) {
      whereClause += ' AND p.price <= ?';
      params.push(max_price);
    }

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM products p 
      ${whereClause}
    `;
    const [countResult] = await db.execute(countQuery, params);
    const total = countResult[0].total;

    // Get products with pagination
    const offset = (page - 1) * limit;
    const productsQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.icon as category_icon,
        u.name as seller_name,
        u.is_verified as seller_verified
      FROM products p
      LEFT JOIN farm_categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.seller_id = u.id
      ${whereClause}
      ORDER BY p.${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `;
    
    const [products] = await db.execute(productsQuery, [...params, parseInt(limit), offset]);

    // Get product images
    for (let product of products) {
      if (product.images) {
        product.images = JSON.parse(product.images);
      } else {
        product.images = [product.image_url];
      }
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// GET product details
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.icon as category_icon,
        u.name as seller_name,
        u.is_verified as seller_verified,
        u.phone as seller_phone
      FROM products p
      LEFT JOIN farm_categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.id = ? AND p.is_active = TRUE
    `;
    
    const [products] = await db.execute(query, [id]);
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = products[0];
    
    // Parse images
    if (product.images) {
      product.images = JSON.parse(product.images);
    } else {
      product.images = [product.image_url];
    }

    // Get product variants
    const [variants] = await db.execute(
      'SELECT * FROM product_variants WHERE product_id = ?',
      [id]
    );
    product.variants = variants;

    // Get product reviews
    const [reviews] = await db.execute(`
      SELECT 
        r.*,
        u.name as user_name,
        u.is_verified as user_verified
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [id]);
    
    product.reviews = reviews;

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// GET categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.execute(`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM farm_categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.name
    `);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// POST add to cart
router.post('/cart/add', async (req, res) => {
  try {
    const { user_id, product_id, variant_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if product exists and has enough stock
    const [products] = await db.execute(
      'SELECT stock_quantity FROM products WHERE id = ? AND is_active = TRUE',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (products[0].stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Check if item already in cart
    const [existingItems] = await db.execute(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    if (existingItems.length > 0) {
      // Update quantity
      await db.execute(
        'UPDATE cart_items SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [quantity, existingItems[0].id]
      );
    } else {
      // Add new item
      await db.execute(
        'INSERT INTO cart_items (user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)',
        [user_id, product_id, variant_id || null, quantity]
      );
    }

    res.json({
      success: true,
      message: 'Item added to cart'
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to cart'
    });
  }
});

// GET cart items
router.get('/cart/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const [cartItems] = await db.execute(`
      SELECT 
        ci.*,
        p.name as product_name,
        p.description as product_description,
        p.price as unit_price,
        p.image_url,
        p.stock_quantity,
        c.name as category_name
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      LEFT JOIN farm_categories c ON p.category_id = c.id
      WHERE ci.user_id = ?
      ORDER BY ci.added_at DESC
    `, [user_id]);

    // Calculate totals
    let totalAmount = 0;
    let totalItems = 0;
    
    for (let item of cartItems) {
      const itemTotal = item.unit_price * item.quantity;
      item.total_price = itemTotal;
      totalAmount += itemTotal;
      totalItems += item.quantity;
    }

    res.json({
      success: true,
      data: {
        items: cartItems,
        totalAmount,
        totalItems
      }
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart'
    });
  }
});

// POST create order
router.post('/orders', async (req, res) => {
  try {
    const {
      user_id,
      items,
      shipping_address,
      billing_address,
      payment_method,
      razorpay_order_id,
      razorpay_payment_id
    } = req.body;

    if (!user_id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (let item of items) {
      totalAmount += item.unit_price * item.quantity;
    }

    // Generate order number
    const orderNumber = 'AGR' + Date.now() + Math.floor(Math.random() * 1000);

    // Create order
    const [orderResult] = await db.execute(`
      INSERT INTO orders (
        user_id, order_number, total_amount, final_amount,
        shipping_address, billing_address, payment_method,
        razorpay_order_id, razorpay_payment_id, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid')
    `, [
      user_id,
      orderNumber,
      totalAmount,
      totalAmount, // No delivery fee for now
      JSON.stringify(shipping_address),
      JSON.stringify(billing_address),
      payment_method,
      razorpay_order_id,
      razorpay_payment_id
    ]);

    const orderId = orderResult.insertId;

    // Add order items
    for (let item of items) {
      await db.execute(`
        INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        orderId,
        item.product_id,
        item.variant_id || null,
        item.quantity,
        item.unit_price,
        item.unit_price * item.quantity
      ]);

      // Update product stock
      await db.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await db.execute('DELETE FROM cart_items WHERE user_id = ?', [user_id]);

    res.json({
      success: true,
      message: 'Order created successfully',
      data: {
        order_id: orderId,
        order_number: orderNumber,
        total_amount: totalAmount
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
});

// GET user orders
router.get('/orders/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const [orders] = await db.execute(`
      SELECT 
        o.*,
        oi.product_id,
        oi.quantity,
        oi.unit_price,
        p.name as product_name,
        p.image_url
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [user_id]);

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// POST add to wishlist
router.post('/wishlist/add', async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    await db.execute(
      'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [user_id, product_id]
    );

    res.json({
      success: true,
      message: 'Added to wishlist'
    });

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist'
    });
  }
});

// GET wishlist
router.get('/wishlist/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const [wishlistItems] = await db.execute(`
      SELECT 
        w.*,
        p.name as product_name,
        p.description as product_description,
        p.price,
        p.image_url,
        p.rating,
        p.review_count,
        c.name as category_name
      FROM wishlist w
      LEFT JOIN products p ON w.product_id = p.id
      LEFT JOIN farm_categories c ON p.category_id = c.id
      WHERE w.user_id = ? AND p.is_active = TRUE
      ORDER BY w.added_at DESC
    `, [user_id]);

    res.json({
      success: true,
      data: wishlistItems
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist'
    });
  }
});

// DELETE from wishlist
router.delete('/wishlist/:user_id/:product_id', async (req, res) => {
  try {
    const { user_id, product_id } = req.params;

    await db.execute(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    res.json({
      success: true,
      message: 'Removed from wishlist'
    });

  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist'
    });
  }
});

export default router;
