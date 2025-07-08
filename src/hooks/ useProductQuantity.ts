// import { useState } from "react";
// import { useAppSelector } from "@/redux/hooks/hooks";

// export function useProductQuantity(productId: number) {
//   const cartItem = useAppSelector((state) =>
//     state.cart.cartData?.find((item) => item?.id === productId)
//   );

//   const [quantity, setQuantity] = useState(cartItem?.quantity || 1);

//   const handleIncrement = () => setQuantity((prev) => prev + 1);

//   const handleDecrement = () =>
//     setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   return {
//     quantity,
//     setQuantity,
//     handleIncrement,
//     handleDecrement,
//   };
// }
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks/hooks";

export function useProductQuantity(productId: number) {
  const cartItem = useAppSelector((state) =>
    state.cart.cartData?.find((item) => item?.id === productId)
  );

  // Helper: check localStorage saved quantity or fallback to Redux quantity or 1
  const getInitialQuantity = () => {
    if (typeof window === "undefined") return 1; // SSR safe
    const saved = localStorage.getItem(`product-quantity-${productId}`);
    if (saved) return Number(saved);
    return cartItem?.quantity || 1;
  };

  const [quantity, setQuantity] = useState(getInitialQuantity);

  // Update quantity if cartItem quantity changes AND localStorage doesn't have a saved value
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(`product-quantity-${productId}`);
    if (!saved && cartItem?.quantity && cartItem.quantity !== quantity) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem?.quantity, productId, quantity]);

  // Sync quantity to localStorage on changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`product-quantity-${productId}`, String(quantity));
  }, [productId, quantity]);

  const handleIncrement = () => setQuantity((prev) => prev + 1);

  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return {
    quantity,
    setQuantity,
    handleIncrement,
    handleDecrement,
  };
}
