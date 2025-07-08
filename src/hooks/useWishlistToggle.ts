"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/wishListSlice/wishListSlice";
import { useCreateWishListMutation } from "@/redux/wishListApi/wishListApi";
import { FoodItem } from "@/types/types";

const useWishlistToggle = (item: FoodItem) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const { wishlist } = useAppSelector((state) => state.wish);

  const [createWishlist] = useCreateWishListMutation();

  const isInWishlist = wishlist.some((wItem) => wItem.id === item.id);

  const toggleWishlist = async (
    e?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isInWishlist) {
      dispatch(removeFromWishlist(item.id));
    } else {
      dispatch(addToWishlist(item)); // Always add to local wishlist

      // Only persist if user is authenticated
      if (user?.userId) {
        const payload = {
          purchase_item_id: item.id,
          customer_id: user.userId,
        };

        try {
          const res = await createWishlist(payload).unwrap();
          // If your API returns a different structure, adjust here
          console.log("Wishlist item saved to backend:", res);
        } catch (error) {
          console.error("Error creating wishlist:", error);
        }
      } else {
        console.log("Wishlist saved locally for guest user.");
      }
    }
  };

  return {
    isInWishlist,
    toggleWishlist,
  };
};

export default useWishlistToggle;
