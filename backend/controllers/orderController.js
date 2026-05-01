import pool from '../config/db.js';
import { sendOrderEmail } from '../utils/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { fullName, address, city, phone, notes, subtotal, deliveryFee, total, items } = req.body;

    const orderRes = await client.query(
      `INSERT INTO orders (full_name, address, city, phone, notes, subtotal, delivery_fee, total) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [fullName, address, city, phone, notes, subtotal, deliveryFee, total]
    );

    const orderId = orderRes.rows[0].id;

    const orderItems = [];
    for (const item of items) {
      // Check stock availability
      const productRes = await client.query('SELECT stock FROM products WHERE id = $1', [item.id]);
      if (productRes.rows.length === 0) {
        throw new Error(`Product with ID ${item.id} not found`);
      }
      
      const currentStock = productRes.rows[0].stock;
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${item.name_en || item.name}. Available: ${currentStock}`);
      }

      // Decrease stock
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.id]
      );

      // Insert order item
      const itemRes = await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, flavor) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [orderId, item.id, item.name_en || item.name, item.quantity, item.price, item.flavor]
      );
      orderItems.push(itemRes.rows[0]);
    }

    await client.query('COMMIT');
    
    // Send email notification (BLOCKING for debugging)
    console.log(`Order ${orderId} created successfully. Sending email...`);
    try {
      await sendOrderEmail(orderRes.rows[0], orderItems);
      console.log(`Email process completed for Order ${orderId}`);
    } catch (emailErr) {
      console.error(`Email failed for Order ${orderId}:`, emailErr);
    }

    res.status(201).json(orderRes.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    
    // For each order, get its items
    const ordersWithItems = await Promise.all(rows.map(async (order) => {
      const itemsRes = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      return { ...order, items: itemsRes.rows };
    }));

    res.json(ordersWithItems);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    res.json({ message: 'Order removed' });
  } catch (error) {
    next(error);
  }
};
