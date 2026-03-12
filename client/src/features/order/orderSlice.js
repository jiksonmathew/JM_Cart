import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const initialState = {
  shippingInfo: {},
  orders: [],
  orderDetails: {},
  loading: false,
  error: null,
  success: false,
  isDeleted: false,
  isUpdated: false,
};

//
// CREATE ORDER
//
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/order/new", order);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

//
// GET MY ORDERS
//
export const myOrders = createAsyncThunk(
  "order/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/orders/me");
      return data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

//
// GET ORDER DETAILS
//
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/order/${id}`);
      return data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details",
      );
    }
  },
);

//
// ADMIN - GET ALL ORDERS
//
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/orders");
      return data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all orders",
      );
    }
  },
);

//
// ADMIN - UPDATE ORDER
//
export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/order/${id}`, formData);
      return data.success;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order",
      );
    }
  },
);

//
// ADMIN - DELETE ORDER
//
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/order/${id}`);
      return data.success;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,

  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },

    resetOrderFlags: (state) => {
      state.success = false;
      state.isDeleted = false;
      state.isUpdated = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------- CREATE ORDER ----------------
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;

        if (action.payload.order) {
          state.orders.push(action.payload.order);
        }
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- MY ORDERS ----------------
      .addCase(myOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(myOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(myOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- ORDER DETAILS ----------------
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })

      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- ADMIN GET ALL ORDERS ----------------
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- UPDATE ORDER ----------------
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateOrder.fulfilled, (state) => {
        state.loading = false;
        state.isUpdated = true;
      })

      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- DELETE ORDER ----------------
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteOrder.fulfilled, (state) => {
        state.loading = false;
        state.isDeleted = true;
      })

      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, resetOrderFlags } = orderSlice.actions;

export default orderSlice.reducer;
