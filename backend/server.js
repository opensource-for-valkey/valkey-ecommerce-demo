const express = require('express');
const cors = require('cors');
require('dotenv').config();

const valkeyService = require('./services/valkey');
const agentRoutes = require('./routes/agent');
const valkeyRoutes = require('./routes/valkey');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Valkey connection
valkeyService.connect().then(() => {
  console.log('✅ Connected to Valkey');
}).catch(err => {
  console.error('❌ Failed to connect to Valkey:', err);
  process.exit(1);
});

// Routes
app.use('/api/agent', agentRoutes);
app.use('/api/valkey', valkeyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Valkey: ${process.env.VALKEY_URL || 'valkey://localhost:6379'}`);
});

module.exports = app;
