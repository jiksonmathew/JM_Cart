const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Please enter product original price"],
      max: [99999999, "Price cannot exceed 8 digits"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],
    category: {
      type: String,
      required: [true, "Please enter product category"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      max: [9999, "Stock cannot exceed 4 digits"],
      default: 1,
    },

    offer: {
      percentage: {
        type: Number,
        default: 0,
      },
      title: {
        type: String,
        default: "",
      },
      startDate: Date,
      endDate: Date,
    },

    fallbackOfferPercentage: {
      type: Number,
      default: 5,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
