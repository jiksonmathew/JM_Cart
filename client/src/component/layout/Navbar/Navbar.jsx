import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { toggleAdminMode } from "../../../features/mode/adminModeSlice";
import SearchIcon from "@mui/icons-material/Search";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import UserOptions from "../Header/UserOptions";
import logo from "../../../images/jm_cart.png";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { adminMode } = useSelector((state) => state.adminMode);

  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const handleModeToggle = () => {
    dispatch(toggleAdminMode());
    navigate(adminMode ? "/" : "/admin/dashboard");
  };

  const handleLoginClick = () => {
    navigate(isAuthenticated ? "/account" : "/login");
  };

  const searchHandler = () => {
    navigate(keyword.trim() ? `/products/${keyword}` : "/products");
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <header className={`topbar ${isAdmin && adminMode ? "admin-mode" : ""}`}>
      <div className="left">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>

        {isAdmin && (
          <div className="toggleWrapper" onClick={handleModeToggle}>
            <div className={`toggleSwitch ${adminMode ? "active" : ""}`}>
              <div className="toggleCircle"></div>
            </div>
            <span className="toggleLabel">{adminMode ? "ADMIN" : "SHOP"}</span>
          </div>
        )}
      </div>

      {!(isAdmin && adminMode) && (
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
      )}

      <div className="nav-links">
        {isAdmin && adminMode ? (
          <>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/users">Users</Link>
          </>
        ) : (
          <>
            <Link to="/products">Products</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </>
        )}
      </div>

      <div className="menuIcon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`mobileMenu ${menuOpen ? "active" : ""}`}>
        {isAdmin && adminMode ? (
          <>
            <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/admin/products" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            <Link to="/admin/orders" onClick={() => setMenuOpen(false)}>
              Orders
            </Link>
            <Link to="/admin/users" onClick={() => setMenuOpen(false)}>
              Users
            </Link>
          </>
        ) : (
          <>
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
          </>
        )}
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
