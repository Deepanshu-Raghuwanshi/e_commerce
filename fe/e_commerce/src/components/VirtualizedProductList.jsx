import { memo } from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

/**
 * VirtualizedProductList component for better performance with large product lists
 *
 * This is a simplified example. In a real application, you would use a library like
 * react-window or react-virtualized for true virtualization.
 *
 * @param {Object} props Component props
 * @param {Array} props.products Array of product objects
 */
const VirtualizedProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return <div className="no-products">No products found</div>;
  }

  return (
    <div className="virtualized-product-list">
      {products.map((product) => (
        <MemoizedProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

// Memoized product card to prevent unnecessary re-renders
const ProductCard = ({ product }) => {
  const { _id, title, price, image, variants } = product;

  // Get the lowest price from variants or use the base price
  const lowestPrice =
    variants && variants.length > 0
      ? Math.min(...variants.map((v) => v.price), price)
      : price;

  return (
    <Link to={`/product/${_id}`} className="product-card">
      <div className="product-image-container">
        <OptimizedImage
          src={image}
          alt={title}
          className="product-image"
          // You would generate a low-quality placeholder in a real app
          placeholder={image + "?w=20"}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">${lowestPrice.toFixed(2)}</p>
        {variants && variants.length > 0 && (
          <p className="product-variants">
            {variants.length} variants available
          </p>
        )}
      </div>
    </Link>
  );
};

// Memoize the product card to prevent unnecessary re-renders
const MemoizedProductCard = memo(ProductCard);

export default VirtualizedProductList;
