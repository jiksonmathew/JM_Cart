import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "./AdminOffer.css";
import api from "../../app/api";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TitleIcon from "@mui/icons-material/Title";
import PercentIcon from "@mui/icons-material/Percent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  getAdminProducts,
  getAllProducts,
  getFeaturedProducts,
} from "../../features/product/productSlice";
import Sidebar from "./Sidebar";

const AdminOffer = () => {
  const dispatch = useDispatch();
  const { product, error } = useSelector((state) => state.product);
  const { id } = useParams();

  const [form, setForm] = useState({
    originalPrice: "",
    offerPercentage: "",
    offerTitle: "",
    startDate: null,
    endDate: null,
    fallbackOfferPercentage: "",
  });

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  // ✅ Convert ISO → datetime-local format
  const formatDateTimeLocal = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (product) {
      setForm({
        originalPrice: product.originalPrice || "",
        offerPercentage: product.offer?.percentage || "",
        offerTitle: product.offer?.title || "",
        startDate: formatDateTimeLocal(product.offer?.startDate),
        endDate: formatDateTimeLocal(product.offer?.endDate),
        fallbackOfferPercentage: product.fallbackOfferPercentage || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Convert datetime-local → ISO before sending
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        startDate: form.startDate
          ? new Date(form.startDate).toISOString()
          : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      };

      await api.put(`/admin/product/${id}/offer`, payload);

      toast.success("Offer Updated 🚀");

      dispatch(getProductDetails(id));
      dispatch(getAdminProducts());
      dispatch(getAllProducts());
      dispatch(getFeaturedProducts());
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error updating offer");
    }
  };

  return (
    <div className="offerContainer">
      <Sidebar />
      <form onSubmit={submitHandler} className="adminOfferForm">
        <h2>Update Offer</h2>

        <div className="inputGroup">
          <AttachMoneyIcon />
          <input name="originalPrice" value={form.originalPrice} disabled />
        </div>

        <div className="inputGroup">
          <PercentIcon />
          <input
            name="offerPercentage"
            value={form.offerPercentage}
            placeholder="Offer %"
            onChange={handleChange}
          />
        </div>

        <div className="inputGroup">
          <TitleIcon />
          <input
            name="offerTitle"
            value={form.offerTitle}
            placeholder="Offer Title"
            onChange={handleChange}
          />
        </div>

        <div className="inputGroup">
          <DatePicker
            selected={form.startDate}
            onChange={(date) => setForm({ ...form, startDate: date })}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Select Start Date"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        <div className="inputGroup">
          <DatePicker
            selected={form.endDate}
            onChange={(date) => setForm({ ...form, endDate: date })}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Select End Date"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        <div className="inputGroup">
          <LocalOfferIcon />
          <input
            name="fallbackOfferPercentage"
            value={form.fallbackOfferPercentage}
            placeholder="Fallback %"
            onChange={handleChange}
          />
        </div>

        <button type="submit">Update Offer</button>
      </form>
      {product?.offer && (
        <div className="currentOfferBox">
          <h3>Current Offer</h3>

          <p>
            <strong>Product:</strong> {product.name}
          </p>

          <p>
            <strong>Sale:</strong> {product.offer.title || "No Offer"}
          </p>

          <p>
            <strong>Discount:</strong> {product.offer.percentage || 0}%
          </p>

          <p>
            <strong>Offer Price:</strong> ₹
            {product.originalPrice && product.offer.percentage
              ? (
                  product.originalPrice -
                  (product.originalPrice * product.offer.percentage) / 100
                ).toFixed(2)
              : product.originalPrice}
          </p>

          <p>
            <strong>Start:</strong>{" "}
            {product.offer.startDate
              ? new Date(product.offer.startDate).toLocaleString()
              : "—"}
          </p>

          <p>
            <strong>End:</strong>{" "}
            {product.offer.endDate
              ? new Date(product.offer.endDate).toLocaleString()
              : "—"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {product.offer.endDate &&
            new Date(product.offer.endDate) > new Date()
              ? "🟢 Active"
              : "🔴 Expired"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOffer;
