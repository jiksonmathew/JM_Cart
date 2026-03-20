const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  let error = err;

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    error = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, try again`;
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: message.join(", "),
    });
  }

  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal server error";

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};
