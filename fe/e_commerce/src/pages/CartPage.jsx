import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../store/slices/cartSlice";
import { useToast } from "../components/ToastProvider";

const CartPage = () => {
  const { items, totalItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleRemoveItem = (productId, variantId, productName) => {
    dispatch(removeFromCart({ productId, variantId }));
    toast.info(`Removed ${productName} from cart`);
  };

  const handleIncreaseQuantity = (
    productId,
    variantId,
    inventory,
    currentQty
  ) => {
    if (currentQty < inventory) {
      dispatch(increaseQuantity({ productId, variantId }));
    } else {
      toast.warning(`Only ${inventory} items available`);
    }
  };

  const handleDecreaseQuantity = (productId, variantId) => {
    dispatch(decreaseQuantity({ productId, variantId }));
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setCheckingOut(true);
    setTimeout(() => {
      navigate("/checkout");
    }, 500);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/" className="continue-shopping-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <div className="cart-summary-badge">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </div>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {items.map((item) => (
            <div
              className="cart-item"
              key={`${item.productId}-${item.variantId}`}
            >
              <div className="cart-item-image">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>

              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-variant">Variant: {item.variantName}</p>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleDecreaseQuantity(item.productId, item.variantId)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleIncreaseQuantity(
                          item.productId,
                          item.variantId,
                          item.inventory,
                          item.quantity
                        )
                      }
                      disabled={item.quantity >= item.inventory}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-item-btn"
                    onClick={() =>
                      handleRemoveItem(
                        item.productId,
                        item.variantId,
                        item.title
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="cart-item-subtotal">
                <span className="subtotal-label">Subtotal:</span>
                <span className="subtotal-amount">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <button
            className={`checkout-button ${checkingOut ? "loading" : ""}`}
            onClick={handleCheckout}
            disabled={items.length === 0 || checkingOut}
          >
            {checkingOut ? (
              <>
                <div className="button-spinner"></div>
                Processing...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </button>

          <Link to="/" className="continue-shopping-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
