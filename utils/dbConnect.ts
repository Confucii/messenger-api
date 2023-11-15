import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

export async function connectDB() {
  if (mongoDB) await mongoose.connect(mongoDB);
}
