const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Main Landing Route
app.get('/', (req, res) => {
  res.json({ message: "Monochrome Limo API v1.0", status: "Connected" });
});

// Link all Route Files
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});