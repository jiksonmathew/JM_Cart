import { useEffect, useState } from "react";
import "./newProduct.css";

import { useSelector, useDispatch } from "react-redux";
import {
  createProduct,
  clearErrors,
  resetProduct,
} from "../../features/product/productSlice";

import { Button, Typography } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

const categories = [
  "Smartphone",
  "Laptop",
  "Television",
  "Refrigerator",
  "Washing Machine",
];

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, product } = useSelector(
    (state) => state.product,
  );

  const [form, setForm] = useState({
    name: "",
    originalPrice: "",
    description: "",
    category: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (product) {
      toast.success(message || "Product created successfully");
      dispatch(resetProduct());
      navigate("/admin/dashboard");
    }
  }, [dispatch, error, product, message, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const myForm = new FormData();

    myForm.set("name", form.name);
    myForm.set("originalPrice", form.originalPrice);
    myForm.set("description", form.description);
    myForm.set("category", form.category);
    myForm.set("stock", form.stock);

    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(createProduct(myForm));
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="newProductContainer">
        <form
          className="createProductForm"
          onSubmit={submitHandler}
          encType="multipart/form-data"
          autoComplete="off"
        >
          <Typography variant="h4">Create Product</Typography>

          <div>
            <SpellcheckIcon />
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <AttachMoneyIcon />
            <input
              type="number"
              name="originalPrice"
              placeholder="Price"
              required
              value={form.originalPrice}
              onChange={handleChange}
            />
          </div>

          <div>
            <DescriptionIcon />
            <textarea
              name="description"
              placeholder="Product Description"
              rows="2"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <AccountTreeIcon />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Choose Category</option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <StorageIcon />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              required
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <div id="createProductFormFile">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
            />
          </div>

          <div id="createProductFormImage">
            {imagesPreview.map((img, i) => (
              <img key={i} src={img} alt="Preview" />
            ))}
          </div>

          <Button
            id="createProductBtn"
            type="submit"
            variant="contained"
            disabled={loading}
          >
            Create Product
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;
