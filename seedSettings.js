const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/Car'); // Ensure path is correct
const RentalRequest = require('./models/RentalRequest');
const categorys = require('./models/Category'); // Ensure this file exists and has the correct structure

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your_db_name')
  .then(() => console.log('MongoDB Connected for Seeding...'))
  .catch(err => console.log(err));

const seedData = async () => {
  try {
    // 1. Clear existing data
    await Car.deleteMany();
    await RentalRequest.deleteMany();
    console.log('Data Cleared...');

    const sampleCategory = await categorys.create({
     id: "s-class",
      name: "S-class",
      
    });

    // 2. Create a Dummy Car
    const sampleCar = await Car.create({
      id: "s-class-2024",
      name: "Mercedes-Benz S-Class",
      model: "S-Class",
      year: "2024",
      category: sampleCategory._id, // Reference to the created category
      images: [
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800", // Exterior side
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800", // Interior Luxury
        "https://images.unsplash.com/photo-1622199611394-399a0937c86a?auto=format&fit=crop&q=80&w=800"  // Cockpit/Wheel
      ],
      price: "400",
      description: "The ultimate symbol of luxury and innovation. Perfect for executive travel.",
      featured: true,
      specs: { passengers: 3, luggage: 2, wifi: true, fourWheel: false, gps: true, leatherSeats: true, climateControl: true }


    });

    // 3. Create Sample Reservations
    const reservations = [
      {
        customerName: "John Smith",
        email: "john@example.com",
        phone1: "+20123456789",
        nationality: "British",
        reservationType: "Full Day",
        pickupLocation: "Cairo Airport (Terminal 3)",
        dropoffLocation: "Four Seasons Hotel Nile Plaza",
        fromDate: new Date('2026-04-01T09:00:00'),
        toDate: new Date('2026-04-01T21:00:00'),
        fullDayHours: 12,
        limitKilometers: 150,
        extraKmCost: 15,
        extraHourCost: 200,
        rate: 4500,
        totalPrice: 4500,
        paymentType: "Visa",
        cashDeposit: 1000,
        cashRemain: 3500,
        car: sampleCar._id,
        status: "pending"
      },
      {
        customerName: "Ahmed Ali",
        email: "ahmed@example.com",
        phone1: "+20100998877",
        nationality: "Egyptian",
        reservationType: "Original Pickup",
        pickupLocation: "New Cairo",
        dropoffLocation: "Alexandria Desert Road",
        fromDate: new Date('2026-04-05T10:00:00'),
        toDate: new Date('2026-04-05T14:00:00'),
        rate: 2500,
        totalPrice: 2500,
        paymentType: "Cash",
        cashDeposit: 500,
        cashRemain: 2000,
        car: sampleCar._id,
        status: "active"
      }
    ];

    await RentalRequest.insertMany(reservations);
    console.log('Database Seeded Successfully! 🌱');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();