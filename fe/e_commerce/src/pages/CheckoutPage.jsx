"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { processCheckout } from "../services/api";
import { useToast } from "../components/ToastProvider";

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

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
  const [focusedField, setFocusedField] = useState(null);

  // Redirect if cart is empty
  if (!cart.product) {
    navigate("/");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Format specific fields
    let formattedValue = value;
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
    } else if (name === "phone") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
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
      const expiryDate = new Date(
        2000 + Number.parseInt(year),
        Number.parseInt(month) - 1
      );
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
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      toast.info("Processing your order...");

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

      toast.success("Order placed successfully!");

      // Navigate to thank you page with order ID
      setTimeout(() => {
        navigate(`/thank-you?orderId=${response.orderId}`);
      }, 1000);
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to process checkout. Please try again.");
      toast.error("Failed to process your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cart.variant.price * cart.quantity;
  const total = subtotal;

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      {error && (
        <div className="error-message slide-in">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="checkout-container">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>
                <span className="section-number">1</span>
                Customer Information
              </h2>

              <div className="form-group">
                <label
                  htmlFor="name"
                  className={focusedField === "name" ? "focused" : ""}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className={formErrors.name ? "error" : ""}
                />
                {formErrors.name && (
                  <div className="error-text slide-in">{formErrors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label
                  htmlFor="email"
                  className={focusedField === "email" ? "focused" : ""}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={formErrors.email ? "error" : ""}
                />
                {formErrors.email && (
                  <div className="error-text slide-in">{formErrors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label
                  htmlFor="phone"
                  className={focusedField === "phone" ? "focused" : ""}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  className={formErrors.phone ? "error" : ""}
                  placeholder="(123) 456-7890"
                />
                {formErrors.phone && (
                  <div className="error-text slide-in">{formErrors.phone}</div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2>
                <span className="section-number">2</span>
                Shipping Address
              </h2>

              <div className="form-group">
                <label
                  htmlFor="address"
                  className={focusedField === "address" ? "focused" : ""}
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField(null)}
                  className={formErrors.address ? "error" : ""}
                />
                {formErrors.address && (
                  <div className="error-text slide-in">
                    {formErrors.address}
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label
                    htmlFor="city"
                    className={focusedField === "city" ? "focused" : ""}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("city")}
                    onBlur={() => setFocusedField(null)}
                    className={formErrors.city ? "error" : ""}
                  />
                  {formErrors.city && (
                    <div className="error-text slide-in">{formErrors.city}</div>
                  )}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="state"
                    className={focusedField === "state" ? "focused" : ""}
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("state")}
                    onBlur={() => setFocusedField(null)}
                    className={formErrors.state ? "error" : ""}
                  />
                  {formErrors.state && (
                    <div className="error-text slide-in">
                      {formErrors.state}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="zipCode"
                    className={focusedField === "zipCode" ? "focused" : ""}
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("zipCode")}
                    onBlur={() => setFocusedField(null)}
                    className={formErrors.zipCode ? "error" : ""}
                  />
                  {formErrors.zipCode && (
                    <div className="error-text slide-in">
                      {formErrors.zipCode}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>
                <span className="section-number">3</span>
                Payment Information
              </h2>

              <div className="form-group">
                <label
                  htmlFor="cardNumber"
                  className={focusedField === "cardNumber" ? "focused" : ""}
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("cardNumber")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="1234 5678 9012 3456"
                  className={formErrors.cardNumber ? "error" : ""}
                  maxLength="19"
                />
                {formErrors.cardNumber && (
                  <div className="error-text slide-in">
                    {formErrors.cardNumber}
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label
                    htmlFor="expiryDate"
                    className={focusedField === "expiryDate" ? "focused" : ""}
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("expiryDate")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="MM/YY"
                    className={formErrors.expiryDate ? "error" : ""}
                    maxLength="5"
                  />
                  {formErrors.expiryDate && (
                    <div className="error-text slide-in">
                      {formErrors.expiryDate}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="cvv"
                    className={focusedField === "cvv" ? "focused" : ""}
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("cvv")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="123"
                    className={formErrors.cvv ? "error" : ""}
                    maxLength="3"
                  />
                  {formErrors.cvv && (
                    <div className="error-text slide-in">{formErrors.cvv}</div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`checkout-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span>Complete Purchase</span>
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <div className="summary-header">
            <h2>Order Summary</h2>
          </div>

          <div className="product-summary">
            <div className="product-image">
              <img
                src={cart.variant.image || "/placeholder.svg"}
                alt={cart.product.title}
              />
            </div>
            <div className="product-info">
              <h3>{cart.product.title}</h3>
              <p className="variant-info">Variant: {cart.variant.name}</p>
              <p className="quantity-info">Quantity: {cart.quantity}</p>
              <p className="price-info">${cart.variant.price}</p>
            </div>
          </div>

          <div className="price-summary">
            <div className="price-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="security-info">
            <div className="security-icon">🔒</div>
            <p>Your payment information is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
