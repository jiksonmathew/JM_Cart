import { useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import "./productList.css";

import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import SideBar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import toast from "react-hot-toast";

import {
  getAllUsers,
  deleteUser,
  clearErrors,
  resetDeleteUser,
} from "../../features/user/userSlice";

const UsersList = () => {
  const dispatch = useDispatch();

  const {
    users = [],
    loading,
    error,
    isDeleted,
    message,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success(message);
      dispatch(resetDeleteUser());
      dispatch(getAllUsers());
    }
  }, [dispatch, error, isDeleted, message]);

  const deleteUserHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: 220,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 0.6,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      flex: 0.4,
      cellClassName: (params) =>
        params.row.role === "admin" ? "greenColor" : "redColor",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => (
        <>
          <Link to={`/admin/user/${params.row.id}`}>
            <EditIcon />
          </Link>

          <Button
            color="error"
            onClick={() => deleteUserHandler(params.row.id)}
          >
            <DeleteIcon />
          </Button>
        </>
      ),
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  return (
    <div className="dashboard">
      <SideBar />

      <div className="productListContainer">
        <h1 id="productListHeading">ALL USERS</h1>

        {loading ? (
          <Loader />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[20, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 20 } },
            }}
            autoHeight
          />
        )}
      </div>
    </div>
  );
};

export default UsersList;
