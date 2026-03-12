import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CloseIcon from "@mui/icons-material/Close";

import logo from "../../../images/jm_cart.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleClose = () => setIsOpen(false);

  const handleCartClick = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning("Please login first");
      navigate("/login");
      return;
    }

    navigate("/cart");
  };

  const handleLoginClick = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    navigate("/account");
  };

  return (
    <>
      {/* MENU BUTTON */}
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <CloseIcon sx={{ fontSize: 38, color: "#cf3a2c" }} />
        ) : (
          <MenuIcon sx={{ fontSize: 38, color: "#382828" }} />
        )}
      </button>

      {/* NAV OVERLAY */}
      <nav className={`nav-overlay ${isOpen ? "active" : ""}`}>
        <div className="nav-content">
          {/* LOGO */}
          <Link to="/" onClick={handleClose}>
            <img src={logo} alt="Logo" />
          </Link>

          {/* NAV LINKS */}
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link to={item.path} onClick={handleClose}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* ICONS */}
          <div className="nav-icons">
            <Link to="/search" onClick={handleClose}>
              <SearchIcon />
            </Link>

            <Link
              to="/cart"
              onClick={(e) => {
                handleCartClick(e);
                handleClose();
              }}
            >
              <LocalMallIcon />
            </Link>

            <Link
              to="/login"
              onClick={(e) => {
                handleLoginClick(e);
                handleClose();
              }}
            >
              <AccountBoxIcon />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
