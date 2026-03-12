import React, { useState, useEffect } from "react";
import "./ForgotPassword.css";

import Loader from "../layout/Loader/Loader";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearErrors } from "../../features/user/userSlice";

import toast from "react-hot-toast";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const { error, message, loading } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
    }
  }, [dispatch, error, message]);

  if (loading) return <Loader />;

  return (
    <div className="forgotPasswordContainer">
      <div className="forgotPasswordBox">
        <h2 className="forgotPasswordHeading">Forgot Password</h2>

        <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit}>
          <div className="forgotPasswordEmail">
            <MailOutlineIcon />

            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="forgotPasswordBtn"
            disabled={loading}
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
