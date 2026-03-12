const jwt = require("jsonwebtoken");

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000,
});

exports.generateToken = (res, id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const cookieOptions = getCookieOptions();

  if (isNaN(cookieOptions.maxAge)) {
    throw new Error("COOKIE_EXPIRE must be a number");
  }

  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  res.cookie("token", token, cookieOptions);

  return token;
};

exports.clearAuthToken = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
};
