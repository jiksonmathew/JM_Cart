import React, { Fragment, useState } from "react";
import "./UserOptions.css";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Backdrop from "@mui/material/Backdrop";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { createPortal } from "react-dom";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logoutUser as logoutUserAction } from "../../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const UserOptions = ({ user }) => {
  const { cartItems = [] } = useSelector((state) => state.cart);
  const { adminMode } = useSelector((state) => state.adminMode);

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logoutUserAction());

    dispatch({ type: "SET_MODE", payload: false });
    localStorage.removeItem("adminMode");

    toast.success("Logout Successfully");
    navigate("/");
  };

  if (user?.role === "admin" && adminMode) {
    return (
      <div className="adminProfileWrapper">
        <img
          src={user?.avatar?.url || "/Profile.png"}
          alt="Admin"
          className="adminProfile"
          onDoubleClick={logoutHandler}
          title="Double click to logout"
        />
      </div>
    );
  }

  const options = [
    {
      icon: <ListAltIcon />,
      name: "Orders",
      func: () => navigate("/orders"),
    },
    {
      icon: <PersonIcon />,
      name: "Profile",
      func: () => navigate("/account"),
    },
    {
      icon: (
        <ShoppingCartIcon
          sx={{ color: cartItems.length > 0 ? "tomato" : "inherit" }}
        />
      ),
      name: `Cart (${cartItems.length})`,
      func: () => navigate("/cart"),
    },
    {
      icon: <ExitToAppIcon />,
      name: "Logout",
      func: logoutHandler,
    },
  ];

  if (user?.role === "admin" && !adminMode) {
  }

  return createPortal(
    <Fragment>
      <Backdrop open={open} sx={{ zIndex: 1300 }} />

      <SpeedDial
        ariaLabel="User Options"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        direction="down"
        className="speedDial"
        sx={{ zIndex: 1400 }}
        icon={
          <img
            className="speedDialIcon"
            src={user?.avatar?.url || "/Profile.png"}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            tooltipOpen={window.innerWidth <= 600}
            onClick={() => {
              setOpen(false);
              item.func();
            }}
          />
        ))}
      </SpeedDial>
    </Fragment>,
    document.body,
  );
};

export default UserOptions;
