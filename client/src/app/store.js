import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/product/productSlice";
import userReducer from "../features/user/userSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import adminModeReducer from "../features/mode/adminModeSlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    adminMode: adminModeReducer,
  },
});

export default store;
