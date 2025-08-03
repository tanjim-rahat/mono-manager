import { config } from "dotenv";
import mongoose from "mongoose";

// Load environment variables
config({ path: ".env.local" });

// Get the database URL from environment variables
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("DB_URL environment variable is not defined");
}

// MongoDB connection options
const options = {
  bufferCommands: false,
};

// Extend global object for caching
declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(DB_URL as string, options)
      .then((mongoose) => {
        return mongoose;
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

export default connectDB;
