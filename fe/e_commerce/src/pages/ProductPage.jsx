import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        if (productsData && productsData.length > 0) {
          setProducts(productsData);
        } else {
          setError("No products found");
        }
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;
  if (products.length === 0)
    return <div className="error">No products found</div>;

  return (
    <div className="product-page">
      <h1 className="page-title">Our Products</h1>

      <div className="products-grid">
        {products.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="product-card-link"
          >
            <div className="product-card">
              <div className="product-card-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-card-info">
                <h3>{product.title}</h3>
                <p className="product-card-price">From ${product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
