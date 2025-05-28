import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { seedProducts } from "./utils/seedProducts.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

// Check if MongoDB URI is defined
if (mongoUri === undefined) {
  console.error("MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api", orderRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("E-Commerce Checkout API is running");
});

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Seed products on server startup
    await seedProducts();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
