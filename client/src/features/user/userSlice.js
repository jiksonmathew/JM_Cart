import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

const initialState = {
  loading: false,
  user: null,
  selectedUser: null,
  users: [],
  isAuthenticated: false,
  isUpdated: false,
  isChecked: false,
  isDeleted: false,
  message: null,
  error: null,
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, thunkAPI) => {
    try {
      const { data } = await api.post(`/register`, userData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (loginData, thunkAPI) => {
    try {
      const { data } = await api.post(`/login`, loginData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`/logout`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const { data } = await api.post(`/password/forgot`, { email });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send reset email",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, passwords }, thunkAPI) => {
    try {
      const { data } = await api.put(`/password/reset/${token}`, passwords);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Password reset failed",
      );
    }
  },
);

export const getUserDetails = createAsyncThunk(
  "user/getUserDetails",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/me");
      return data.user;
    } catch (error) {
      if (error.response?.status === 401) return null;

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData, thunkAPI) => {
    try {
      const { data } = await api.put(`/password/update`, passwordData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Password update failed",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      const { data } = await api.put(`/me/update`, profileData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile update failed",
      );
    }
  },
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`/admin/users`);
      return data.users;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

export const getSingleUser = createAsyncThunk(
  "user/getSingleUser",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/admin/user/${id}`);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ id, userData }, thunkAPI) => {
    try {
      const { data } = await api.put(`/admin/user/${id}`, userData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update user",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.delete(`/admin/user/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete user",
      );
    }
  },
);

export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async ({ id, role }, thunkAPI) => {
    try {
      const { data } = await api.put(`/admin/user/${id}`, { role });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update role",
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

    resetUpdateUser: (state) => {
      state.isUpdated = false;
    },

    resetDeleteUser: (state) => {
      state.isDeleted = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isChecked = true;
      })
      .addCase(getUserDetails.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isChecked = true;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isUpdated = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })

      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = true;
        state.message = action.payload.message;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isDeleted = true;
        state.message = action.payload.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = true;
        state.message = action.payload.message;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = true;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = true;
        state.message = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, resetUpdateUser, resetDeleteUser } =
  userSlice.actions;

export default userSlice.reducer;
