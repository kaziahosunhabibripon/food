"use client";

import { useAppDispatch } from "@/redux/hooks/hooks";
import { useCreateWishListMutation } from "@/redux/wishListApi/wishListApi";

import { addToWishlist } from "@/redux/wishListSlice/wishListSlice";
import toastAlert from "@/utils/toastConfig";
import { useRef } from "react";

// Product type (reused)
export type Product = {
  id: number;
  name: string;
  arabic_name?: string;
  price: number;
  final_price?: number;
  offer_price?: string;
  image_url: string;
  currency?: string;
};

export function useAddToWishlist() {
  const dispatch = useAppDispatch();
  const toastId = useRef<string | number | null>(null);
  const [createWishList, { isLoading }] = useCreateWishListMutation();

  async function addToWishlistGlobal(product: Product, userId?: string) {
    try {
      // Call API if user ID is present (logged-in user)
      if (userId) {
        await createWishList({
          productId: product.id,
          customerId: userId,
        }).unwrap();
      }

      // Always add locally
      dispatch(addToWishlist(product));

      toastAlert("success", "Added to wishlist!", "top-right", toastId, {
        autoClose: 3000,
      });
    } catch (err) {
      const { response } = err as {
        response?: { data?: { message?: string } };
      };
      toastAlert(
        "error",
        response?.data?.message || "Failed to add to wishlist",
        "top-right",
        toastId,
        { autoClose: 4000 }
      );
    }
  }

  return { addToWishlistGlobal, isLoading };
}
