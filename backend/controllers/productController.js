const Product = require("../models/productModel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.createProduct = catchAsyncError(async (req, res, next) => {
  const imagesLinks = [];

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      imagesLinks.push({
        public_id: file.filename,
        url: file.path,
      });
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 15;

  const productCount = await Product.countDocuments();

  const baseQuery = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort();

  const filteredProductsCount = await baseQuery.query.clone().countDocuments();

  const paginatedQuery = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .pagination(resultPerPage);

  let products = await paginatedQuery.query;

  const now = new Date();

  products = products.map((product) => {
    let activeOffer = product.offer;
    let percentage = 0;
    let title = "";
    let startDate = null;
    let endDate = null;

    if (
      activeOffer &&
      activeOffer.startDate <= now &&
      activeOffer.endDate >= now
    ) {
      percentage = activeOffer.percentage;
      title = activeOffer.title;
      startDate = activeOffer.startDate;
      endDate = activeOffer.endDate;
    } else {
      percentage = product.fallbackOfferPercentage ?? 0;
      title = "Regular Offer";
    }

    const finalPrice = Math.round(
      product.originalPrice * (1 - percentage / 100),
    );

    return {
      ...product._doc,
      price: finalPrice,
      offer: {
        percentage,
        title,
        startDate: product.offer.startDate,
        endDate,
      },
    };
  });

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
});

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const now = new Date();

  let percentage = 0;
  let title = "";
  let endDate = null;

  if (
    product.offer &&
    product.offer.startDate <= now &&
    product.offer.endDate >= now
  ) {
    percentage = product.offer.percentage;
    title = product.offer.title;
    startDate = product.offer?.startDate;
    endDate = product.offer.endDate;
  } else {
    percentage = product.fallbackOfferPercentage || 0;
    title = "Regular Offer";
  }

  const finalPrice = Math.round(product.originalPrice * (1 - percentage / 100));

  const updatedProduct = {
    ...product._doc,
    price: finalPrice,
    offer: {
      percentage,
      title,
      startDate: product.offer?.startDate,
      endDate,
    },
  };

  res.status(200).json({
    success: true,
    product: updatedProduct,
  });
});

exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let imagesLinks = product.images ? [...product.images] : [];

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      imagesLinks.push({
        public_id: file.filename,
        url: file.path,
      });
    });
  }

  req.body.images = imagesLinks;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new ErrorHandler("Rating must be between 1 and 5", 400));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString(),
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = Number(rating);
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
  }

  product.numOfReviews = product.reviews.length;

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings =
    product.reviews.length === 0 ? 0 : avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const { productId, id: reviewId } = req.query;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const review = product.reviews.find(
    (rev) => rev._id.toString() === reviewId.toString(),
  );

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  const isOwner = review.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(
      new ErrorHandler("You are not authorized to delete this review", 403),
    );
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId.toString(),
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = reviews.length === 0 ? 0 : avg / reviews.length;

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      ratings,
      numOfReviews: reviews.length,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
  });
});

exports.getFeaturedProducts = async (req, res) => {
  try {
    let products = await Product.aggregate([{ $sample: { size: 20 } }]);

    const now = new Date();

    products = products.map((product) => {
      let percentage = 0;
      let title = "";
      let endDate = null;

      if (
        product.offer &&
        product.offer.startDate <= now &&
        product.offer.endDate >= now
      ) {
        percentage = product.offer.percentage;
        title = product.offer.title;
        startDate = product.offer?.startDate;
        endDate = product.offer.endDate;
      } else {
        percentage = product.fallbackOfferPercentage || 0;
        title = "Regular Offer";
      }

      const finalPrice = Math.round(
        product.originalPrice * (1 - percentage / 100),
      );

      return {
        ...(product._doc || product),
        price: finalPrice,
        offer: { percentage, title, endDate },
      };
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProductOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      offerPercentage,
      offerTitle,
      startDate,
      endDate,
      fallbackOfferPercentage,
      originalPrice,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.originalPrice = originalPrice;

    product.offer = {
      percentage: offerPercentage,
      title: offerTitle,
      startDate,
      endDate,
    };

    product.fallbackOfferPercentage = fallbackOfferPercentage;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
