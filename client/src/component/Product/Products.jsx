import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";

import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  fetchProducts,
} from "../../features/product/productSlice";

import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";

import Pagination from "@mui/material/Pagination";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import { toast } from "react-toastify";
import { useParams, useSearchParams } from "react-router-dom";

const categories = [
  "Smartphone",
  "Laptop",
  "Television",
  "Refrigerator",
  "Washing Machine",
  "Shirts",
  "Pants",
  "Footwear",
];

const Products = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  const [price, setPrice] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 100000,
  ]);

  const [category, setCategory] = useState(searchParams.get("category") || "");

  const [ratings, setRatings] = useState(
    Number(searchParams.get("ratings")) || 0,
  );

  const {
    products,
    loading,
    error,
    productCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.product);

  // Reset page when keyword changes
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  // Update URL params
  useEffect(() => {
    const params = {};

    if (currentPage > 1) params.page = currentPage;
    if (category) params.category = category;
    if (ratings > 0) params.ratings = ratings;
    if (price[0] !== 0) params.minPrice = price[0];
    if (price[1] !== 100000) params.maxPrice = price[1];

    setSearchParams(params);
  }, [currentPage, category, ratings, price, setSearchParams]);

  // Fetch products
  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword: keyword || "",
        currentPage,
        price,
        category,
        ratings,
      }),
    );
  }, [dispatch, keyword, currentPage, price, category, ratings]);

  // Error handler
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const setCurrentPageNo = (event, value) => {
    setCurrentPage(value);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
    setCurrentPage(1);
  };

  const categoryHandler = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const ratingsHandler = (event, newRating) => {
    setRatings(newRating);
    setCurrentPage(1);
  };

  const count = filteredProductsCount ?? productCount;

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="productsHeading">Products</h2>

          <div className="productsPage">
            {/* Filters */}
            <div className="filterBox">
              <Typography>Price</Typography>
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                min={0}
                max={100000}
              />

              <Typography>Categories</Typography>
              <ul className="categoryBox">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={`category-link ${
                      category === cat ? "activeCategory" : ""
                    }`}
                    onClick={() => categoryHandler(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>

              <fieldset>
                <Typography component="legend">Ratings Above</Typography>

                <Slider
                  value={ratings}
                  onChange={ratingsHandler}
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                />
              </fieldset>
            </div>

            {/* Product List */}
            <div className="products">
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>
          </div>

          {/* Pagination */}
          {count > resultPerPage && (
            <div className="paginationBox">
              <Pagination
                count={Math.ceil(count / resultPerPage)}
                page={currentPage}
                onChange={setCurrentPageNo}
                color="primary"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
