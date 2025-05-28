import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { processCheckout } from "../services/api";

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Redirect if cart is empty
  if (!cart.product) {
    navigate("/");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = "Valid email is required";
    }

    // Validate phone
    const phoneRegex = /^\d{10}$/;
    if (
      !formData.phone.trim() ||
      !phoneRegex.test(formData.phone.replace(/[^0-9]/g, ""))
    ) {
      errors.phone = "Valid 10-digit phone number is required";
    }

    // Validate address
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    // Validate city
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    // Validate state
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    // Validate zip code
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!formData.zipCode.trim() || !zipRegex.test(formData.zipCode)) {
      errors.zipCode = "Valid ZIP code is required (e.g., 12345 or 12345-6789)";
    }

    // Validate card number
    const cardNumberRegex = /^\d{16}$/;
    if (
      !formData.cardNumber.trim() ||
      !cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ""))
    ) {
      errors.cardNumber = "Valid 16-digit card number is required";
    }

    // Validate expiry date
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!formData.expiryDate.trim() || !expiryRegex.test(formData.expiryDate)) {
      errors.expiryDate = "Valid expiry date is required (MM/YY)";
    } else {
      // Check if date is in the future
      const [month, year] = formData.expiryDate.split("/");
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();

      if (expiryDate <= currentDate) {
        errors.expiryDate = "Expiry date must be in the future";
      }
    }

    // Validate CVV
    const cvvRegex = /^\d{3}$/;
    if (!formData.cvv.trim() || !cvvRegex.test(formData.cvv)) {
      errors.cvv = "Valid 3-digit CVV is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll use transaction code 1 (success)
      // In a real app, this would come from the payment processor
      const transactionCode = "1";

      const checkoutData = {
        customer: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        products: [
          {
            productId: cart.product._id,
            variant: cart.variant.name,
            quantity: cart.quantity,
          },
        ],
        transactionCode,
      };

      const response = await processCheckout(checkoutData);

      // Navigate to thank you page with order ID
      navigate(`/thank-you?orderId=${response.orderId}`);
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to process checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cart.variant.price * cart.quantity;
  const total = subtotal; // Add tax, shipping, etc. if needed

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="checkout-container">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <h2>Customer Information</h2>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={formErrors.name ? "error" : ""}
              />
              {formErrors.name && (
                <div className="error-text">{formErrors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? "error" : ""}
              />
              {formErrors.email && (
                <div className="error-text">{formErrors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={formErrors.phone ? "error" : ""}
              />
              {formErrors.phone && (
                <div className="error-text">{formErrors.phone}</div>
              )}
            </div>

            <h2>Shipping Address</h2>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={formErrors.address ? "error" : ""}
              />
              {formErrors.address && (
                <div className="error-text">{formErrors.address}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={formErrors.city ? "error" : ""}
                />
                {formErrors.city && (
                  <div className="error-text">{formErrors.city}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={formErrors.state ? "error" : ""}
                />
                {formErrors.state && (
                  <div className="error-text">{formErrors.state}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={formErrors.zipCode ? "error" : ""}
                />
                {formErrors.zipCode && (
                  <div className="error-text">{formErrors.zipCode}</div>
                )}
              </div>
            </div>

            <h2>Payment Information</h2>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={formErrors.cardNumber ? "error" : ""}
              />
              {formErrors.cardNumber && (
                <div className="error-text">{formErrors.cardNumber}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className={formErrors.expiryDate ? "error" : ""}
                />
                {formErrors.expiryDate && (
                  <div className="error-text">{formErrors.expiryDate}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={formErrors.cvv ? "error" : ""}
                />
                {formErrors.cvv && (
                  <div className="error-text">{formErrors.cvv}</div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="checkout-button"
              disabled={loading}
            >
              {loading ? "Processing..." : "Complete Purchase"}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="product-summary">
            <div className="product-image">
              <img src={cart.variant.image} alt={cart.product.title} />
            </div>
            <div className="product-info">
              <h3>{cart.product.title}</h3>
              <p>Variant: {cart.variant.name}</p>
              <p>Quantity: {cart.quantity}</p>
              <p>Price: ${cart.variant.price}</p>
            </div>
          </div>

          <div className="price-summary">
            <div className="price-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
