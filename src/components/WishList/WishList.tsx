"use client";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks/hooks";
import { useGetWishListQuery } from "@/redux/wishListApi/wishListApi";
import {
  setWishlist,
  removeFromWishlist,
} from "@/redux/wishListSlice/wishListSlice";
import { useRouter } from "next/navigation";

import { useGetAllFoodsQuery } from "@/redux/apiSlice/apiSlice";
import { ShoppingCart } from "react-feather";
import { useAddToCart } from "@/hooks/addToCart";
import EmptyWishlist from "@/app/wishlist/EmptyWishlist";

import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import CommonHeader from "@/components/common/CommonHeader";
import { useLocale, useTranslations } from "next-intl";
import AOS from "aos";
import Image from "next/image";
import Loading from "@/app/loading";

const WishList = () => {
  const locale = useLocale();
  const t = useTranslations("wishList");
  const lang = locale === "ar" ? "ar" : "en";
  const [mounted, setMounted] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const { wishlist } = useAppSelector((state) => state.wish);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { addToCartGlobal } = useAddToCart();

  const { data: foodsData, isLoading: foodLoading } = useGetAllFoodsQuery({});
  const skip = !user?.userId;
  const { data, isLoading } = useGetWishListQuery(
    { customer_id: user?.userId },
    { skip }
  );

  // Set wishlist only when valid data is available
  useEffect(() => {
    if (!skip && data?.list) {
      const validWishlist = data.list.filter((item) => !!item.purchase_item_id);
      dispatch(setWishlist(validWishlist));
    }
  }, [data, dispatch, skip]);

  useEffect(() => {
    if (!user?.userId) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    AOS.init({ offset: 120, duration: 2000, easing: "ease-out" });
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (isLoading && foodLoading) return <Loading />;

  const foodsList = foodsData?.items || [];

  const matchedItems = wishlist
    .map((wishItem) => {
      const matchedProduct = foodsList.find(
        (food) => food.id === wishItem.purchase_item_id
      );
      if (!matchedProduct) return null;
      return { wishId: wishItem.id, product: matchedProduct };
    })
    .filter(Boolean);

  const handleRemove = (productId: number) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product) => {
    addToCartGlobal(product, product.id, 1, () => {});

    const wishlistItem = wishlist.find(
      (item) => item.purchase_item_id === product.id
    );
    if (wishlistItem) {
      dispatch(removeFromWishlist(wishlistItem.id));
    }
  };

  return (
    <section dir={lang === "ar" ? "rtl" : "ltr"}>
      <CommonHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container mx-auto p-4 min-h-screen" data-aos="fade-up">
        <AppTitleHeader
          title={t("title")}
          subtitle={t("subtitle")}
          secondarySubTitle={t("secondarySubTitle")}
        />
        {matchedItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {matchedItems.map(({ wishId, product }) => (
              <li
                key={wishId}
                className="border rounded-xl shadow p-4 bg-white hover:shadow-md transition relative"
              >
                <div className="relative w-full h-40 mb-3">
                  <Image
                    src={product.image_url || "/placeholder.png"}
                    alt={product.name || "Wishlist Item"}
                    fill
                    className="object-cover rounded-md"
                    unoptimized
                  />
                </div>

                <p className="text-lg font-semibold">
                  {lang === "ar" ? product.arabic_name : product.name}
                </p>

                <p className="text-gray-700">
                  {t("price")} : {t("currency")}
                  {product.final_price || product.price}
                </p>

                <div className="flex gap-4 mt-4">
                  <div
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center rounded-full gap-2 bg-[#ecbf4c] text-white py-2 px-3 hover:bg-[#e0ac2f] transition cursor-pointer"
                  >
                    {t("addToCart")}
                    <ShoppingCart className="w-4 h-4" />
                  </div>

                  <button
                    onClick={() => handleRemove(wishId)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition"
                  >
                    {t("remove")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default WishList;
