import express from "express";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import {
  sendOrderConfirmationEmail,
  sendOrderFailureEmail,
} from "../utils/emailService.js";

const router = express.Router();

// POST /api/checkout - Process checkout
router.post("/checkout", async (req, res) => {
  try {
    const { customer, products, transactionCode } = req.body;

    // Validate required fields
    if (!customer || !products || !transactionCode) {
      return res.status(400).json({
        message: "Missing required fields",
        details:
          "Customer information, products, and transaction code are required",
      });
    }

    // Validate customer data
    if (
      !customer.name ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.zipCode
    ) {
      return res.status(400).json({
        message: "Incomplete customer information",
        details: "Name, email, address, city, state, and zip code are required",
      });
    }

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Invalid products data",
        details: "Products must be a non-empty array",
      });
    }

    // Determine transaction outcome based on the transaction code
    let status;
    let failureReason = "";

    switch (transactionCode) {
      case "1":
        status = "approved";
        break;
      case "2":
        status = "declined";
        failureReason = "Payment was declined by the payment processor.";
        break;
      case "3":
        status = "error";
        failureReason = "A gateway error occurred during payment processing.";
        break;
      default:
        status = "error";
        failureReason = "Invalid transaction code provided.";
    }

    // If transaction is approved, process the order
    if (status === "approved") {
      // Calculate total amount and prepare order products
      let totalAmount = 0;
      const orderProducts = [];

      // Process each product
      for (const item of products) {
        // Find the product in the database
        const product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            message: "Product not found",
            details: `Product with ID ${item.productId} does not exist`,
          });
        }

        // Check if variant exists if specified
        let variantPrice = product.price;
        let variantInventory = product.inventory;
        let variantName = null;

        if (item.variant) {
          const variant = product.variants.find((v) => v.name === item.variant);

          if (!variant) {
            return res.status(404).json({
              message: "Variant not found",
              details: `Variant ${item.variant} does not exist for product ${product.title}`,
            });
          }

          variantPrice = variant.price;
          variantInventory = variant.inventory;
          variantName = variant.name;
        }

        // Check inventory
        if (variantInventory < item.quantity) {
          return res.status(400).json({
            message: "Insufficient inventory",
            details: `Not enough inventory for ${product.title} ${
              variantName ? `(${variantName})` : ""
            }`,
          });
        }

        // Get the appropriate image
        let productImage = product.image;
        if (variantName) {
          const variant = product.variants.find((v) => v.name === variantName);
          if (variant && variant.image) {
            productImage = variant.image;
          }
        }

        // Add to order products
        orderProducts.push({
          productId: product._id,
          title: product.title,
          variant: variantName,
          price: variantPrice,
          quantity: item.quantity,
          image: productImage,
        });

        // Add to total amount
        totalAmount += variantPrice * item.quantity;

        // Update inventory
        if (variantName) {
          // Update variant inventory
          const variantIndex = product.variants.findIndex(
            (v) => v.name === variantName
          );
          product.variants[variantIndex].inventory -= item.quantity;
        } else {
          // Update main product inventory
          product.inventory -= item.quantity;
        }

        // Save product with updated inventory
        await product.save();
      }

      // Generate unique order ID
      const orderId = uuidv4().substring(0, 8).toUpperCase();

      // Create new order
      const newOrder = new Order({
        orderId,
        customer,
        products: orderProducts,
        totalAmount,
        status,
        transactionCode,
      });

      // Save order to database
      await newOrder.save();

      // Send confirmation email but don't block the process if it fails
      try {
        const emailResult = await sendOrderConfirmationEmail(newOrder);
        if (emailResult.error) {
          console.log(
            "Email sending failed but order was processed:",
            emailResult.message
          );
        }
      } catch (emailError) {
        console.error(
          "Error in email sending but order was processed:",
          emailError
        );
      }

      // Return success response
      return res.status(201).json({
        message: "Order processed successfully",
        orderId,
        status,
        totalAmount,
      });
    } else {
      // For declined or error transactions

      // Create a record of the failed attempt if needed
      const orderId = uuidv4().substring(0, 8).toUpperCase();

      // Calculate total amount for the failed order
      let totalAmount = 0;
      const orderProducts = [];

      for (const item of products) {
        const product = await Product.findById(item.productId);

        if (product) {
          let variantPrice = product.price;
          let variantName = null;

          if (item.variant) {
            const variant = product.variants.find(
              (v) => v.name === item.variant
            );
            if (variant) {
              variantPrice = variant.price;
              variantName = variant.name;
            }
          }

          // Get the appropriate image
          let productImage = product.image;
          if (variantName) {
            const variant = product.variants.find(
              (v) => v.name === variantName
            );
            if (variant && variant.image) {
              productImage = variant.image;
            }
          }

          orderProducts.push({
            productId: product._id,
            title: product.title,
            variant: variantName,
            price: variantPrice,
            quantity: item.quantity,
            image: productImage,
          });

          totalAmount += variantPrice * item.quantity;
        }
      }

      // Create and save the failed order
      const failedOrder = new Order({
        orderId,
        customer,
        products: orderProducts,
        totalAmount,
        status,
        transactionCode,
      });

      await failedOrder.save();

      // Send failure email but don't block the process if it fails
      try {
        const emailResult = await sendOrderFailureEmail(
          customer,
          failureReason
        );
        if (emailResult.error) {
          console.log("Failure email sending failed:", emailResult.message);
        }
      } catch (emailError) {
        console.error("Error in failure email sending:", emailError);
      }

      // Return appropriate error response
      return res.status(400).json({
        message: "Transaction failed",
        reason: failureReason,
        status,
        orderId,
      });
    }
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/orders/:id - Get order by ID
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
