const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserProfile,
  updateUserRole,
  deleteUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const router = express.Router();

// Auth
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Password
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// User
router.get("/me", isAuthenticated, getUserDetails);
router.put("/password/update", isAuthenticated, updatePassword);
router.put(
  "/me/update",
  isAuthenticated,
  upload.single("avatar"),
  updateProfile,
);

// Admin
router.get("/admin/users", isAuthenticated, isAdmin, getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticated, isAdmin, getSingleUser)
  .put(isAuthenticated, isAdmin, updateUserProfile)
  .delete(isAuthenticated, isAdmin, deleteUser);

module.exports = router;
