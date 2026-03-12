import React, { useEffect, useMemo } from "react";
import "./myOrders.css";

import { useSelector, useDispatch } from "react-redux";
import { myOrders, clearErrors } from "../../features/order/orderSlice";

import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Typography from "@mui/material/Typography";
import LaunchIcon from "@mui/icons-material/Launch";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const MyOrders = () => {
  const dispatch = useDispatch();

  const { loading, error, orders, success } = useSelector(
    (state) => state.order,
  );
  const { user } = useSelector((state) => state.user);

  const columnDefs = [
    {
      headerName: "Order ID",
      field: "id",
      flex: 1,
      minWidth: 260,
    },
    {
      headerName: "Status",
      field: "status",
      flex: 0.5,
      minWidth: 150,
      cellClass: (params) =>
        params.value === "Delivered" ? "greenColor" : "redColor",
    },
    {
      headerName: "Items",
      field: "itemsQty",
      flex: 0.4,
      minWidth: 120,
    },
    {
      headerName: "Amount",
      field: "amount",
      flex: 0.5,
      minWidth: 160,
    },
    {
      headerName: "Action",
      field: "actions",
      flex: 0.3,
      minWidth: 120,
      cellRenderer: (params) => (
        <Link to={`/order/${params.data.id}`}>
          <LaunchIcon />
        </Link>
      ),
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  };

  const rowData = useMemo(() => {
    return (
      orders?.map((item) => ({
        id: item._id,
        status: item.orderStatus,
        itemsQty: item.orderItems.reduce((acc, item) => acc + item.quantity, 0),

        amount: `₹${item.totalPrice}`,
      })) || []
    );
  }, [orders]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
  }, [dispatch, error, success]);

  return loading ? (
    <Loader />
  ) : (
    <div className="myOrdersPage">
      <Typography id="myOrdersHeading">{user?.name}'s Orders</Typography>

      <div className="ordersGrid ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
        />
      </div>
    </div>
  );
};

export default MyOrders;
