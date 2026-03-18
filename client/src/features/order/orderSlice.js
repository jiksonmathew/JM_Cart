import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const initialState = {
  loading: false,
  order: null,
  orders: [],
  message: null,
  error: null,
  isCreated: false,
  isUpdated: false,
  isDeleted: false,
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const { data } = await api.post("/order/new", orderData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const getSingleOrder = createAsyncThunk(
  "order/getSingleOrder",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/order/${id}`);
      return data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/orders/me");
      return data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/admin/orders");
      return data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, orderData }, thunkAPI) => {
    try {
      const { data } = await api.put(`/admin/order/${id}`, orderData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.delete(`/admin/order/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong",
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

    resetDeleteOrder: (state) => {
      state.isDeleted = false;
    },

    resetOrderFlags: (state) => {
      state.isCreated = false;
      state.isUpdated = false;
      state.isDeleted = false;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.isCreated = true;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSingleOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = true;
        state.message = action.payload.message;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = true;
        state.message = action.payload.message;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, resetOrderFlags, resetDeleteOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
