import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const token = localStorage.getItem("token");

const initialState = {
  user: null,
  users: [],
  userDetails: {},
  loading: false,
  adminLoading: false,
  error: null,
  message: null,
  isAuthenticated: !!token,
  isUpdated: false,
  isDeleted: false,
};

//
// REGISTER
//
export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/register", formData);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

//
// LOGIN
//
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/login", userData);

      localStorage.setItem("token", data.token);

      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

//
// LOAD USER
//
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/me");
      return data.user;
    } catch (error) {
      localStorage.removeItem("token");

      return rejectWithValue(
        error.response?.data?.message || "Failed to load user",
      );
    }
  },
);

//
// LOGOUT
//
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.get("/logout");
      localStorage.removeItem("token");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

//
// UPDATE PROFILE
//
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/me/update", formData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed",
      );
    }
  },
);

//
// UPDATE PASSWORD
//
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/password/update", passwordData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password update failed",
      );
    }
  },
);

//
// FORGOT PASSWORD
//
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/password/forgot", { email });
      return data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset email",
      );
    }
  },
);

//
// RESET PASSWORD
//
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, passwordData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/password/reset/${token}`, passwordData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed",
      );
    }
  },
);

//
// ADMIN - GET ALL USERS
//
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/users");
      return data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

//
// ADMIN - GET USER DETAILS
//
export const getUserDetails = createAsyncThunk(
  "admin/getUserDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/user/${id}`);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user details",
      );
    }
  },
);

//
// ADMIN - UPDATE USER
//
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/user/${id}`, formData);
      return data.success;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "User update failed",
      );
    }
  },
);

//
// ADMIN - DELETE USER
//
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/user/${id}`);
      return data.success;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "User deletion failed",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },

    resetUpdate: (state) => {
      state.isUpdated = false;
    },

    resetUpdateUser: (state) => {
      state.isUpdated = false;
    },

    resetDeleteUser: (state) => {
      state.isDeleted = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      // LOGIN
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      // LOAD USER
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdated = action.payload.success;
        state.user = action.payload.user;
      })

      // UPDATE PASSWORD
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isUpdated = action.payload.success;
        state.message = action.payload.message;
      })

      // ADMIN USERS
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.users = action.payload;
      })

      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
      })

      .addCase(updateUser.fulfilled, (state) => {
        state.adminLoading = false;
        state.isUpdated = true;
      })

      .addCase(deleteUser.fulfilled, (state) => {
        state.isDeleted = true;
      })

      // GLOBAL USER PENDING
      .addMatcher(
        (action) =>
          action.type.startsWith("user/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      // GLOBAL ADMIN PENDING
      .addMatcher(
        (action) =>
          action.type.startsWith("admin/") && action.type.endsWith("/pending"),
        (state) => {
          state.adminLoading = true;
          state.error = null;
        },
      )

      // GLOBAL REJECTED
      .addMatcher(
        (action) =>
          (action.type.startsWith("user/") ||
            action.type.startsWith("admin/")) &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.adminLoading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearErrors, resetUpdate, resetUpdateUser, resetDeleteUser } =
  userSlice.actions;

export default userSlice.reducer;
