import mongoose from 'mongoose';

// Disable Mongoose buffering so queries fallback immediately instead of hanging
mongoose.set('bufferCommands', false);

export let isDbConnected = false;

export const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Global cache for Serverless environments (Vercel)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    isDbConnected = true;
    return true;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI is not defined in environment variables.');
    return false;
  }

  if (uri.includes('<db_password>')) {
    console.warn('\n============================================================');
    console.warn('⚠️  MONGODB CONFIGURATION NOTICE:');
    console.warn('Your MONGO_URI in server/.env currently has "<db_password>".');
    console.warn('👉 Replace "<db_password>" with your real MongoDB Atlas password.');
    console.warn('⚡ In the meantime, AURA Smart In-Memory Resilience Mode is ACTIVE.');
    console.warn('============================================================\n');
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 4000,
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      isDbConnected = true;
      console.log(`✅ MongoDB Connected successfully: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      isDbConnected = false;
      console.warn(`⚠️ MongoDB Connection Notice: ${err.message}`);
      console.log('⚡ High-Availability In-Memory Engine active.');
      return false;
    });
  }

  try {
    cached.conn = await cached.promise;
    return Boolean(cached.conn);
  } catch (e) {
    cached.promise = null;
    return false;
  }
};
