// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import detectRoutes from './routes/detect';
import listingsRoutes from './routes/listings';
import ordersRoutes from './routes/orders';
import paymentsRoutes from './routes/payments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'AgroSmart API is running 🌿',
    version: '1.0.0',
    endpoints: ['/detect', '/listings', '/orders', '/payments']
  });
});

// Routes
app.use('/detect', detectRoutes);
app.use('/listings', listingsRoutes);
app.use('/orders', ordersRoutes);
app.use('/payments', paymentsRoutes);

app.listen(PORT, () => {
  console.log(`🌿 AgroSmart backend running on port ${PORT}`);
});

export default app;