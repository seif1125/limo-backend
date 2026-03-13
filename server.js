const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const testimonialRoutes=require('./routes/testimonialRoutes')
// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

app.use(express.json()); 
app.use(cors({
  origin: '*', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Essential for reading req.body

// Main Landing Route
app.get('/', (req, res) => {
  res.json({ message: "Monochrome Limo API v1.0", status: "Active" });
});

// Route Initializations
// These lines combine to create the full URLs (e.g., /api/auth/login)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', require('./routes/contactRoutes'));

// Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔑 Auth Test: http://localhost:${PORT}/api/auth/test`);
});