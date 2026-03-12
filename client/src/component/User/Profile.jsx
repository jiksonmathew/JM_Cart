import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import "./Profile.css";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  if (loading) return <Loader />;

  return (
    <div className="profileContainer">
      {/* LEFT SIDE */}

      <div className="profileLeft">
        <h1>My Profile</h1>

        <img src={user?.avatar?.url || "/Profile.png"} alt={user?.name} />

        <Link to="/me/update">Edit Profile</Link>
      </div>

      {/* RIGHT SIDE */}

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
          <p>{user?.createdAt?.substring(0, 10)}</p>
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
