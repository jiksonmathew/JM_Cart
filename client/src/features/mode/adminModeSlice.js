import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminMode: localStorage.getItem("adminMode") === "true",
};

const adminModeSlice = createSlice({
  name: "adminMode",
  initialState,
  reducers: {
    toggleAdminMode: (state) => {
      state.adminMode = !state.adminMode;
      localStorage.setItem("adminMode", state.adminMode);
    },
    setAdminMode: (state, action) => {
      state.adminMode = action.payload;
      localStorage.setItem("adminMode", action.payload);
    },
  },
});

export const { toggleAdminMode, setAdminMode } = adminModeSlice.actions;
export default adminModeSlice.reducer;
