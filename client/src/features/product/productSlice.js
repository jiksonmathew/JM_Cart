import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const initialState = {
  loading: false,
  products: [],
  featuredProducts: [],
  product: null,
  reviews: [],
  productCount: 0,
  resultPerPage: 0,
  filteredProductsCount: 0,
  message: null,
  error: null,
  isDeleted: false,
  isUpdated: false,
  reviewDeleted: false,
};

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, thunkAPI) => {
    try {
      const { data } = await api.post("/admin/product/new", productData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create product",
      );
    }
  },
);

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (
    {
      keyword = "",
      currentPage = 1,
      price = [0, 100000],
      category,
      ratings = 0,
      sort,
    },
    thunkAPI,
  ) => {
    try {
      let link = `/products?keyword=${keyword}&page=${currentPage}&originalPrice[gte]=${price[0]}&originalPrice[lte]=${price[1]}&ratings[gte]=${ratings}`;
      if (category && category !== "All") {
        link += `&category=${category}`;
      }
      if (sort) link += `&sort=${sort}`;
      const { data } = await api.get(link);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const getFeaturedProducts = createAsyncThunk(
  "products/featured",
  async () => {
    const { data } = await api.get("/products/featured");
    return data.products;
  },
);

export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/product/${id}`);
      return data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);

export const getAdminProducts = createAsyncThunk(
  "product/getAdminProducts",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/admin/products");
      return data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin products",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, productData }, thunkAPI) => {
    try {
      const { data } = await api.put(`/admin/product/${id}`, productData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.delete(`/admin/product/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

export const createProductReview = createAsyncThunk(
  "product/createProductReview",
  async (reviewData, thunkAPI) => {
    try {
      const { data } = await api.post("/review", reviewData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to submit review",
      );
    }
  },
);

export const getProductReviews = createAsyncThunk(
  "product/getProductReviews",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/reviews?id=${id}`);
      return data.reviews;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews",
      );
    }
  },
);

export const deleteReview = createAsyncThunk(
  "product/deleteReview",
  async ({ reviewId, productId }, thunkAPI) => {
    try {
      const { data } = await api.delete(
        `/reviews?id=${reviewId}&productId=${productId}`,
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
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

    resetDeleteProduct: (state) => {
      state.isDeleted = false;
    },

    resetProduct: (state) => {
      state.product = null;
      state.message = null;
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

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
        state.message = action.payload.message;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.filteredProductsCount = action.payload.filteredProductsCount;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = true;
        state.message = action.payload.message;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = true;
        state.message = action.payload.message;
      })

      .addCase(createProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewDeleted = true;
        state.message = action.payload.message;
      });
  },
});

export const {
  clearErrors,
  resetProduct,
  resetDeleteProduct,
  resetUpdateProduct,
  resetDeleteReview,
} = productSlice.actions;

export default productSlice.reducer;
