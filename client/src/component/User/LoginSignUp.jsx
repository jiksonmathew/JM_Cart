import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  loginUser,
  registerUser,
} from "../../features/user/userSlice";
import toast from "react-hot-toast";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.user);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/account";

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(
        loginUser({
          email: loginEmail,
          password: loginPassword,
        }),
      ).unwrap();

      toast.success("Login Successful");

      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(redirect);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const registerSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await dispatch(registerUser(formData)).unwrap();

      toast.success("Registration Successful");

      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/account");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];

      if (file) {
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
      }
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const switchTabs = (tab) => {
    if (tab === "login") {
      switcherTab.current.style.transform = "translateX(0)";
      loginTab.current.style.display = "flex";
      registerTab.current.style.display = "none";
    }

    if (tab === "register") {
      switcherTab.current.style.transform = "translateX(100%)";
      loginTab.current.style.display = "none";
      registerTab.current.style.display = "flex";
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="LoginSignUpContainer">
          <div className="LoginSignUpBox">
            <div className="login_signUp_toggle">
              <p onClick={() => switchTabs("login")}>LOGIN</p>
              <p onClick={() => switchTabs("register")}>REGISTER</p>
            </div>

            <div className="switchBar">
              <div ref={switcherTab}></div>
            </div>

            <form
              className="loginForm"
              ref={loginTab}
              onSubmit={loginSubmit}
              autoComplete="off"
            >
              <div className="inputBox">
                <MailOutlineIcon />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="inputBox">
                <LockOpenIcon />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              <Link to="/password/forgot">Forgot Password?</Link>

              <button className="loginBtn" type="submit">
                Login
              </button>
            </form>

            <form
              className="signUpForm"
              ref={registerTab}
              encType="multipart/form-data"
              onSubmit={registerSubmit}
              style={{ display: "none" }}
              autoComplete="off"
            >
              <div className="inputBox">
                <FaceIcon />
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={registerDataChange}
                />
              </div>

              <div className="inputBox">
                <MailOutlineIcon />
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={registerDataChange}
                />
              </div>

              <div className="inputBox">
                <LockOpenIcon />
                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  value={password}
                  onChange={registerDataChange}
                />
              </div>

              <div className="avatarUpload">
                <img src={avatarPreview} alt="preview" />

                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={registerDataChange}
                />
              </div>

              <button type="submit" className="signUpBtn">
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
