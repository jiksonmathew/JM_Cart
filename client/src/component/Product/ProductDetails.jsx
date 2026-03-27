import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductDetails,
  createProductReview,
  clearErrors,
  deleteReview,
} from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Rating from "@mui/material/Rating";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import Loader from "../layout/Loader/Loader";
import ReviewCard from "./ReviewCard";
import toast from "react-hot-toast";
import no_image from "../../images/image_not_available.png";
import "./ProductDetails.css";

const useOfferCountdown = (endDate) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endDate) return;

    const interval = setInterval(() => {
      const diff = new Date(endDate) - new Date();

      if (diff <= 0) {
        setTimeLeft("");
        clearInterval(interval);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
};

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector((state) => state.product);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error]);

  const countdown = useOfferCountdown(product?.offer?.endDate);

  const increaseQuantity = () => {
    if (quantity >= (product?.stock || 0)) return;
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };

  const addToCartHandler = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
      toast.success("Item Added To Cart");
    } catch (err) {
      toast.error(err?.message || "Failed to add item");
    }
  };

  const buyNowHandler = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }

    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
      navigate("/cart");
    } catch (err) {
      toast.error(err?.message || "Failed");
    }
  };

  const submitReviewToggle = () => setOpen(!open);

  const reviewSubmitHandler = async () => {
    if (!rating || !comment) {
      toast.error("Please add rating and comment");
      return;
    }

    try {
      await dispatch(
        createProductReview({ rating, comment, productId: id }),
      ).unwrap();

      toast.success("Review Submitted");
      setOpen(false);
      setRating(0);
      setComment("");
      dispatch(getProductDetails(id));
    } catch (err) {
      toast.error(err?.message || "Failed");
    }
  };

  const handleRemoveReview = async (reviewId) => {
    try {
      await dispatch(deleteReview({ reviewId, productId: id })).unwrap();
      toast.success("Review removed");
      dispatch(getProductDetails(id));
    } catch {
      toast.error("Failed");
    }
  };

  if (loading) return <Loader />;
  if (!product) return null;

  const ratingOptions = {
    size: "large",
    value: product.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="ProductDetailsContainer">
      <div className="ProductDetails">
        <div className="carousel">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
          >
            {product.images?.length > 0 ? (
              product.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img src={img.url} alt="" className="CarouselImage" />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <img src={no_image} alt="" className="CarouselImage" />
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        <div className="details">
          <h2>{product.name}</h2>
          <p>Product # {product._id}</p>

          <Rating {...ratingOptions} />
          <span>({product.numOfReviews || 0} Reviews)</span>

          <div className="priceDetails">
            <span className="price">₹{product.price}</span>

            {product.offer?.percentage > 0 && (
              <>
                <span className="oldPrice">₹{product.originalPrice}</span>
                <span className="discount">
                  {product.offer.percentage}% OFF
                </span>
              </>
            )}
          </div>

          {product.offer?.title && (
            <p className="offerTitle">{product.offer.title}</p>
          )}

          {product.offer?.endDate && countdown && (
            <p className="offerTimer">⏳ Ends in {countdown}</p>
          )}

          <div>
            <button className="qtyBtn" onClick={decreaseQuantity}>
              -
            </button>
            <input type="number" className="qtyInp" readOnly value={quantity} />
            <button className="qtyBtn" onClick={increaseQuantity}>
              +
            </button>
          </div>

          <button
            className="cart-btn"
            disabled={product.stock < 1}
            onClick={addToCartHandler}
          >
            Add to Cart
          </button>

          <button
            className="cart-btn"
            disabled={product.stock < 1}
            onClick={buyNowHandler}
          >
            Buy Now
          </button>

          <p>
            Status:
            <b className={product.stock < 1 ? "redColor" : "greenColor"}>
              {product.stock < 1 ? " Out Of Stock" : " In Stock"}
            </b>
          </p>

          <p>{product.description}</p>

          <button onClick={submitReviewToggle} className="review-btn">
            Submit Review
          </button>
        </div>
      </div>

      <Dialog open={open} onClose={submitReviewToggle}>
        <DialogTitle>Submit Review</DialogTitle>
        <DialogContent>
          <Rating value={rating} onChange={(e, val) => setRating(val)} />
          <textarea
            rows="5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={submitReviewToggle}>Cancel</Button>
          <Button onClick={reviewSubmitHandler}>Submit</Button>
        </DialogActions>
      </Dialog>

      <h3 className="reviewHeading">REVIEWS</h3>

      {product.reviews?.length > 0 ? (
        product.reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            user={user}
            onRemove={handleRemoveReview}
          />
        ))
      ) : (
        <p>No Reviews Yet</p>
      )}
    </div>
  );
};

export default ProductDetails;
