require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const dashboardRoutes = require('./routes/dashboard');
const marketRoutes = require('./routes/market');
const buyerRoutes = require('./routes/buyers');
const fundingRoutes = require('./routes/funding');
const guideRoutes = require('./routes/guide');
const shipmentRoutes = require('./routes/shipments');
const analyticsRoutes = require('./routes/analytics');
const metaRoutes = require('./routes/meta');
const chatRoutes = require('./routes/chat');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/exportbridge';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Backend working');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/funding', fundingRoutes);
app.use('/api/guide', guideRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});