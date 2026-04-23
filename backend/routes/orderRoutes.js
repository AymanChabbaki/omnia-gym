import express from 'express';
import { createOrder, getOrders, deleteOrder } from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(protectAdmin, getOrders);

router.route('/:id')
  .delete(protectAdmin, deleteOrder);

export default router;
