import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import addressRoutes from './routes/address.js';
import orderRoutes from './routes/order.js';
import paymentRoutes from './routes/payment.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

export default app;
