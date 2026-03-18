import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import SideBar from "./Sidebar";
import toast from "react-hot-toast";

import {
  deleteOrder,
  resetDeleteOrder,
  getAllOrders,
  clearErrors,
} from "../../features/order/orderSlice";

const OrderList = () => {
  const dispatch = useDispatch();

  const { orders = [], error, isDeleted } = useSelector((state) => state.order);

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
      minWidth: 120,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.5,
      cellClassName: (params) => {
        if (params.row.status === "Delivered") return "greenColor";
        if (params.row.status === "Shipped") return "orangeColor";
        return "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      minWidth: 100,
      flex: 0.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 130,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
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
      <SideBar />

      <div className="dashboardContainer">
        <Typography variant="h5" sx={{ mb: 2 }}>
          ALL ORDERS
        </Typography>

        <div className="orderListTable">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            autoHeight
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
};

export default OrderList;
