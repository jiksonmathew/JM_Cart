import React, { Fragment, useState } from "react";
import "./Header.css";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Backdrop from "@mui/material/Backdrop";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logoutUser as logoutUserAction } from "../../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const UserOptions = ({ user }) => {
  const { cartItems = [] } = useSelector((state) => state.cart);

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logoutUserAction());
    toast.success("Logout Successfully");
  };

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

  if (user?.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: () => navigate("/admin/dashboard"),
    });
  }

  return (
    <Fragment>
      <Backdrop open={open} sx={{ zIndex: 10 }} />

      <SpeedDial
        ariaLabel="User Options"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        direction="down"
        className="speedDial"
        sx={{ zIndex: 11 }}
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
    </Fragment>
  );
};

export default UserOptions;
