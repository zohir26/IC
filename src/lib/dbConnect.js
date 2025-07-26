import mongoose from 'mongoose';

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URL environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering
      serverSelectionTimeoutMS: 10000, // Timeout for server selection (10s)
      socketTimeoutMS: 45000, // Timeout for socket inactivity (45s)
      family: 4, // Use IPv4
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      console.log('Database:', mongoose.connection.name);
      console.log('Host:', mongoose.connection.host);
      console.log('Port:', mongoose.connection.port);
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      cached.promise = null; // Reset promise on error
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function getDatabaseInfo() {
  const connection = await dbConnect();
  const collections = await connection.connection.db.listCollections().toArray();
  return {
    dbName: connection.connection.name,
    collections: collections.map(c => c.name),
    readyState: connection.connection.readyState,
  };
}

export default dbConnect;