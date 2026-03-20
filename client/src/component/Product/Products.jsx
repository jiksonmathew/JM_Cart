import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllProducts,
} from "../../features/product/productSlice";
import ProductCard from "../Home/ProductCard";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import toast from "react-hot-toast";
import { useParams, useSearchParams } from "react-router-dom";

const categories = [
  "Smartphone",
  "Laptop",
  "Washing Machine",
  "Refrigerator",
  "Television",
  "Shirts",
  "Pants",
  "Footwear",
];

const priceRanges = [
  { label: "All", value: [0, 100000] },
  { label: "Under ₹1,000", value: [0, 1000] },
  { label: "₹1,000 - ₹5,000", value: [1000, 5000] },
  { label: "₹5,000 - ₹10,000", value: [5000, 10000] },
  { label: "₹10,000 - ₹50,000", value: [10000, 50000] },
  { label: "Above ₹50,000", value: [50000, 100000] },
];

const ProductSkeleton = () => {
  return (
    <div className="productCard">
      <Skeleton variant="rectangular" height={180} />
      <Skeleton variant="text" height={25} />
      <Skeleton variant="text" width="60%" />
    </div>
  );
};

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

  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const {
    products,
    loading,
    error,
    productCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.product);

  useEffect(() => {
    const params = {};

    if (currentPage !== 1) params.page = currentPage;
    if (ratings > 0) params.ratings = ratings;
    if (price[0] !== 0) params.minPrice = price[0];
    if (price[1] !== 100000) params.maxPrice = price[1];
    if (category) params.category = category;
    if (sort) params.sort = sort;

    setSearchParams(params);
  }, [currentPage, category, ratings, price, sort]);

  useEffect(() => {
    dispatch(
      getAllProducts({
        keyword: keyword || "",
        currentPage,
        price,
        category,
        ratings,
        sort,
      }),
    );
  }, [dispatch, keyword, currentPage, price, category, ratings, sort]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const setCurrentPageNo = (_, value) => {
    setCurrentPage(value);
  };

  const clearFilters = () => {
    setPrice([0, 100000]);
    setCategory("");
    setRatings(0);
    setSort("");
    setCurrentPage(1);
    setSearchParams({});
  };

  const count = filteredProductsCount ?? productCount;

  return (
    <Fragment>
      <h2 className="productsHeading">Products</h2>

      <div className="productsPage">
        <div className="filterBox">
          <div className="sortBar">
            <Typography>Sort By:</Typography>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating_desc">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="filterItem">
            <Typography>Price</Typography>
            {priceRanges.map((range) => (
              <div
                key={range.label}
                className={`filterOption ${
                  price[0] === range.value[0] && price[1] === range.value[1]
                    ? "activeCategory"
                    : ""
                }`}
                onClick={() => {
                  setPrice(range.value);
                  setCurrentPage(1);
                }}
              >
                {range.label}
              </div>
            ))}
          </div>

          <div className="filterItem">
            <Typography>Categories</Typography>
            {categories.map((cat) => (
              <label key={cat} className="checkboxItem">
                <input
                  type="radio"
                  name="category"
                  checked={category === cat}
                  onChange={() => {
                    setCategory(cat);
                    setCurrentPage(1);
                  }}
                />
                {cat}
              </label>
            ))}
          </div>

          <div className="filterItem">
            <Typography>Ratings</Typography>
            <select
              value={ratings}
              onChange={(e) => {
                setRatings(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={0}>All</option>
              <option value={4}>4★ & above</option>
              <option value={3}>3★ & above</option>
              <option value={2}>2★ & above</option>
            </select>
          </div>

          {(category ||
            ratings > 0 ||
            price[0] !== 0 ||
            price[1] !== 100000) && (
            <button className="clearFiltersBtn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
        <div className="productBox">
          <div className="products">
            {loading ? (
              [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No Products Found</p>
            )}

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
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Products;
