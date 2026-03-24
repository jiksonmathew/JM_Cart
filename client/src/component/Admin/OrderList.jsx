import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import "./List.css";
import {
  deleteOrder,
  resetDeleteOrder,
  getAllOrders,
  clearErrors,
} from "../../features/order/orderSlice";

const OrderList = () => {
  const dispatch = useDispatch();

  const {
    orders = [],
    error,
    loading,
    isDeleted,
  } = useSelector((state) => state.order);

  const deleteOrderHandler = (id) => {
    if (window.confirm("Delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Order Deleted");
      dispatch(resetDeleteOrder());
      dispatch(getAllOrders());
    }

    dispatch(getAllOrders());
  }, [dispatch, error, isDeleted]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 230,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      minWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      flex: 1,
      align: "left",
      headerAlign: "center",
      cellClassName: (params) => {
        if (params.row.status === "Delivered") return "greenColor";
        if (params.row.status === "Shipped") return "orangeColor";
        return "redColor";
      },
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
          <Link to={`/admin/order/${params.row.id}`}>
            <EditIcon style={{ color: "#1976d2" }} />
          </Link>

          <Button
            onClick={() => deleteOrderHandler(params.row.id)}
            style={{ minWidth: "auto", padding: "4px" }}
          >
            <DeleteIcon style={{ color: "#d32f2f" }} />
          </Button>
        </div>
      ),
    },
  ];

  const rows = orders.map((order) => ({
    id: order._id,
    itemsQty:
      order.orderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    amount: order.totalPrice,
    status: order.orderStatus,
  }));

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContent">
        <Typography className="dashboardHeading">ALL ORDERS</Typography>
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
              disableRowSelectionOnClick
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
