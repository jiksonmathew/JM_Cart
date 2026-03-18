import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import "./Profile.css";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isChecked, isAuthenticated } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    if (!isChecked) return;

    if (!isAuthenticated) {
      toast.error("Please login to access your profile");
      navigate("/login");
    }
  }, [isChecked, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getUserDetails());
    }
  }, [isAuthenticated, user, dispatch]);

  if (!isChecked) return <Loader />;
  if (isAuthenticated && !user) return <Loader />;

  return (
    <div className="profileContainer">
      <div className="profileLeft">
        <h1>My Profile</h1>

        <img
          src={user?.avatar?.url || "/Profile.png"}
          alt={user?.name || "User Avatar"}
        />

        <Link to="/me/update">Edit Profile</Link>
      </div>

      <div className="profileRight">
        <div className="profileInfo">
          <h4>Full Name</h4>
          <p>{user?.name}</p>
        </div>

        <div className="profileInfo">
          <h4>Email</h4>
          <p>{user?.email}</p>
        </div>

        <div className="profileInfo">
          <h4>Joined On</h4>
          <p>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : ""}
          </p>
        </div>

        <div className="profileActions">
          <Link to="/orders">My Orders</Link>
          <Link to="/password/update">Change Password</Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
