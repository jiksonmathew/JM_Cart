import React, { useState, useEffect } from "react";
import "./ResetPassword.css";

import Loader from "../layout/Loader/Loader";

import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  resetPassword,
  resetUpdateUser,
} from "../../features/user/userSlice";

import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { error, loading, isUpdated } = useSelector((state) => state.user);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(
      resetPassword({
        token,
        passwords: {
          password,
          confirmPassword,
        },
      }),
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Password updated successfully");
      dispatch(resetUpdateUser());
      navigate("/login");
    }
  }, [error, isUpdated]);

  if (loading) return <Loader />;

  return (
    <div className="resetPasswordContainer">
      <div className="resetPasswordBox">
        <h2 className="resetPasswordHeading">Reset Password</h2>

        <form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
          <div className="passwordInput">
            <LockOpenIcon />

            <input
              type="password"
              placeholder="New Password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="passwordInput">
            <LockIcon />

            <input
              type="password"
              placeholder="Confirm Password"
              required
              minLength="6"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="resetPasswordBtn" disabled={loading}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
