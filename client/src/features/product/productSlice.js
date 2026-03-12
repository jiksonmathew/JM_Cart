import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const initialState = {
  products: [],
  productDetails: {},
  reviews: [],
  productCount: 0,
  resultPerPage: 0,
  filteredProductsCount: 0,
  loading: false,
  error: null,
  success: false,
  isDeleted: false,
  isUpdated: false,
  reviewDeleted: false,
};

//
// GET PRODUCTS
//
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const {
        keyword = "",
        currentPage = 1,
        price = [0, 100000],
        category = "",
        ratings = 0,
      } = params || {};

      let link = `/products?keyword=${keyword}&page=${currentPage}`;
      link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;

      if (category) link += `&category=${category}`;
      if (ratings > 0) link += `&ratings[gte]=${ratings}`;

      const { data } = await api.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

//
// ADMIN PRODUCTS
//
export const getAdminProduct = createAsyncThunk(
  "product/getAdminProduct",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/products");
      return data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin products",
      );
    }
  },
);

//
// PRODUCT DETAILS
//
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/product/${id}`);
      return data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details",
      );
    }
  },
);

// Alias
export const fetchProductDetails = getProductDetails;

//
// CREATE PRODUCT
//
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/admin/product/new", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product",
      );
    }
  },
);

//
// UPDATE PRODUCT
//
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/product/${id}`, formData);
      return data.success;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);

//
// DELETE PRODUCT
//
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/product/${id}`);
      return data.success;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

//
// GET ALL REVIEWS
//
export const getAllReviews = createAsyncThunk(
  "product/getAllReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reviews?id=${productId}`);
      return data.reviews;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews",
      );
    }
  },
);

//
// DELETE REVIEW
//
export const deleteReviews = createAsyncThunk(
  "product/deleteReview",
  async ({ reviewId, productId }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(
        `/reviews?id=${reviewId}&productId=${productId}`,
      );
      return data.success;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,

  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },

    resetFlags: (state) => {
      state.success = false;
      state.isDeleted = false;
      state.isUpdated = false;
    },

    resetUpdateProduct: (state) => {
      state.isUpdated = false;
    },

    resetDeleteReview: (state) => {
      state.reviewDeleted = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH PRODUCTS
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        state.products = action.payload.products || [];
        state.productCount = action.payload.productCount || 0;
        state.resultPerPage = action.payload.resultPerPage || 0;
        state.filteredProductsCount = action.payload.filteredProductsCount || 0;
      })

      // ADMIN PRODUCTS
      .addCase(getAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
      })

      // PRODUCT DETAILS
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload || {};
      })

      // CREATE PRODUCT
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.success || false;
      })

      // UPDATE PRODUCT
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true;
      })

      // DELETE PRODUCT
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.isDeleted = true;
      })

      // GET REVIEWS
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload || [];
      })

      // DELETE REVIEW
      .addCase(deleteReviews.fulfilled, (state) => {
        state.loading = false;
        state.reviewDeleted = true;
      })

      // GLOBAL PENDING
      .addMatcher(
        (action) =>
          action.type.startsWith("product/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      // GLOBAL REJECTED
      .addMatcher(
        (action) =>
          action.type.startsWith("product/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const {
  clearErrors,
  resetFlags,
  resetUpdateProduct,
  resetDeleteReview,
} = productSlice.actions;

export default productSlice.reducer;
