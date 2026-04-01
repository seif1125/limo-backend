const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const testimonialRoutes = require('./routes/testimonialRoutes');

// Load environment variables
dotenv.config();

const app = express();

// 1. MIDDLEWARE
app.use(express.json()); 
app.use(cors({
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

// 2. DATABASE CONNECTION MIDDLEWARE (Serverless Optimization)
// This ensures we are connected before processing any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// 3. ROUTES
app.get('/', (req, res) => {
  res.json({ message: "Monochrome Limo API v1.0", status: "Active" });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/app-settings', require('./routes/settingsRoute'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// 4. EXPORT FOR VERCEL (The most important part)
// We keep the listener for local development, but Vercel uses the export.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;