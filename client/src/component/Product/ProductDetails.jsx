import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";
import no_image from "../../images/image_not_available.png";
import "./ProductDetails.css";

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

  const increaseQuantity = () => {
    if (quantity >= product?.stock) return;
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
      await dispatch(
        addToCart({
          productId: product._id,
          quantity,
        }),
      ).unwrap();

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
      await dispatch(
        addToCart({
          productId: product._id,
          quantity,
        }),
      ).unwrap();

      navigate("/cart");
    } catch (err) {
      toast.error(err?.message || "Failed to proceed");
    }
  };

  const submitReviewToggle = () => {
    setOpen(!open);
  };

  const reviewSubmitHandler = async () => {
    if (!isAuthenticated) {
      toast.error("Login required to review");
      return;
    }

    if (!rating || !comment) {
      toast.error("Please add rating and comment");
      return;
    }

    try {
      await dispatch(
        createProductReview({
          rating,
          comment,
          productId: id,
        }),
      ).unwrap();

      toast.success("Review Submitted");

      setOpen(false);
      setRating(0);
      setComment("");

      dispatch(getProductDetails(id));
    } catch (err) {
      toast.error(err?.message || "Failed to submit review");
    }
  };

  const handleRemoveReview = async (reviewId) => {
    try {
      await dispatch(
        deleteReview({
          reviewId,
          productId: id,
        }),
      ).unwrap();

      toast.success("Review removed");

      dispatch(getProductDetails(id));
    } catch (err) {
      toast.error(err || "Failed to remove review");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProductDetails(id));
  }, [dispatch, id, error]);

  const ratingOptions = {
    size: "large",
    value: product?.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  if (loading) return <Loader />;

  return (
    <div className="ProductDetailsContainer">
      <div className="ProductDetails">
        <div className="carousel">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            slidesPerView={1}
          >
            {product?.images?.length > 0 ? (
              product.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img.url}
                    alt={product.name}
                    className="CarouselImage"
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <img src={no_image} alt="No image" className="CarouselImage" />
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        <div>
          <div className="detailsBlock-1">
            <h2>{product?.name}</h2>
            <p>Product # {product?._id}</p>
          </div>

          <div className="detailsBlock-2">
            <Rating {...ratingOptions} />
            <span className="detailsBlock-2-span">
              ({product?.numOfReviews || 0} Reviews)
            </span>
          </div>

          <div className="detailsBlock-3">
            <h1>₹{product?.price}</h1>

            <div className="detailsBlock-3-1">
              <div className="detailsBlock-3-1-1">
                <button onClick={decreaseQuantity}>-</button>
                <input type="number" readOnly value={quantity} />
                <button onClick={increaseQuantity}>+</button>
              </div>

              <div className="actionButtons">
                <button
                  className="addToCartBtn"
                  disabled={product?.stock < 1}
                  onClick={addToCartHandler}
                >
                  Add to Cart
                </button>

                <button
                  className="buyNowBtn"
                  disabled={product?.stock < 1}
                  onClick={buyNowHandler}
                >
                  Buy Now
                </button>
              </div>
            </div>

            <p>
              Status:
              <b className={product?.stock < 1 ? "redColor" : "greenColor"}>
                {product?.stock < 1 ? " Out Of Stock" : " In Stock"}
              </b>
            </p>
          </div>

          <div className="detailsBlock-4">
            Description
            <p>{product?.description}</p>
          </div>

          <button onClick={submitReviewToggle} className="submitReview">
            Submit Review
          </button>
        </div>
      </div>

      <Dialog open={open} onClose={submitReviewToggle}>
        <DialogTitle>Submit Review</DialogTitle>

        <DialogContent className="submitDialog">
          <Rating
            size="large"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
          />

          <textarea
            rows="5"
            className="submitDialogTextArea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={submitReviewToggle}>Cancel</Button>
          <Button onClick={reviewSubmitHandler}>Submit</Button>
        </DialogActions>
      </Dialog>

      <h3 className="reviewsHeading">REVIEWS</h3>

      {product?.reviews?.length > 0 ? (
        <div className="reviews">
          {product.reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              user={user}
              onRemove={handleRemoveReview}
            />
          ))}
        </div>
      ) : (
        <p className="noReviews">No Reviews Yet</p>
      )}
    </div>
  );
};

export default ProductDetails;
