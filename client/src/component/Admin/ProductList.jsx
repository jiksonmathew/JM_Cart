import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import "./List.css";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
  resetDeleteProduct,
} from "../../features/product/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();

  const {
    error,
    products = [],
    isDeleted,
    loading,
  } = useSelector((state) => state.product);

  const deleteProductHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Product Deleted Successfully");
      dispatch(resetDeleteProduct());
    }

    dispatch(getAdminProducts());
  }, [dispatch, error, isDeleted]);

  const columns = [
    {
      field: "id",
      headerName: "Product ID",
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
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "originalPrice",
      headerName: "M.R.P",
      type: "number",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
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
        <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
          <Link to={`/admin/product/${params.row.id}`}>
            <EditIcon />
          </Link>
          <Link to={`/admin/product/${params.row.id}/offer`}>
            <LocalOfferIcon fontSize="small" style={{ color: "orange" }} />
          </Link>
          <Button
            color="error"
            onClick={() => deleteProductHandler(params.row.id)}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
  ];

  const rows = products.map((item) => ({
    id: item._id,
    stock: item.stock,
    originalPrice: item.originalPrice,
    name: item.name,
  }));

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContent">
        <Typography className="dashboardHeading">ALL PRODUCTS</Typography>
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

export default ProductList;
