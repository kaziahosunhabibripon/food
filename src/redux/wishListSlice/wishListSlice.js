import { createSlice } from "@reduxjs/toolkit";

const getWishlistData = () => {
  if (typeof window !== "undefined") {
    const storedWishlist = localStorage.getItem("wishlistData");
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  }
  return [];
};

const initialState = {
  wishlist: getWishlistData(),
};

const wishlistSlice = createSlice({
  name: "wish",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlistData", JSON.stringify(action.payload));
      }
    },
    addToWishlist: (state, action) => {
      const exists = state.wishlist.find(
        (item) => item.id === action.payload.id
      );
      if (!exists) {
        state.wishlist.push(action.payload);
        localStorage.setItem("wishlistData", JSON.stringify(state.wishlist));
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem("wishlistData", JSON.stringify(state.wishlist));
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlistData", JSON.stringify([]));
      }
    },
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
