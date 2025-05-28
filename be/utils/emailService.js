import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using Mailtrap credentials
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.MAILTRAP_PORT || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Function to send order confirmation email
export const sendOrderConfirmationEmail = async (order) => {
  try {
    const { customer, orderId, products, totalAmount } = order;

    // Create product list HTML
    const productsHtml = products
      .map(
        (product) => `
      <tr>
        <td>${product.title} ${
          product.variant ? `(${product.variant})` : ""
        }</td>
        <td>${product.quantity}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>$${(product.price * product.quantity).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    const mailOptions = {
      from: '"E-Commerce Store" <store@example.com>',
      to: customer.email,
      subject: `Order Confirmation #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Order Confirmation</h2>
          <p>Dear ${customer.name},</p>
          <p>Thank you for your order! Your order has been successfully processed.</p>
          
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          
          <h3>Products</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Product</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Quantity</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Price</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
              <tr style="font-weight: bold;">
                <td colspan="3" style="padding: 8px; text-align: right; border: 1px solid #ddd;">Total:</td>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">$${totalAmount.toFixed(
                  2
                )}</td>
              </tr>
            </tbody>
          </table>
          
          <h3>Shipping Address</h3>
          <p>
            ${customer.address}<br>
            ${customer.city}, ${customer.state} ${customer.zipCode}
          </p>
          
          <p>If you have any questions about your order, please contact our customer service.</p>
          
          <p>Thank you for shopping with us!</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};

// Function to send order failure email
export const sendOrderFailureEmail = async (customer, reason) => {
  try {
    const mailOptions = {
      from: '"E-Commerce Store" <store@example.com>',
      to: customer.email,
      subject: "Order Processing Failed",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Order Processing Failed</h2>
          <p>Dear ${customer.name},</p>
          <p>We're sorry, but we couldn't process your order at this time.</p>
          
          <h3>Reason</h3>
          <p>${reason}</p>
          
          <h3>What to do next</h3>
          <p>Please try the following:</p>
          <ul>
            <li>Check your payment information and try again</li>
            <li>Use a different payment method</li>
            <li>Contact your bank to ensure there are no issues with your account</li>
            <li>Try again later if there was a system error</li>
          </ul>
          
          <p>If you continue to experience issues, please contact our customer service for assistance.</p>
          
          <p>We apologize for any inconvenience this may have caused.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Order failure email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending order failure email:", error);
    throw error;
  }
};
