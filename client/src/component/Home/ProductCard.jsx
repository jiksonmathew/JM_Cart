import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const { _id, name, price, ratings, numOfReviews, images = [] } = product;

  const imageUrl = images?.[0]?.url || "/placeholder.png";

  return (
    <Link className="productCard" to={`/product/${_id}`}>
      <img src={imageUrl} alt={name} loading="lazy" />

      <p className="productName">{name}</p>

      <div className="productCardRating">
        <Rating value={ratings || 0} readOnly precision={0.5} size="small" />

        <span className="productCardSpan">({numOfReviews || 0} Reviews)</span>
      </div>

      <span className="productCardPrice">₹{price}</span>
    </Link>
  );
};

export default ProductCard;
