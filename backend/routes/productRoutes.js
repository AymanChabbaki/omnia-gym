import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protectAdmin, upload.array('images'), createProduct);
router.route('/:id').get(getProductById).put(protectAdmin, upload.array('images'), updateProduct).delete(protectAdmin, deleteProduct);

export default router;
