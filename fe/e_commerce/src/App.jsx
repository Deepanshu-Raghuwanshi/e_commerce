import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastProvider } from "./components/ToastProvider.jsx";
import { CartProvider } from "./context/CartContext";
import store from "./store";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

// Use lazy loading for route components to improve performance
// Only the ProductPage (homepage) is loaded eagerly
import ProductPage from "./pages/ProductPage";
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));
const CartPage = lazy(() => import("./pages/CartPage"));

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<ProductPage />} />
                    <Route
                      path="/product/:productId"
                      element={<ProductDetailsPage />}
                    />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/thank-you" element={<ThankYouPage />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </Router>
        </CartProvider>
      </ToastProvider>
    </Provider>
  );
}

export default App;
