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
import { toast } from "react-toastify";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, loading } = useSelector((state) => state.user);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

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

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/account";

  // LOGIN SUBMIT
  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        loginUser({
          email: loginEmail,
          password: loginPassword,
        }),
      ).unwrap();

      toast.success("Login Successful");
      navigate(redirect);
    } catch (err) {
      toast.error(err);
    }
  };

  // REGISTER SUBMIT
  const registerSubmit = async (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.append("name", name);
    myForm.append("email", email);
    myForm.append("password", password);
    myForm.append("avatar", avatar);

    try {
      await dispatch(registerUser(myForm)).unwrap();

      toast.success("Registration Successful");
      navigate(redirect);
    } catch (err) {
      toast.error(err);
    }
  };

  // REGISTER DATA CHANGE
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];

      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  // TAB SWITCH
  const switchTabs = (tab) => {
    if (tab === "login") {
      switcherTab.current.style.transform = "translateX(0)";
      loginTab.current.style.display = "flex";
      registerTab.current.style.display = "none";
    } else {
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
            {/* TOGGLE */}
            <div className="login_signUp_toggle">
              <p onClick={() => switchTabs("login")}>LOGIN</p>
              <p onClick={() => switchTabs("register")}>REGISTER</p>
            </div>

            <div className="switchBar">
              <div ref={switcherTab}></div>
            </div>

            {/* LOGIN FORM */}
            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
              <div className="inputBox">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="inputBox">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              <Link to="/password/forgot">Forgot Password?</Link>

              <button className="loginBtn" disabled={loading}>
                Login
              </button>
            </form>

            {/* REGISTER FORM */}
            <form
              className="signUpForm"
              ref={registerTab}
              encType="multipart/form-data"
              onSubmit={registerSubmit}
              style={{ display: "none" }}
            >
              <div className="inputBox">
                <FaceIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                />
              </div>

              <div className="inputBox">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                />
              </div>

              <div className="inputBox">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  minLength="6"
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                />
              </div>

              <div className="avatarUpload">
                <img src={avatarPreview} alt="Avatar Preview" />

                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={registerDataChange}
                />
              </div>

              <button className="signUpBtn" disabled={loading}>
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
