import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import "./List.css";
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
      minWidth: 230,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) =>
        params.row.role === "admin" ? "greenColor" : "redColor",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
          <Link to={`/admin/user/${params.row.id}`}>
            <EditIcon />
          </Link>

          <Button
            color="error"
            onClick={() => deleteUserHandler(params.row.id)}
          >
            <DeleteIcon />
          </Button>
        </div>
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
      <Sidebar />
      <div className="dashboardContent">
        <Typography className="dashboardHeading">ALL USERS</Typography>
        <div className="tableWrapper">
          {loading ? (
            <Loader />
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.id}
              pageSizeOptions={[10, 20, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              autoHeight
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
