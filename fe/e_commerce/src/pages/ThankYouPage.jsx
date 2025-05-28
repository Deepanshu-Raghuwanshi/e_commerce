import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getOrderById } from "../services/api";
import { useCart } from "../context/CartContext";

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();
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
        return;
      }

      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  // Check if order has the expected structure
  if (!order.products || !Array.isArray(order.products) || !order.customer) {
    return (
      <div className="error">
        <p>Invalid order data received. Please contact customer support.</p>
        <div className="actions" style={{ marginTop: "2rem" }}>
          <Link to="/" className="button">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isOrderApproved = order.status === "approved";

  return (
    <div className="thank-you-page">
      <div className={`order-status ${isOrderApproved ? "success" : "failed"}`}>
        <h1>
          {isOrderApproved
            ? "Thank You for Your Order!"
            : "Order Processing Failed"}
        </h1>
        <p className="order-id">Order ID: {order.orderId}</p>

        {isOrderApproved ? (
          <p className="success-message">
            Your order has been successfully processed and will be shipped soon.
          </p>
        ) : (
          <p className="error-message">
            We encountered an issue processing your order. Please contact
            customer support.
          </p>
        )}
      </div>

      <div className="order-details">
        <h2>Order Summary</h2>

        <div className="products-list">
          {order.products.map((product, index) => (
            <div className="product-item" key={index}>
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
                {product.variant && <p>Variant: {product.variant}</p>}
                <p>Quantity: {product.quantity || 1}</p>
                <p>
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
            <span>Total</span>
            <span>
              $
              {typeof order.totalAmount === "number"
                ? order.totalAmount.toFixed(2)
                : "0.00"}
            </span>
          </div>
        </div>

        <div className="customer-info">
          <h2>Customer Information</h2>
          <p>
            <strong>Name:</strong> {order.customer.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {order.customer.email || "N/A"}
          </p>
          <p>
            <strong>Shipping Address:</strong>
          </p>
          <p>
            {order.customer.address || "N/A"}
            {order.customer.city ? `, ${order.customer.city}` : ""}
            {order.customer.state ? `, ${order.customer.state}` : ""}{" "}
            {order.customer.zipCode || ""}
          </p>
        </div>
      </div>

      <div className="actions">
        <Link to="/" className="button">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
