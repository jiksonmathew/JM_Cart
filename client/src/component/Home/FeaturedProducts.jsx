import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getFeaturedProducts } from "../../features/product/productSlice";

import ProductCard from "./ProductCard";

import "./FeaturedProducts.css";
const FeaturedProducts = () => {
  const dispatch = useDispatch();

  const { featuredProducts, featuredLoading, error } = useSelector(
    (state) => state.product,
  );

  useEffect(() => {
    if (!featuredProducts || featuredProducts.length === 0) {
      dispatch(getFeaturedProducts());
    }
  }, [dispatch, featuredProducts]);

  return (
    <div className="featuredProducts">
      <div className="products">
        {featuredLoading && <p>Loading featured products...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!featuredLoading &&
          featuredProducts &&
          featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
