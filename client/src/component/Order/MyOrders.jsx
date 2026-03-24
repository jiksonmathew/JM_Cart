import React, { Fragment, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import "./myOrders.css";

import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getMyOrders } from "../../features/order/orderSlice";

import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";
import LaunchIcon from "@mui/icons-material/Launch";

import toast from "react-hot-toast";

const MyOrders = () => {
  const dispatch = useDispatch();

  const { loading, error, orders = [] } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 300,
      flex: 1,
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,

      cellClassName: (params) =>
        params.row.status === "Delivered"
          ? "greenColor"
          : params.row.status === "Shipped"
            ? "orangeColor"
            : "redColor",
    },

    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },

    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.3,
      sortable: false,

      renderCell: (params) => (
        <Link to={`/order/${params.row.id}`}>
          <LaunchIcon />
        </Link>
      ),
    },
  ];

  const rows = orders.map((item) => ({
    id: item._id,
    itemsQty: item.orderItems.length,
    status: item.orderStatus,
    amount: item.totalPrice,
  }));

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <Typography id="myOrdersHeading">{user?.name}'s Orders</Typography>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
            className="myOrdersTable"
            autoHeight
          />
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
