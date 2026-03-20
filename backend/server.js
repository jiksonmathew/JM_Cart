require("dotenv").config({ path: "./backend/.env" });

const app = require("./app");
const connectDB = require("./config/database");
const cloudinary = require("cloudinary");

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.stack || err.message);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

(async () => {
  try {
    await connectDB();

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION:", err.stack || err.message);
      console.log(
        "Shutting down the server due to unhandled promise rejection",
      );

      server.close(() => {
        process.exit(1);
      });
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully.");
      server.close(() => {
        console.log("Process terminated.");
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received. Shutting down gracefully.");
      server.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
})();
