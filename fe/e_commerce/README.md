# Mini E-Commerce Frontend

This is the frontend application for a mini e-commerce platform. It provides a user interface for browsing products, viewing product details, managing a shopping cart, and completing the checkout process.

## Technologies Used

- **React**: JavaScript library for building user interfaces
- **Vite**: Next-generation frontend tooling
- **React Router**: Declarative routing for React applications
- **Redux Toolkit**: State management library
- **Axios**: Promise-based HTTP client for making API requests
- **Context API**: For managing application state (cart)

## Project Structure

```
fe/e_commerce/
├── public/             # Static assets
├── src/                # Source code
│   ├── assets/         # Images and other assets
│   ├── components/     # Reusable UI components
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   └── ToastProvider.jsx
│   ├── context/        # React Context providers
│   │   └── CartContext.jsx
│   ├── pages/          # Page components
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── ProductPage.jsx
│   │   └── ThankYouPage.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── store/          # Redux store configuration
│   │   ├── index.js
│   │   └── slices/     # Redux slices
│   ├── styles/         # CSS styles
│   │   └── animation.css
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Backend API running (see backend README)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Deepanshu-Raghuwanshi/e_commerce.git
cd e_commerce/fe/e_commerce
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

Then edit the `.env` file with your actual API URL:

```
VITE_API_URL=http://localhost:3001
```

This should point to your backend API URL:

- If you're running the backend locally, use the URL above (default in .env.example)
- If you're using a deployed backend, replace it with the appropriate URL
- The frontend will use this URL to make API requests

### Start the Development Server

```bash
npm run dev
```

This will start the development server, typically on http://localhost:5173 (Vite's default port).

### Build for Production

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

This will serve the production build locally for preview.

## Application Features

### Product Listing

- View all available products
- See product images, titles, and prices

### Product Details

- View detailed information about a product
- Select product variants (if available)
- Choose quantity
- Add products to cart

### Shopping Cart

- View items in cart
- See total price
- Proceed to checkout

### Checkout

- Enter shipping information
- Review order
- Complete purchase
- Receive order confirmation

### Order Confirmation

- View order details
- See order status
- Return to shopping

## State Management

The application uses a combination of Redux and React Context for state management:

- **Redux**: Used for global state management (products, UI state)
- **Context API**: Used for cart management

## API Integration

The frontend communicates with the backend API using Axios. The main API endpoints used are:

- `GET /api/products`: Fetch all products
- `GET /api/products/:id`: Fetch a single product by ID
- `POST /api/checkout`: Process checkout
- `GET /api/orders/:id`: Fetch order details

## Responsive Design

The application is designed to be responsive and work well on:

- Desktop computers
- Tablets
- Mobile devices

## Development Notes

- The application uses Vite for fast development and optimized builds
- ESLint is configured for code quality
- React Router v7 is used for navigation
- The cart is implemented using React Context for simplicity

## Connecting Frontend with Backend

To ensure the frontend and backend work together properly:

1. Start the backend server first:

   ```bash
   # In the backend directory (e_commerce/be)
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   # In the frontend directory (e_commerce/fe/e_commerce)
   npm run dev
   ```

3. Make sure your `.env` file in the frontend directory has the correct `VITE_API_URL` pointing to your backend.

4. The frontend will now be able to communicate with the backend API for:
   - Fetching products
   - Getting product details
   - Processing orders
   - Retrieving order information

## Testing the Application

Once both the frontend and backend are running, you can test the application by:

1. **Browsing Products**:

   - Visit the homepage to see all available products
   - Click on products to view their details

2. **Using the Shopping Cart**:

   - On a product details page, select a variant (if available)
   - Set the quantity
   - Click "Add to Cart"
   - Navigate to the cart page to review your items

3. **Checkout Process**:

   - From the cart page, proceed to checkout
   - Fill in the shipping information form
   - Use one of these test transaction codes:
     - `1`: Successful transaction
     - `2`: Declined transaction
     - `3`: Error transaction
   - Submit the order

4. **Order Confirmation**:
   - After successful checkout, you'll be redirected to the thank you page
   - View your order details
   - Check the email (if using Mailtrap) for order confirmation

## Performance Optimization

The application includes several performance optimizations to improve Lighthouse scores. For detailed information about all performance optimizations, implementation details, and expected improvements, see the [PERFORMANCE.md](./PERFORMANCE.md) file.

### Key Optimizations

1. **Code Splitting with React.lazy and Suspense**

   - All page components except the homepage are lazy-loaded
   - Reduces initial bundle size and improves load time

2. **Optimized HTML Structure**

   - Meta tags for SEO
   - Preconnect to API domain
   - Inline critical CSS
   - Fallback content for no-JS environments

3. **Optimized Image Component**

   - The `OptimizedImage` component (`src/components/OptimizedImage.jsx`) provides:
     - Lazy loading
     - WebP format with fallbacks
     - Responsive images with srcset
     - Blur-up loading effect

4. **Virtualized Product List**

   - The `VirtualizedProductList` component helps with rendering large product lists efficiently

5. **Optimized Vite Configuration**
   - Vendor chunk splitting for better caching
   - Terser minification with console removal
   - Optimized asset organization
   - CSS code splitting and minification
   - Manual chunk configuration for React and Redux
   - Development proxy configuration

See [PERFORMANCE.md](./PERFORMANCE.md) for implementation details and additional recommendations.

## Troubleshooting

- **API Connection Issues**:

  - Make sure the backend is running and the VITE_API_URL is set correctly
  - Check browser console for CORS errors
  - Verify network requests in browser developer tools

- **Build Errors**:

  - Ensure all dependencies are installed with `npm install`
  - Check for any version conflicts in package.json

- **Routing Issues**:

  - Check that the React Router configuration matches your expected routes
  - Verify that the browser history mode is working correctly

- **Performance Issues**:
  - Run Lighthouse in Chrome DevTools to identify specific performance bottlenecks
  - Check the Network tab to identify slow-loading resources
  - Use the Performance tab to analyze JavaScript execution time

## License

ISC
