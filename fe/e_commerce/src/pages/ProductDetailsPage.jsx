import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById } from "../services/api";
import { useCart } from "../context/CartContext";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData);
          setSelectedVariant(productData.variants[0]); // Select first variant by default
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to fetch product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (selectedVariant?.inventory || 0)) {
      setQuantity(value);
    }
  };

  const handleBuyNow = () => {
    if (product && selectedVariant) {
      addToCart(product, selectedVariant, quantity);
      navigate("/checkout");
    }
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-details-page">
      <div className="page-header">
        <Link to="/" className="back-button">
          <span className="back-arrow">←</span> Back to Products
        </Link>
      </div>

      <div className="product-container">
        <div className="product-image">
          <img
            src={selectedVariant?.image || product.image}
            alt={product.title}
          />
        </div>
        <div className="product-details">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-description">{product.description}</p>
          <div className="product-price">
            ${selectedVariant?.price || product.price}
          </div>

          <div className="product-variants">
            <h3>Variants</h3>
            <div className="variants-container">
              {product.variants.map((variant) => (
                <button
                  key={variant.name}
                  className={`variant-button ${
                    selectedVariant?.name === variant.name ? "selected" : ""
                  }`}
                  onClick={() => handleVariantChange(variant)}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          <div className="product-quantity">
            <h3>Quantity</h3>
            <input
              type="number"
              min="1"
              max={selectedVariant?.inventory || product.inventory}
              value={quantity}
              onChange={handleQuantityChange}
            />
            <span className="inventory-status">
              {selectedVariant?.inventory || product.inventory} available
            </span>
          </div>

          <button
            className="buy-now-button"
            onClick={handleBuyNow}
            disabled={!selectedVariant || selectedVariant.inventory < 1}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
