import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getOrderById } from "../services/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/ToastProvider";

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { clearCart } = useCart();
  const { toast } = useToast();
  const cartCleared = useRef(false);

  useEffect(() => {
    // Clear the cart only once when the component mounts
    if (!cartCleared.current) {
      clearCart();
      cartCleared.current = true;
    }

    const fetchOrder = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        toast.error("No order ID provided");
        return;
      }

      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);

        if (orderData.status === "approved") {
          setShowConfetti(true);
          toast.success("Order confirmed successfully!");
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          toast.error("Order processing failed");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order details");
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) {
    return (
      <div className="thank-you-page">
        <div className="loading-container">
          <div className="loading-spinner large">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="thank-you-page">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <div className="actions" style={{ marginTop: "2rem" }}>
              <Link to="/" className="button primary">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="thank-you-page">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">📦</div>
            <h2>Order not found</h2>
            <div className="actions" style={{ marginTop: "2rem" }}>
              <Link to="/" className="button primary">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if order has the expected structure
  if (!order.products || !Array.isArray(order.products) || !order.customer) {
    return (
      <div className="thank-you-page">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Invalid Order Data</h2>
            <p>Invalid order data received. Please contact customer support.</p>
            <div className="actions" style={{ marginTop: "2rem" }}>
              <Link to="/" className="button primary">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOrderApproved = order.status === "approved";

  return (
    <div className="thank-you-page">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: [
                  "#ff6b6b",
                  "#4ecdc4",
                  "#45b7d1",
                  "#96ceb4",
                  "#feca57",
                ][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`order-status ${
          isOrderApproved ? "success" : "failed"
        } slide-in`}
      >
        <div className="status-icon">
          {isOrderApproved ? (
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
          ) : (
            <div className="error-icon">❌</div>
          )}
        </div>

        <h1 className="status-title">
          {isOrderApproved
            ? "Thank You for Your Order!"
            : "Order Processing Failed"}
        </h1>

        <p className="order-id">
          <span className="order-label">Order ID:</span>
          <span className="order-number">{order.orderId}</span>
        </p>

        {isOrderApproved ? (
          <p className="success-message">
            Your order has been successfully processed and will be shipped soon.
            You'll receive a confirmation email shortly.
          </p>
        ) : (
          <p className="error-message">
            We encountered an issue processing your order. Please contact
            customer support for assistance.
          </p>
        )}
      </div>

      <div className="order-details slide-in">
        <h2>Order Summary</h2>

        <div className="products-list">
          {order.products.map((product, index) => (
            <div
              className="product-item"
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="product-image">
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.title || "Product"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
              <div className="product-details">
                <h3>{product.title || "Product"}</h3>
                {product.variant && (
                  <p className="variant">Variant: {product.variant}</p>
                )}
                <p className="quantity">Quantity: {product.quantity || 1}</p>
                <p className="price">
                  Price: $
                  {typeof product.price === "number"
                    ? product.price.toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="price-summary">
          <div className="price-row total">
            <span>Total Amount</span>
            <span className="total-amount">
              $
              {typeof order.totalAmount === "number"
                ? order.totalAmount.toFixed(2)
                : "0.00"}
            </span>
          </div>
        </div>

        <div className="customer-info">
          <h2>Customer Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Name:</strong> {order.customer.name || "N/A"}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {order.customer.email || "N/A"}
            </div>
            <div className="info-item">
              <strong>Shipping Address:</strong>
              <div className="address">
                {order.customer.address || "N/A"}
                {order.customer.city ? `, ${order.customer.city}` : ""}
                {order.customer.state ? `, ${order.customer.state}` : ""}{" "}
                {order.customer.zipCode || ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="actions slide-in">
        <Link to="/" className="button primary">
          <span>Continue Shopping</span>
          <span className="button-arrow">→</span>
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
