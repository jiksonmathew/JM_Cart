import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

/* Swiper */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* MUI */
import Rating from "@mui/material/Rating";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

/* Toast */
import { toast } from "react-toastify";

/* Components */
import Loader from "../layout/Loader/Loader";
import ReviewCard from "./ReviewCard";

/* Redux */
import {
  fetchProductDetails,
  clearErrors,
} from "../../features/product/productSlice";

import { addToCart } from "../../features/cart/cartSlice";

/* CSS */
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    productDetails: product,
    loading,
    error,
  } = useSelector((state) => state.product);

  const { isAuthenticated } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  /* Quantity Controls */

  const increaseQuantity = () => {
    if (quantity >= product?.stock) return;
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };

  /* Add To Cart */

  const addToCartHandler = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: product._id, // ✅ FIXED
          quantity,
        }),
      ).unwrap();

      toast.success("Item Added To Cart");
    } catch (err) {
      toast.error(err || "Failed to add item to cart");
      console.error(err);
    }
  };

  /* Review Dialog */

  const submitReviewToggle = () => {
    setOpen((prev) => !prev);
  };

  /* Fetch Product */

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(fetchProductDetails(id));
  }, [dispatch, id, error]);

  const ratingOptions = {
    size: "large",
    value: product?.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="ProductDetails">
        {/* PRODUCT IMAGE SLIDER */}

        <div>
          {product?.images?.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              slidesPerView={1}
            >
              {product.images.map((img) => (
                <SwiperSlide key={img.url}>
                  <img src={img.url} alt="Product" className="CarouselImage" />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* PRODUCT INFO */}

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
              {/* QUANTITY */}

              <div className="detailsBlock-3-1-1">
                <button onClick={decreaseQuantity} disabled={quantity <= 1}>
                  -
                </button>

                <input type="number" readOnly value={quantity} />

                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product?.stock}
                >
                  +
                </button>
              </div>

              {/* ADD TO CART */}

              <button disabled={product?.stock < 1} onClick={addToCartHandler}>
                {product?.stock < 1 ? "Out Of Stock" : "Add to Cart"}
              </button>
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

      {/* REVIEW DIALOG */}

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
          <Button onClick={submitReviewToggle}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* REVIEWS */}

      <h3 className="reviewsHeading">REVIEWS</h3>

      {product?.reviews?.length > 0 ? (
        <div className="reviews">
          {product.reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <p className="noReviews">No Reviews Yet</p>
      )}
    </>
  );
};

export default ProductDetails;
