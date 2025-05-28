import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedProducts } from "./seedProducts.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)

  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Drop the products collection
      console.log("Dropping products collection...");
      await mongoose.connection.collection("products").drop();
      console.log("Products collection dropped successfully");

      // Seed the database with new products
      await seedProducts();

      console.log("Database reset and seeded successfully!");
    } catch (error) {
      // If collection doesn't exist, just seed
      if (error.code === 26) {
        console.log("Products collection does not exist, seeding new data...");
        await seedProducts();
        console.log("Database seeded successfully!");
      } else {
        console.error("Error resetting database:", error);
      }
    } finally {
      // Close the connection
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
