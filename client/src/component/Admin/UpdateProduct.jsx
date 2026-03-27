import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  clearErrors,
  getProductDetails,
  updateProduct,
  resetUpdateProduct,
} from "../../features/product/productSlice";

import { Button } from "@mui/material";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StorageIcon from "@mui/icons-material/Storage";

import Loader from "../layout/Loader/Loader";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import "./newProduct.css";
const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { product, error, loading, isUpdated } = useSelector(
    (state) => state.product,
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Smartphone",
    "Laptop",
    "Television",
    "Refrigerator",
    "Washing Machine",
  ];

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.originalPrice || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setStock(product.stock || "");
      setOldImages(product.images || []);
    }
  }, [product]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isUpdated) {
      toast.success("Product Updated Successfully");

      const timer = setTimeout(() => {
        navigate("/admin/products");
        dispatch(resetUpdateProduct());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isUpdated, navigate, dispatch]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.set("name", name);
    formData.set("originalPrice", price);
    formData.set("description", description);
    formData.set("category", category);
    formData.set("stock", stock);

    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(updateProduct({ id, productData: formData }));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((prev) => [...prev, reader.result]);
          setImages((prev) => [...prev, file]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* LEFT SIDE */}
            <div className="newProductContainer">
              <form
                className="createProductForm"
                encType="multipart/form-data"
                onSubmit={updateProductSubmitHandler}
              >
                <h1>Update Product</h1>

                <div>
                  <SpellcheckIcon />
                  <input
                    type="text"
                    placeholder="Product Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <AttachMoneyIcon />
                  <input
                    type="number"
                    placeholder="Original Price"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <DescriptionIcon />
                  <textarea
                    placeholder="Product Description"
                    rows="2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <AccountTreeIcon />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Choose Category</option>
                    {categories.map((cate) => (
                      <option key={cate} value={cate}>
                        {cate}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <StorageIcon />
                  <input
                    type="number"
                    placeholder="Stock"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div id="createProductFormFile">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={updateProductImagesChange}
                  />
                </div>

                <h3>Old Images</h3>
                <div id="createProductFormImage">
                  {oldImages.map((image, index) => (
                    <img key={index} src={image.url} alt="Old Preview" />
                  ))}
                </div>

                <h3>New Images</h3>
                <div id="createProductFormImage">
                  {imagesPreview.map((image, index) => (
                    <img key={index} src={image} alt="Preview" />
                  ))}
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Update
                </Button>
              </form>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default UpdateProduct;
