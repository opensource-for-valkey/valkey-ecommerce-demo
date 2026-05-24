require('dotenv').config();
const express = require('express');
const cors = require('cors');
const valkeyClient = require('./valkeyClient');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const vendorRoutes = require('./routes/vendors');
const searchRoutes = require('./routes/search');
const adRoutes = require('./routes/ads');
const agentRoutes = require('./routes/agent');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/agent', agentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  try {
    await valkeyClient.connect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
