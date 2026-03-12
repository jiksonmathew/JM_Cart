import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();

    const query = keyword.trim();

    if (query) {
      navigate(`/products/${query}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <div className="searchPage">
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;
