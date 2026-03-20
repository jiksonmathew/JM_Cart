import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturedProducts } from "../../features/product/productSlice";
import Loader from "../layout/Loader/Loader";
import ProductCard from "./ProductCard";
import "./FeaturedProducts.css";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);

  const { featuredProducts, featuredLoading, error } = useSelector(
    (state) => state.product,
  );

  useEffect(() => {
    if (!featuredProducts || featuredProducts.length === 0) {
      dispatch(getFeaturedProducts());
    }
  }, [dispatch, featuredProducts]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;

    setIsLeftVisible(el.scrollLeft > 0);
    setIsRightVisible(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;

      const el = scrollRef.current;

      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="featuredProducts">
      {isLeftVisible && (
        <button className="scrollBtn left" onClick={scrollLeft}>
          &#8249;
        </button>
      )}

      <div className="products" ref={scrollRef}>
        {featuredLoading && <Loader />}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!featuredLoading &&
          featuredProducts &&
          featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>

      {isRightVisible && (
        <button className="scrollBtn right" onClick={scrollRight}>
          &#8250;
        </button>
      )}
    </div>
  );
};

export default FeaturedProducts;
