import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  clearErrors,
  updateProduct,
  fetchProductDetails,
  resetUpdateProduct,
} from "../../features/product/productSlice";

import { Button } from "@mui/material";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StorageIcon from "@mui/icons-material/Storage";

import SideBar from "./Sidebar";
import toast from "react-hot-toast";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { product, error, loading, isUpdated } = useSelector(
    (state) => state.product,
  );

  const { error: updateError } = useSelector((state) => state.product);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);

  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

  useEffect(() => {
    if (!product || product._id !== id) {
      dispatch(fetchProductDetails(id));
    } else {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setStock(product.stock);
      setOldImages(product.images);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Product Updated Successfully");
      navigate("/admin/products");
      dispatch(resetUpdateProduct());
    }
  }, [dispatch, error, updateError, isUpdated, product, id, navigate]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.set("name", name);
    formData.set("price", price);
    formData.set("description", description);
    formData.set("category", category);
    formData.set("stock", stock);

    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(updateProduct({ id, formData }));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagesPreview((prev) => [...prev, reader.result]);
        setImages((prev) => [...prev, file]); // store real file
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="dashboard">
      <SideBar />

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
              placeholder="Price"
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

          {/* Upload Images */}
          <div id="createProductFormFile">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={updateProductImagesChange}
            />
          </div>

          {/* Old Images */}
          <h3>Old Images</h3>
          <div id="createProductFormImage">
            {oldImages?.map((image, index) => (
              <img key={index} src={image.url} alt="Old Preview" />
            ))}
          </div>

          {/* New Images */}
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
    </div>
  );
};

export default UpdateProduct;
