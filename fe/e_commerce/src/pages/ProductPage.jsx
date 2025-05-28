import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";
import { useToast } from "../components/ToastProvider";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateCards, setAnimateCards] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setTimeout(() => setAnimateCards(true), 100);
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      if (productsData && productsData.length > 0) {
        setProducts(productsData);
        toast.success(`Loaded ${productsData.length} products successfully!`);
      } else {
        setError("No products found");
        toast.warning("No products available at the moment");
      }
    } catch (err) {
      setError("Failed to fetch products");
      toast.error("Failed to load products. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading products..." />;

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchProducts}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <div className="empty-icon">📦</div>
          <h2>No products found</h2>
          <p>Check back later for new arrivals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-text">Our Products</span>
          <div className="title-underline"></div>
        </h1>
        <p className="page-subtitle">
          Discover amazing products at great prices
        </p>
      </div>

      <div className={`products-grid ${animateCards ? "animate" : ""}`}>
        {products.map((product, index) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="product-card-link"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="product-card">
              <div className="product-card-image">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                />
                <div className="image-overlay">
                  <span className="view-details">View Details</span>
                </div>
              </div>
              <div className="product-card-info">
                <h3>{product.title}</h3>
                <p className="product-card-price">
                  <span className="price-label">From</span>
                  <span className="price-value">${product.price}</span>
                </p>
                <div className="card-hover-indicator"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
