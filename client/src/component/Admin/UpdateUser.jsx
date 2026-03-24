import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSingleUser,
  updateUserProfile,
  clearErrors,
  resetUpdateUser,
} from "../../features/user/userSlice";
import { Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import toast from "react-hot-toast";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, selectedUser, isUpdated } = useSelector(
    (state) => state.user,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    dispatch(getSingleUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name || "");
      setEmail(selectedUser.email || "");
      setRole(selectedUser.role || "");
    }
  }, [selectedUser]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isUpdated) {
      toast.success("User Updated Successfully");

      const timer = setTimeout(() => {
        navigate("/admin/users");
        dispatch(resetUpdateUser());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isUpdated, navigate, dispatch]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    dispatch(
      updateUserProfile({
        id,
        userData: {
          name,
          email,
          role,
        },
      }),
    );
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="newProductContainer">
        {loading && <Loader />}

        <form className="createProductForm" onSubmit={updateUserSubmitHandler}>
          <h1>Update User</h1>

          <div>
            <PersonIcon />
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <MailOutlineIcon />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <VerifiedUserIcon />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Choose Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <Button
            id="createProductBtn"
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
