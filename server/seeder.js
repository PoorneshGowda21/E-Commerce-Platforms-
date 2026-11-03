import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import { sampleProducts } from './controllers/productController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const seedData = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (uri.includes('<db_password>')) {
      console.error('❌ Cannot seed database: MONGO_URI still has "<db_password>". Please provide your database password in server/.env');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas for seeding...');

    // Clear existing collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🧹 Existing collections cleared');

    // Create Admin User
    const adminUser = await User.create({
      name: 'Store Administrator',
      email: 'admin@store.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create Sample Customer User
    const customerUser = await User.create({
      name: 'Alex Johnson',
      email: 'customer@store.com',
      password: 'customer123',
      role: 'customer',
    });

    console.log(`👤 Admin created: admin@store.com (password: admin123)`);
    console.log(`👤 Customer created: customer@store.com (password: customer123)`);

    // Insert Products
    const productsToInsert = sampleProducts.map(p => {
      const { _id, ...rest } = p;
      return rest;
    });

    await Product.insertMany(productsToInsert);
    console.log(`📦 Inserted ${productsToInsert.length} curated products`);

    console.log('\n🎉 Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
