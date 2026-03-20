import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

import { useSelector } from "react-redux";

import SearchIcon from "@mui/icons-material/Search";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

import UserOptions from "../Header/UserOptions";
import logo from "../../../images/jm_cart.png";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/account");
    }
  };

  const searchHandler = () => {
    navigate(keyword.trim() ? `/products/${keyword}` : "/products");
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <header className="topbar">
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchHandler()}
        />
        <button onClick={searchHandler}>
          <SearchIcon />
        </button>
      </div>

      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="menuIcon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`mobileMenu ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>
          Products
        </Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>
          About
        </Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          Contact
        </Link>
      </div>

      <div className="right">
        {isAuthenticated ? (
          <UserOptions user={user} />
        ) : (
          <LockRoundedIcon
            className="icon"
            onClick={handleLoginClick}
            titleAccess="Login"
          />
        )}
      </div>
    </header>
  );
}
