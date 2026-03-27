import React, { useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllProducts,
} from "../../features/product/productSlice";
import { useParams } from "react-router-dom";
import ProductCard from "../Home/ProductCard";
import Pagination from "@mui/material/Pagination";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Products = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const { keyword } = useParams();
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const { products, loading, error, filteredProductsCount, resultPerPage } =
    useSelector((state) => state.product);

  useEffect(() => {
    dispatch(
      getAllProducts({
        keyword: keyword || "",
        currentPage,
        category,
        sort,
      }),
    );
  }, [dispatch, keyword, currentPage, category, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const categories = [
    "All",
    "Smartphone",
    "Television",
    "Refrigerator",
    "Washing Machine",
    "Laptop",
  ];

  return (
    <div className="productsPage">
      <div className="premiumHeader">
        <h1>Find Your Perfect Product</h1>
      </div>

      <div className="topBar">
        <div className="categoryBar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={
                category === cat || (cat === "All" && category === "")
                  ? "active"
                  : ""
              }
              onClick={() => {
                setCategory(cat === "All" ? "" : cat);
                setCurrentPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sortBox">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Sort</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="products">
        {loading ? (
          <div className="skeletonGrid">
            {Array(8)
              .fill()
              .map((_, i) => (
                <div key={i} className="skeletonCard"></div>
              ))}
          </div>
        ) : products?.length > 0 ? (
          products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <p>No Products Found</p>
        )}
      </div>

      {(filteredProductsCount || 0) > resultPerPage && (
        <div className="paginationBox">
          <Pagination
            count={Math.ceil((filteredProductsCount || 0) / resultPerPage)}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
          />
        </div>
      )}
    </div>
  );
};

export default Products;
