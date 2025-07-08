// hooks/useAddToCart.ts
import { useRef } from "react";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { addToCartItem } from "@/helpers/restApiRequest";
import toastAlert from "@/utils/toastConfig";
import { addToCart, setGuestUserId } from "@/redux/cart/cartSlice";

// Define or import the Product type
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

export function useAddToCart() {
  const dispatch = useAppDispatch();
  const skipNextSync = useRef(false);
  const toastId = useRef<string | number | null>(null);

  async function addToCartGlobal(
    product: Product,
    id: number,
    quantity: number,
    setQuantity: React.Dispatch<React.SetStateAction<number>>
  ) {
    try {
      const response = await addToCartItem({ item_id: id, quantity });
      if (response?.data) {
        const guestUserId = response?.data?.cart?.guest_id || "";
        dispatch(setGuestUserId(guestUserId));
        dispatch(
          addToCart({
            items: product,
            quantity,
            cartId: response?.data?.cart?.id,
            guestId: guestUserId,
          })
        );

        skipNextSync.current = true;
        setQuantity(1);
      }
    } catch (err) {
      const { response } = err as {
        response?: { data?: { message?: string } };
      };
      toastAlert(
        "error",
        response?.data?.message || "Something went wrong",
        "top-right",
        toastId,
        { autoClose: 4000 }
      );
    }
  }

  return { addToCartGlobal };
}
