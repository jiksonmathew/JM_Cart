import { useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

import "./Home.css";
import ProductCard from "./ProductCard";
import Loader from "../layout/Loader/Loader";

import {
  fetchProducts,
  clearErrors,
} from "../../features/product/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const keyword = new URLSearchParams(location.search).get("keyword") || "";

  const {
    loading,
    error,
    products = [],
  } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts(keyword));
  }, [dispatch, keyword]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  if (loading) return <Loader />;

  return (
    <>
      <section className="banner">
        <p>Welcome to Ecommerce</p>

        <h1>Find Amazing Products Below</h1>

        <a href="#products">
          <button>
            Scroll <CgMouse />
          </button>
        </a>
      </section>

      <h2 className="homeHeading">
        {keyword ? `Search Results for "${keyword}"` : "Featured Products"}
      </h2>

      <section className="container" id="products">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="noProducts">No products found.</p>
        )}
      </section>
    </>
  );
};

export default Home;
