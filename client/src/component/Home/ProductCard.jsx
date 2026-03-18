import { Link } from "react-router-dom";

import Rating from "@mui/material/Rating";

import no_image from "../../images/image_not_available.png";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const { _id, name, price, ratings, numOfReviews, images = [] } = product;

  const imageUrl = images?.[0]?.url || no_image;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price || 0);

  return (
    <Link className="productCard" to={`/product/${_id}`}>
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        onError={(e) => (e.target.src = no_image)}
      />

      <p className="productName" title={name}>
        {name}
      </p>

      <div className="productCardRating">
        <Rating
          value={Number(ratings) || 0}
          readOnly
          precision={0.5}
          size="small"
        />

        <span className="productCardSpan">({numOfReviews || 0} Reviews)</span>
      </div>

      <span className="productCardPrice">{formattedPrice}</span>
    </Link>
  );
};

export default ProductCard;
