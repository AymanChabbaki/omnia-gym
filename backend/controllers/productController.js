import pool from '../config/db.js';

// @desc    Fetch all products (with optional filtering)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products';
    const queryParams = [];

    if (category && category !== 'all') {
      queryParams.push(category);
      query += ` WHERE category_id = $${queryParams.length}`;
    }

    if (search) {
      const searchTerm = `%${search}%`;
      if (queryParams.length > 0) {
        query += ` AND (name_en ILIKE $${queryParams.length + 1} OR name_ar ILIKE $${queryParams.length + 1} OR name_fr ILIKE $${queryParams.length + 1} OR brand ILIKE $${queryParams.length + 1})`;
      } else {
        query += ` WHERE (name_en ILIKE $${queryParams.length + 1} OR name_ar ILIKE $${queryParams.length + 1} OR name_fr ILIKE $${queryParams.length + 1} OR brand ILIKE $${queryParams.length + 1})`;
      }
      queryParams.push(searchTerm);
    }

    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { id, category_id, brand, price, images, name_en, name_ar, name_fr, description_en, description_ar, description_fr, tags, flavors } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO products 
      (id, category_id, brand, price, images, name_en, name_ar, name_fr, description_en, description_ar, description_fr, tags, flavors) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [id, category_id, brand, price, images || [], name_en, name_ar, name_fr, description_en, description_ar, description_fr, tags || [], flavors || []]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_id, brand, price, images, name_en, name_ar, name_fr, description_en, description_ar, description_fr, tags, flavors } = req.body;
    const { rows } = await pool.query(
      `UPDATE products SET 
        category_id = $1, brand = $2, price = $3, images = $4, name_en = $5, name_ar = $6, name_fr = $7, 
        description_en = $8, description_ar = $9, description_fr = $10, tags = $11, flavors = $12 
      WHERE id = $13 RETURNING *`,
      [category_id, brand, price, images, name_en, name_ar, name_fr, description_en, description_ar, description_fr, tags, flavors, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};
