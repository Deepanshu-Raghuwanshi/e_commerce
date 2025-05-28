import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ToastProvider.jsx";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/navbar";
import ProductPage from "./pages/ProductPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<ProductPage />} />
                <Route
                  path="/product/:productId"
                  element={<ProductDetailsPage />}
                />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
