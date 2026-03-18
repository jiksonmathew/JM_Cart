import { useEffect } from "react";

import { CgMouse } from "react-icons/cg";

import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  clearErrors,
} from "../../features/product/productSlice";

import { useLocation } from "react-router-dom";

import toast from "react-hot-toast";

import "./Home.css";
import Loader from "../layout/Loader/Loader";
import FeaturedProducts from "./FeaturedProducts";

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const keyword = new URLSearchParams(location.search).get("keyword") || "";

  const { loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProducts({ keyword }));
  }, [dispatch, keyword]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  return (
    <>
      <section className="banner">
        <button>
          {" "}
          <a href="#products" className="shop-btn">
            Shop Now
          </a>
        </button>
      </section>

      <h2 className="homeHeading" id="products">
        {keyword ? `Search Results for "${keyword}"` : "Featured Products"}
      </h2>

      {loading && <Loader />}

      <FeaturedProducts />
    </>
  );
};

export default Home;
