import { useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import "./productList.css";

import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
  resetDeleteProduct,
} from "../../features/product/productSlice";

import { Link } from "react-router-dom";

import { Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import SideBar from "./Sidebar";
import toast from "react-hot-toast";

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
      minWidth: 250,
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 200,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <Link to={`/admin/product/${params.row.id}`}>
            <EditIcon />
          </Link>

          <Button
            color="error"
            onClick={() => deleteProductHandler(params.row.id)}
          >
            <DeleteIcon />
          </Button>
        </>
      ),
    },
  ];

  const rows = products.map((item) => ({
    id: item._id,
    stock: item.stock,
    price: item.price,
    name: item.name,
  }));

  return (
    <div className="dashboard">
      <SideBar />

      <div className="productListContainer">
        <Typography id="productListHeading">ALL PRODUCTS</Typography>

        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          autoHeight
        />
      </div>
    </div>
  );
};

export default ProductList;
