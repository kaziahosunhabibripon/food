import { configureStore } from "@reduxjs/toolkit";
import appReducer from "@/redux/app/appSlice";
import cartSlice from "@/redux/cart/cartSlice";
import userSlice from "@/redux/user/userSlice";
import wishListSlice from "@/redux/wishListSlice/wishListSlice";
import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { authApi } from "@/redux/authApi/authApi";
import { cartApi } from "@/redux/cartApi/cartApi";
import { contactApi } from "./contactApi/contactApi";
import { wishListApi } from "./wishListApi/wishListApi";
import { reviewApi } from "./reviewApi/reviewApi";
import { locationApi } from "./deliverySlice/deliverySlice";
import { reserveApi } from "./reserveApi/reserveApi";
import { blogApi } from "./blogApi/blogApi";

// Configure and export the Redux store
export const store = configureStore({
  reducer: {
    app: appReducer,
    cart: cartSlice,
    user: userSlice,
    wish: wishListSlice,

    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [wishListApi.reducerPath]: wishListApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [reserveApi.reducerPath]: reserveApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      authApi.middleware,
      cartApi.middleware,
      contactApi.middleware,
      wishListApi.middleware,
      reviewApi.middleware,
      locationApi.middleware,
      reserveApi.middleware,
      blogApi.middleware
    ),
});

// Export types to use in the app
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>; // <-- This is the RootState type
