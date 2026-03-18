import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./Search.css";

import toast from "react-hot-toast";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();

    const query = keyword.trim();

    if (!query) {
      toast.error("Please enter a product name");
      return;
    }

    navigate(`/products/${query}`);
  };

  return (
    <div className="searchPage">
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          autoFocus
        />

        <button type="submit" disabled={!keyword.trim()}>
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;
