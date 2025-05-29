# Mini E-Commerce Backend

This is the backend service for a mini e-commerce application. It provides RESTful API endpoints for product listing, product details, and order processing.

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing product and order data
- **Mongoose**: MongoDB object modeling for Node.js
- **Nodemailer**: Module for sending emails
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing
- **Dotenv**: Module for loading environment variables from .env files
- **UUID**: Library for generating unique identifiers

## Project Structure

```
be/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── models/             # Database models
│   ├── Order.js        # Order schema and model
│   └── Product.js      # Product schema and model
├── routes/             # API routes
│   ├── orderRoutes.js  # Order-related routes
│   └── productRoutes.js # Product-related routes
├── utils/              # Utility functions
│   ├── emailService.js # Email sending functionality
│   ├── resetDatabase.js # Database reset utility
│   └── seedProducts.js # Database seeding utility
├── .env                # Environment variables
├── package.json        # Project dependencies
├── server.js           # Main application entry point
└── vercel.json         # Vercel deployment configuration
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account or local MongoDB installation

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Deepanshu-Raghuwanshi/e_commerce.git
cd e_commerce/be
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

A sample `.env.example` file is provided in the repository. Copy this file and rename it to `.env`:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual credentials:

```
PORT=3001
MONGO_URI=your_mongodb_connection_string

# Mailtrap credentials for email testing
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_password
```

Replace the placeholder values with your actual MongoDB connection string and Mailtrap credentials. You can get free Mailtrap credentials by signing up at [Mailtrap.io](https://mailtrap.io).

### Database Setup

The application will automatically check if the products collection is empty when it starts. If no products are found, it will automatically seed the database with sample products, so you don't need to manually seed it for the first time.

If you want to reset the database and re-seed it at any time, you can run:

```bash
npm run reset-db
```

### Start the Server

For development with auto-reload:

```bash
npm run dev
```

For production:

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3001).

## API Endpoints

### Products

- **GET /api/products**

  - Description: Get all products
  - Response: Array of product objects

- **GET /api/products/:id**
  - Description: Get a single product by ID
  - Parameters: `id` - Product ID
  - Response: Product object

### Orders

- **POST /api/checkout**

  - Description: Process a checkout order
  - Request Body:
    ```json
    {
      "customer": {
        "name": "Customer Name",
        "email": "customer@example.com",
        "address": "123 Main St",
        "city": "Anytown",
        "state": "State",
        "zipCode": "12345"
      },
      "products": [
        {
          "productId": "product_id_here",
          "variant": "variant_name", // Optional
          "quantity": 1
        }
      ],
      "transactionCode": "1" // 1 for approved, 2 for declined, 3 for error
    }
    ```
  - Response (Success):
    ```json
    {
      "message": "Order processed successfully",
      "orderId": "ORDER_ID",
      "status": "approved",
      "totalAmount": 99.99
    }
    ```
  - Response (Failure):
    ```json
    {
      "message": "Transaction failed",
      "reason": "Payment was declined by the payment processor.",
      "status": "declined",
      "orderId": "ORDER_ID"
    }
    ```

- **GET /api/orders/:id**
  - Description: Get order details by order ID
  - Parameters: `id` - Order ID
  - Response: Order object

## Data Models

### Product Model

```javascript
{
  title: String,          // Product title
  description: String,    // Product description
  price: Number,          // Base price
  inventory: Number,      // Base inventory
  image: String,          // Main product image URL
  variants: [             // Array of product variants
    {
      name: String,       // Variant name (e.g., "Black", "64GB")
      price: Number,      // Variant-specific price
      inventory: Number,  // Variant-specific inventory
      image: String       // Variant-specific image URL
    }
  ],
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### Order Model

```javascript
{
  orderId: String,        // Unique order identifier
  customer: {
    name: String,         // Customer name
    email: String,        // Customer email
    address: String,      // Shipping address
    city: String,         // City
    state: String,        // State/Province
    zipCode: String       // Postal/ZIP code
  },
  products: [             // Array of ordered products
    {
      productId: ObjectId, // Reference to Product model
      title: String,       // Product title
      variant: String,     // Selected variant (if any)
      price: Number,       // Price at time of purchase
      quantity: Number,    // Quantity ordered
      image: String        // Product image URL
    }
  ],
  totalAmount: Number,    // Total order amount
  status: String,         // Order status: "approved", "declined", "error"
  transactionCode: String, // Payment transaction code
  createdAt: Date,        // Order creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

## Email Functionality

The application uses Nodemailer with Mailtrap for email testing. When an order is processed, the system will:

- Send an order confirmation email for successful orders
- Send a failure notification for declined or error transactions

To use this feature, make sure to set up your Mailtrap credentials in the `.env` file.

## Error Handling

The API includes comprehensive error handling for:

- Invalid request data
- Product not found
- Insufficient inventory
- Database connection issues
- Email sending failures

## Testing the API

Once the server is running, you can test the API endpoints using tools like:

- **Postman**: A popular API client for testing HTTP requests
- **cURL**: Command-line tool for making HTTP requests
- **Frontend Application**: Connect your frontend to these endpoints

### Example API Requests

#### Get All Products

```bash
curl http://localhost:3001/api/products
```

#### Get Product by ID

```bash
curl http://localhost:3001/api/products/60d21b4667d0d8992e610c85
```

#### Process Checkout

```bash
curl -X POST http://localhost:3001/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Main St",
      "city": "Anytown",
      "state": "State",
      "zipCode": "12345"
    },
    "products": [
      {
        "productId": "60d21b4667d0d8992e610c85",
        "quantity": 1
      }
    ],
    "transactionCode": "1"
  }'
```

#### Get Order by ID

```bash
curl http://localhost:3001/api/orders/ABCD1234
```

## Development Notes

- The application uses ES modules (`import`/`export` syntax)
- Nodemon is included for development auto-reloading
- The database is automatically checked on startup and seeded with sample products if empty
- No manual database setup is required for first-time use
- For local development, you can use MongoDB Atlas or run MongoDB locally

## Troubleshooting

- **Connection Issues**: Make sure your MongoDB connection string is correct and the database is accessible
- **Email Sending Failures**: Verify your Mailtrap credentials are correct
- **Missing Dependencies**: Run `npm install` to ensure all dependencies are installed
- **Port Already in Use**: Change the PORT in your .env file if port 3001 is already in use

## License

ISC
