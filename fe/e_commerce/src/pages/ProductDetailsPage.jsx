import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProductById } from "../services/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/ToastProvider";
import { addToCart } from "../store/slices/cartSlice";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const navigate = useNavigate();
  const { addToCart: addToContextCart } = useCart();
  const { toast } = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData);
          setSelectedVariant(productData.variants[0]);
          toast.success("Product loaded successfully!");
        } else {
          setError("Product not found");
          toast.error("Product not found");
        }
      } catch (err) {
        setError("Failed to fetch product");
        toast.error("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Removed toast from dependencies

  const handleVariantChange = (variant) => {
    // Store the previous variant image URL
    const prevImageUrl = selectedVariant?.image;
    const newImageUrl = variant.image;

    setSelectedVariant(variant);
    setImageLoaded(false);
    toast.info(`Selected variant: ${variant.name}`);

    // If the image URLs are the same, set imageLoaded to true after a short delay
    // This ensures the loading state is shown briefly even when the URLs are identical
    if (prevImageUrl === newImageUrl) {
      setTimeout(() => {
        setImageLoaded(true);
      }, 300);
    }
  };

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value);
    if (value > 0 && value <= (selectedVariant?.inventory || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      setAddingToCart(true);
      try {
        dispatch(
          addToCart({
            product,
            variant: selectedVariant,
            quantity,
          })
        );
        toast.success(`Added ${quantity} item(s) to cart!`);
      } catch (err) {
        toast.error(`Failed to add item to cart: ${err}`);
      } finally {
        setAddingToCart(false);
      }
    }
  };

  const handleBuyNow = async () => {
    if (product && selectedVariant) {
      setAddingToCart(true);
      try {
        addToContextCart(product, selectedVariant, quantity);
        dispatch(
          addToCart({
            product,
            variant: selectedVariant,
            quantity,
          })
        );
        toast.success(`Added ${quantity} item(s) to cart!`);
        setTimeout(() => {
          navigate("/checkout");
        }, 500);
      } catch (err) {
        toast.error(`Failed to add item to cart: ${err}`);
      } finally {
        setAddingToCart(false);
      }
    }
  };

  if (loading) return <LoadingSpinner text="Loading product details..." />;

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Product Not Found</h2>
          <p>{error}</p>
          <Link to="/" className="back-to-products">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">📦</div>
          <h2>Product not found</h2>
          <Link to="/" className="back-to-products">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="page-header">
        <Link to="/" className="back-button">
          <span className="back-arrow">←</span>
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="product-container">
        <div className="product-image-section">
          <div className={`product-image ${imageLoaded ? "loaded" : ""}`}>
            <img
              key={selectedVariant?._id || "default"}
              src={selectedVariant?.image || product.image}
              alt={product.title}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                console.error("Failed to load image");
                setImageLoaded(true); // Show the image area even if loading fails
              }}
            />
            {!imageLoaded && (
              <div className="image-placeholder">
                <div className="image-skeleton"></div>
              </div>
            )}
          </div>
        </div>

        <div className="product-details">
          <div className="product-header">
            <h1 className="product-title">{product.title}</h1>
            <div className="product-price">
              <span className="currency">$</span>
              <span className="amount">
                {selectedVariant?.price || product.price}
              </span>
            </div>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-variants">
            <h3>Choose Variant</h3>
            <div className="variants-container">
              {product.variants.map((variant) => (
                <button
                  key={variant.name}
                  className={`variant-button ${
                    selectedVariant?.name === variant.name ? "selected" : ""
                  }`}
                  onClick={() => handleVariantChange(variant)}
                >
                  <span className="variant-name">{variant.name}</span>
                  <span className="variant-price">${variant.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="product-quantity">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={selectedVariant?.inventory || product.inventory}
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
              />
              <button
                className="quantity-btn"
                onClick={() =>
                  setQuantity(
                    Math.min(
                      selectedVariant?.inventory || product.inventory,
                      quantity + 1
                    )
                  )
                }
                disabled={
                  quantity >= (selectedVariant?.inventory || product.inventory)
                }
              >
                +
              </button>
            </div>
            <span className="inventory-status">
              {selectedVariant?.inventory || product.inventory} available
            </span>
          </div>

          <div className="product-buttons">
            <button
              className={`add-to-cart-button ${addingToCart ? "loading" : ""}`}
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                selectedVariant.inventory < 1 ||
                addingToCart
              }
            >
              {addingToCart ? (
                <>
                  <div className="button-spinner"></div>
                  Adding...
                </>
              ) : (
                "Add to Cart"
              )}
            </button>

            <button
              className={`buy-now-button ${addingToCart ? "loading" : ""}`}
              onClick={handleBuyNow}
              disabled={
                !selectedVariant ||
                selectedVariant.inventory < 1 ||
                addingToCart
              }
            >
              {addingToCart ? (
                <>
                  <div className="button-spinner"></div>
                  Processing...
                </>
              ) : (
                "Buy Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
