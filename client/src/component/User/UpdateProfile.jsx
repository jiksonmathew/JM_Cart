import React, { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";

import Loader from "../layout/Loader/Loader";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FaceIcon from "@mui/icons-material/Face";

import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  clearErrors,
  getUserDetails,
  resetUpdateUser,
} from "../../features/user/userSlice";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, isUpdated } = useSelector(
    (state) => state.user,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const updateProfileSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required");
      return;
    }

    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("email", email);

    if (avatar) myForm.append("avatar", avatar);

    dispatch(updateProfile(myForm));
  };

  const updateProfileDataChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!user) {
      dispatch(getUserDetails());
    } else {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user?.avatar?.url || "/Profile.png");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(resetUpdateUser());
      navigate("/account");
    }
  }, [user, error, isUpdated]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <div className="updateProfileContainer">
        <div className="updateProfileBox">
          <h2 className="updateProfileHeading">Update Profile</h2>

          <form
            className="updateProfileForm"
            encType="multipart/form-data"
            onSubmit={updateProfileSubmit}
          >
            <div className="inputField">
              <FaceIcon />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="inputField">
              <MailOutlineIcon />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div id="updateProfileImage">
              <img src={avatarPreview} alt="preview" />

              <input
                type="file"
                accept="image/*"
                onChange={updateProfileDataChange}
              />
            </div>

            <button
              type="submit"
              className="updateProfileBtn"
              disabled={loading}
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProfile;
