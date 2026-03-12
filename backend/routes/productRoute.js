const express = require("express");
const {
  getAllProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const upload = require("../middlewares/upload");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const router = express.Router();

// Public Routes
router.get("/products", getAllProducts);
router.get("/product/:id", getProductDetails);

// Admin Routes
router.post(
  "/admin/product/new",
  isAuthenticated,
  isAdmin,
  upload.array("images", 5),
  createProduct,
);
router.get("/admin/products", isAuthenticated, isAdmin, getAdminProducts);

router
  .route("/admin/product/:id")
  .get(isAuthenticated, isAdmin, getProductDetails)
  .put(isAuthenticated, isAdmin, updateProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct);

// Review Routes
router.post("/review", isAuthenticated, createProductReview);

router
  .route("/reviews")
  .get(isAuthenticated, getProductReviews)
  .delete(isAuthenticated, deleteReview);

// Optional: Admin delete any review
router.delete("/admin/review", isAuthenticated, isAdmin, deleteReview);

module.exports = router;
