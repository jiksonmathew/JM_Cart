import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const initialState = {
  loading: false,
  cartItems: [],
  shippingInfo: {},
  message: null,
  error: null,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.post(`/cart`, cartData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add item",
      );
    }
  },
);

export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`/cart`);
      return data.cartItems;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.delete(`/cart/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove item",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },

    clearCart: (state) => {
      state.cartItems = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.cartItems;
        state.message = action.payload.message;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.cartItems = action.payload.cartItems;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { saveShippingInfo, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
