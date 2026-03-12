const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("Not authorized, please login", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("User no longer exists", 401));
  }

  next();
});

exports.isAdmin = catchAsyncError(async (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  return next(new ErrorHandler("Access denied: Admins only", 403));
});
