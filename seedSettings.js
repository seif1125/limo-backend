require('dotenv').config();
const mongoose = require('mongoose');
const ContactSettings = require('./models/Contacts'); // Ensure the path is correct

const seedContacts = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 2. Define Default Contact Settings
    const defaultContacts = {
      isGlobal: true,
      emails: {
        supportMail: "support@viplimoegypt.com",
        reservationMail: "reservations@viplimoegypt.com"
      },
      phones: {
        whatsapp1: "+201222708033",
        whatsapp2: "",
        whatsapp3: "",
        hotline: "+201222708033"
      },
      socials: {
        facebook: "https://facebook.com/viplimoegypt",
        instagram: "https://instagram.com/viplimoegypt",
        tiktok: "",
        linkedin: "",
        youtube: "",
        snapchat: "",
        threads: ""
      },
      locations: [
        {
          en: "Cairo International Airport",
          ar: "مطار القاهرة الدولي",
          href: "https://maps.app.goo.gl/example",
          workingHours: {
            en: "24/7 Available",
            ar: "متاح على مدار 24 ساعة"
          },
          contactNumber: "+201222708033"
        },
        {
          en: "New Cairo Branch",
          ar: "فرع القاهرة الجديدة",
          href: "https://maps.app.goo.gl/example",
          workingHours: {
            en: "24/7 Available",
            ar: "متاح على مدار 24 ساعة"
          },
          contactNumber: "+201222708033"
        }
      ]
    };

    // 3. Upsert settings
    await ContactSettings.findOneAndUpdate(
      { isGlobal: true },
      { $set: defaultContacts },
      { new: true, upsert: true, runValidators: true }
    );

    console.log('🎉 Contact Settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding contact settings:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedContacts();