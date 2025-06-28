import mongoose from "mongoose";
import { config } from "../../config/config";


const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.mongodb.URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URL is not defined in the environment variables.");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); 
  }
};

export default connectDB;
