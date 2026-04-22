import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow frontend to communicate
app.use(express.json()); // Parse JSON bodies

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// General health check route
app.get('/', (req, res) => {
  res.send('Omnia Gym API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
