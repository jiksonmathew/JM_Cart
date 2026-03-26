import { useEffect, useState } from "react";

import { DataGrid } from "@mui/x-data-grid";

import "./productReviews.css";

import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProductReviews,
  deleteReview,
  resetDeleteReview,
} from "../../features/product/productSlice";

import { Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

const ProductReviews = () => {
  const dispatch = useDispatch();

  const {
    error,
    reviews = [],
    loading,
    reviewDeleted,
  } = useSelector((state) => state.product);

  const [productId, setProductId] = useState("");

  const deleteReviewHandler = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview({ reviewId, productId }));
    }
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();

    if (productId.length !== 24) {
      toast.error("Invalid Product ID");
      return;
    }

    dispatch(getProductReviews(productId));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (reviewDeleted) {
      toast.success("Review Deleted Successfully");
      dispatch(resetDeleteReview());
      dispatch(getProductReviews(productId));
    }
  }, [dispatch, error, reviewDeleted, productId]);

  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      minWidth: 200,
      flex: 0.5,
    },
    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 0.6,
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 150,
      flex: 0.4,
      cellClassName: (params) =>
        params.row.rating >= 3 ? "greenColor" : "redColor",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          color="error"
          onClick={() => deleteReviewHandler(params.row.id)}
        >
          <DeleteIcon />
        </Button>
      ),
    },
  ];

  const rows = (reviews || []).map((item) => ({
    id: item._id,
    rating: item.rating,
    comment: item.comment,
    user: item.name,
  }));

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="productReviewsContainer">
        <form
          className="productReviewsForm"
          onSubmit={productReviewsSubmitHandler}
        >
          <Typography className="productReviewsFormHeading">
            ALL REVIEWS
          </Typography>

          <div>
            <StarIcon />

            <input
              type="text"
              placeholder="Product Id"
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <Button
            id="createProductBtn"
            type="submit"
            variant="contained"
            disabled={loading || productId === ""}
          >
            Search
          </Button>
        </form>

        {reviews.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            autoHeight
          />
        ) : (
          <Typography className="productReviewsFormHeading">
            No Reviews Found
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
