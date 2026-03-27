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
  getFeaturedProducts,
  updateProductOffer,
} = require("../controllers/productController");

const upload = require("../middlewares/upload");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/product/:id", getProductDetails);
router.get("/products/featured", getFeaturedProducts);

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
  .put(isAuthenticated, isAdmin, upload.array("images", 5), updateProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct);

router.put(
  "/admin/product/:id/offer",
  isAuthenticated,
  isAdmin,
  updateProductOffer,
);

router.post("/review", isAuthenticated, createProductReview);

router
  .route("/reviews")
  .get(isAuthenticated, getProductReviews)
  .delete(isAuthenticated, deleteReview);

router.delete("/admin/review", isAuthenticated, isAdmin, deleteReview);

module.exports = router;
