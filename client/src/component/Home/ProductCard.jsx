import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import no_image from "../../images/image_not_available.png";

const useOfferCountdown = (endDate) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endDate) return;

    const end = new Date(endDate);

    if (isNaN(end)) {
      console.error("Invalid endDate:", endDate);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const countdown = useOfferCountdown(product?.offer?.endDate);

  const addToCartHandler = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
        }),
      ).unwrap();

      toast.success("Item Added To Cart 🛒");
    } catch (err) {
      toast.error(err?.message || "Failed to add item");
    }
  };

  return (
    <div className="card">
      <Link to={`/product/${product._id}`} className="cardLink">
        {product.offer?.title && (
          <div className="offerBadge">{product.offer.title}</div>
        )}

        <img
          src={
            product.images && product.images.length > 0
              ? product.images[0].url
              : "/placeholder.png"
          }
          alt={product.name}
        />

        <h3>{product.name}</h3>

        <div className="rating">
          ⭐ {product.ratings || 0} ({product.numOfReviews || 0})
        </div>

        <div className="priceBox">
          <span className="price">
            ₹{product.price ?? product.originalPrice}
          </span>

          {product.offer?.percentage > 0 && (
            <>
              <span className="oldPrice">₹{product.originalPrice}</span>
              <span className="discount">{product.offer.percentage}% OFF</span>
            </>
          )}
        </div>

        {product.offer?.endDate && countdown && (
          <div className="offerTimer">⏳ Ends in {countdown}</div>
        )}
      </Link>

      <button
        className="cartBtn"
        disabled={product.stock < 1}
        onClick={addToCartHandler}
      >
        {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;
