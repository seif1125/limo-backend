const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// ==========================================
// 1. IMPORT YOUR MODELS
// Adjust the paths if your models are located elsewhere
// ==========================================
const AppSettings = require('./models/AppSettings');
const Banner = require('./models/Banner');
const Car = require('./models/Car');
const Category = require('./models/Category');
const RentalRequest = require('./models/RentalRequest');
const Testimonial = require('./models/Testimonials');
const User = require('./models/User');

// ==========================================
// 2. DUMMY DATA
// ==========================================
const usersData = [
  { name: 'Admin User', email: 'admin@limo.com', password: 'password123' }
];

const settingsData = {
  isGlobal: true,
  metadata: {
    domainUrl: 'https://monochromelimo.com',
    defaultTitle: 'Monochrome Limo | Premium Chauffeur Services',
    titleTemplate: '%s | Monochrome Limo',
    description: 'Experience luxury travel with Monochrome Limo in Egypt.',
    keywords: ['Limo', 'Egypt Travel', 'Luxury Cars', 'Chauffeur'],
    ogImage: 'https://example.com/og-image.jpg'
  },
  schemaData: {
    businessName: 'Monochrome Limo',
    businessType: 'TravelAgency',
    areaServed: ['Cairo', 'Giza', 'Alexandria'],
    servicesOffered: ['Airport Transfer', 'Corporate Travel', 'Wedding Cars']
  }
};

const bannersData = [
  { title: 'Ride in Luxury', subtitle: 'The ultimate chauffeur experience', imageUrl: 'https://example.com/banner1.jpg', buttonText: 'Book Now', buttonUrl: '/fleet' },
  { title: 'Airport Transfers', subtitle: 'Punctual and professional', imageUrl: 'https://example.com/banner2.jpg', buttonText: 'View Rates', buttonUrl: '/services' }
];

const testimonialsData = [
  { name: 'Sarah Jenkins', title: 'CEO, TechCorp', comment: 'Absolutely flawless service. The driver was early and the car was immaculate.', rating: 5, origin: 'UK', image: 'https://example.com/sarah.jpg' },
  { name: 'Ahmed Hassan', title: 'Tourist', comment: 'Made our family trip to the pyramids so comfortable!', rating: 4, origin: 'Egypt', image: 'https://example.com/ahmed.jpg' }
];

const categoriesData = [
  { name: 'LUXURY SEDAN' },
  { name: 'SUV' },
  { name: 'VAN' }
];

// ==========================================
// 3. SEEDING LOGIC
// ==========================================
const seedDatabase = async () => {
  try {
    // Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // WARNING: This completely wipes the database to ensure a clean seed.
    // We use native db.dropDatabase() to bypass the 'blockDelete' middleware on Category
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Database completely wiped (bypassed middleware restrictions).');

    // 1. Seed Standalone Models
    await User.create(usersData);
    console.log('✅ Users seeded. (Admin login: admin@limo.com / password123)');

    await AppSettings.create(settingsData);
    console.log('✅ Global App Settings seeded.');

    await Banner.create(bannersData);
    console.log('✅ Banners seeded.');

    await Testimonial.create(testimonialsData);
    console.log('✅ Testimonials seeded.');

    // 2. Seed Relational Models (Categories -> Cars -> Rentals)
    const createdCategories = await Category.insertMany(categoriesData);
    console.log('✅ Categories seeded.');

    const sedanId = createdCategories.find(c => c.name === 'LUXURY SEDAN')._id;
    const suvId = createdCategories.find(c => c.name === 'SUV')._id;

    const carsData = [
      {
        name: 'Mercedes-Benz S-Class',
        model: 'S500',
        year: 2024,
        category: sedanId,
        price: 250,
        description: 'The pinnacle of luxury sedans.',
        images: ['https://example.com/sclass.jpg'],
        featured: true,
        rentalOptions: {
          isFullDayRental: true,
          isStandardRental: true,
          fullDayHours: 12,
          limitKilometers: 150,
          extraKmCost: 2,
          extraHourCost: 20
        },
        specs: { passengers: 3, luggage: 2, wifi: true, fourWheel: false, gps: true, leatherSeats: true, climateControl: true }
      },
      {
        name: 'Cadillac Escalade',
        model: 'Premium Luxury',
        year: 2023,
        category: suvId,
        price: 350,
        description: 'Spacious and commanding presence.',
        images: ['https://example.com/escalade.jpg'],
        featured: true,
        rentalOptions: {
          isFullDayRental: false, // Standard Only
          isStandardRental: true
        },
        specs: { passengers: 6, luggage: 5, wifi: true, fourWheel: true, gps: true, leatherSeats: true, climateControl: true }
      }
    ];

    const createdCars = await Car.create(carsData);
    console.log('✅ Cars seeded.');

    const rentalsData = [
      {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone1: '+1234567890',
        nationality: 'American',
        reservationType: 'Full Day',
        pickupLocation: { address: 'Cairo International Airport', lat: 30.1219, lng: 31.4056 },
        dropoffLocation: { address: 'Marriott Mena House, Giza', lat: 29.9845, lng: 31.1325 },
        fromDate: new Date('2026-04-10T09:00:00Z'),
        toDate: new Date('2026-04-10T21:00:00Z'),
        fullDayHours: 12,
        limitKilometers: 150,
        extraKmCost: 2,
        extraHourCost: 20,
        rate: 250,
        additionalPrice: 0,
        totalPrice: 250,
        paymentType: 'Visa',
        cashDeposit: 50,
        cashRemain: 200,
        car: createdCars[0]._id, // Mercedes
        status: 'active'
      },
      {
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone1: '+44987654321',
        nationality: 'British',
        reservationType: 'Original Pickup',
        pickupLocation: { address: 'Downtown Cairo', lat: 30.0444, lng: 31.2357 },
        dropoffLocation: { address: 'Alexandria Library', lat: 31.2089, lng: 29.9092 },
        fromDate: new Date('2026-04-15T10:00:00Z'),
        toDate: new Date('2026-04-15T14:00:00Z'),
        rate: 150,
        additionalPrice: 0,
        totalPrice: 150,
        paymentType: 'Cash',
        cashDeposit: 150,
        cashRemain: 0,
        car: createdCars[1]._id, // Escalade
        status: 'pending'
      }
    ];

    await RentalRequest.create(rentalsData);
    console.log('✅ Rental Requests seeded.');

    console.log('🎉 SEEDING COMPLETE! You can now test your API.');
    process.exit();

  } catch (error) {
    console.error('❌ Seeding Error:');
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();