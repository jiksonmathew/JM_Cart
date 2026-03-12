import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const initialState = {
  cartItems: [],
  shippingInfo: {},
  loading: false,
  error: null,
};

//
// GET USER CART
//
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/cart");
      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

//
// ADD TO CART
//
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/cart", {
        productId,
        quantity,
      });

      return data.cartItem;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item",
      );
    }
  },
);

//
// REMOVE CART ITEM
//
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartId, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/${cartId}`);
      return cartId;
    } catch (error) {
      return rejectWithValue(
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

    clearCartErrors: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------- GET CART ----------------
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })

      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- ADD TO CART ----------------
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;

        const item = action.payload;

        const existItem = state.cartItems.find(
          (i) => i.product._id === item.product._id,
        );

        if (existItem) {
          existItem.quantity = item.quantity;
        } else {
          state.cartItems.push(item);
        }
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- REMOVE FROM CART ----------------
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;

        state.cartItems = state.cartItems.filter(
          (item) => item._id !== action.payload,
        );
      })

      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { saveShippingInfo, clearCart, clearCartErrors } =
  cartSlice.actions;

export default cartSlice.reducer;
