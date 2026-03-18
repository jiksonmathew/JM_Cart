import React, { useState, useEffect } from "react";
import "./UpdatePassword.css";

import Loader from "../layout/Loader/Loader";

import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  updatePassword,
  resetUpdateUser,
} from "../../features/user/userSlice";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isUpdated } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { oldPassword, newPassword, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(
      updatePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      }),
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (!loading && isUpdated) {
      toast.success("Password updated successfully");
      dispatch(resetUpdateUser());
      navigate("/account");
    }
  }, [error, isUpdated, loading]);

  if (loading) return <Loader />;

  return (
    <div className="updatePasswordContainer">
      <div className="updatePasswordBox">
        <h2 className="updatePasswordHeading">Update Password</h2>

        <form className="updatePasswordForm" onSubmit={updatePasswordSubmit}>
          <div className="passwordInput">
            <VpnKeyIcon />

            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={oldPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="passwordInput">
            <LockOpenIcon />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              minLength="6"
              value={newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="passwordInput">
            <LockIcon />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              minLength="6"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="updatePasswordBtn"
            disabled={loading}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
