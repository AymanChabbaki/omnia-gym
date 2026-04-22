import pool from '../config/db.js';

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { id, name_en, name_ar, name_fr, icon, sort_order } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO categories (id, name_en, name_ar, name_fr, icon, sort_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, name_en, name_ar, name_fr, icon, sort_order || 0]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name_en, name_ar, name_fr, icon, sort_order } = req.body;
    const { rows } = await pool.query(
      'UPDATE categories SET name_en = $1, name_ar = $2, name_fr = $3, icon = $4, sort_order = $5 WHERE id = $6 RETURNING *',
      [name_en, name_ar, name_fr, icon, sort_order, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Category not found' });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category removed' });
  } catch (error) {
    next(error);
  }
};
