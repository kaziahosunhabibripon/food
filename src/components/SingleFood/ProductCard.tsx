"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { Heart, Star, ShoppingCart } from "react-feather";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { alterCardImage, truncateText } from "@/utils/appHelpers";
import { FoodItem } from "@/types/types";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import useWishlistToggle from "@/hooks/useWishlistToggle"; // ✅ ✅ ✅ new

interface ProductCardProps {
  data: FoodItem;
  callback?: () => void;
  customClasses?: string;
  index?: number;
}

const isValidImgUrl = (img: string | undefined) => {
  return img?.startsWith("http://") || img?.startsWith("https://");
};

const ProductCard = ({
  data,
  callback,
  customClasses = "w-40 h-40",
}: ProductCardProps) => {
  const locale = useLocale();
  const t = useTranslations();

  const {
    id,
    image_url,
    sub_category,
    name,
    arabic_name,

    final_price,
    price,
  } = data || {};

  const displayName = truncateText(
    locale === "ar" ? arabic_name || name : name,
    25
  );
  const foodImage = useMemo(
    () => (isValidImgUrl(image_url) ? image_url : alterCardImage),
    [image_url]
  );

  // ✅ ✅ ✅ Using the new hook only
  const { isInWishlist, toggleWishlist } = useWishlistToggle(data);

  return (
    <div
      className="relative max-w-sm rounded-xl overflow-hidden p-3 shadow-lg group bg-[#ecbf4c]/15 transition-transform duration-300 ease-in-out"
      key={id}
    >
      {/* Image and Heart */}
      <div className="relative group overflow-hidden rounded-xl shadow-md">
        <Link href={`/product/${id}`}>
          <Image
            src={foodImage}
            alt={displayName}
            width={200}
            height={200}
            loading="lazy"
            className={`${customClasses} object-cover rounded-md transition-transform duration-300 ease-in-out group-hover:scale-110`}
          />
        </Link>

        <div
          className={`absolute top-4 right-4 p-2 rounded-full border transition-colors cursor-pointer
    ${
      isInWishlist
        ? "bg-[#ecbf4c] border-red-500"
        : "bg-[#ecbf4c] border-[#cf3613]"
    }
    hover:bg-[#ecbf4c] hover:border-red-500
  `}
          role="button"
          aria-label="Toggle wishlist"
          tabIndex={0}
          onClick={toggleWishlist}
          onKeyDown={(e) => {
            if (e.key === "Enter") toggleWishlist(e);
          }}
        >
          <Heart
            className={`w-6 h-6 transition-colors
      ${
        isInWishlist
          ? "text-red-500 fill-current"
          : "text-[#cf3613] fill-transparent"
      }
    `}
          />
        </div>

        {/* Hover Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={callback}
            className="w-full bg-[#ecbf4c] text-white py-2 font-semibold shadow-md hover:bg-[#ecbf4c] flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {t("product.addToCart")}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-2 py-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-base 2xl:text-xl font-semibold text-gray-900 lowercase first-letter:uppercase">
              {displayName}
            </h3>
            <p className="text-gray-600 text-sm">{sub_category?.name}</p>
          </div>

          <div className="flex items-center px-2 py-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 ml-1 text-[#ecbf4c] fill-current"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 ">
          {data?.offer_price > 0 && (
            <span className="text-gray-500 line-through">
              {t("product.currency")}{" "}
              {locale === "ar"
                ? toArabicNumerals(Math.round(price))
                : Math.round(price)}
            </span>
          )}

          <span className="font-semibold">
            {t("product.currency")}{" "}
            {locale === "ar"
              ? toArabicNumerals(Math.round(final_price))
              : Math.round(final_price)}
          </span>
          {/* <span className="text-gray-900 font-bold text-base 2xl:text-lg">
            {t("product.currency")}{" "}
            {locale === "ar"
              ? toArabicNumerals(Math.round(Number(price)))
              : Math.round(Number(price))}
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
