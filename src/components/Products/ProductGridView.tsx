/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingCart } from "react-feather";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import { useLocale } from "next-intl";
import { useAddToCart } from "@/hooks/addToCart";

import { IProduct } from "@/types/types";

import { useProductQuantity } from "@/hooks/ useProductQuantity";
import useWishlistToggle from "@/hooks/useWishlistToggle";

type ProductCardProps = {
  product: IProduct;
  viewMode: "grid" | "list";
};

export default function ProductGridView({
  product,
  viewMode,
}: ProductCardProps) {
  const locale = useLocale();

  const {
    id,
    image_url,
    price,
    name,
    arabic_name,
    final_price,
    offer_price,
    currency,
  } = product || {};

  const displayName = useMemo(
    () => (locale === "ar" ? arabic_name || name : name),
    [locale, arabic_name, name]
  );

  const { quantity, setQuantity, handleIncrement, handleDecrement } =
    useProductQuantity(id);
  useEffect(() => {
    setQuantity(1);
  }, [id, setQuantity]);
  const { addToCartGlobal } = useAddToCart();

  const handleAddToCart = () => {
    addToCartGlobal(product, id, quantity, setQuantity);
  };

  const priceDisplay =
    locale === "ar"
      ? toArabicNumerals(Number(final_price || price))
      : Number(final_price || price);

  const oldPriceDisplay =
    locale === "ar" ? toArabicNumerals(Number(price)) : Number(price);
  const { isInWishlist, toggleWishlist } = useWishlistToggle(product);
  return (
    <div
      className={`group bg-[#ecbf4c]/15 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] ${
        viewMode === "list" ? "flex gap-4" : "flex flex-col items-center"
      }`}
    >
      {/* Image */}

      <div
        className={`relative group w-[400px] h-[300px] rounded overflow-hidden`}
      >
        <Link href={`/product/${id}`} className="shrink-0 py-3 px-8">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              width={800}
              height={800}
              loading="lazy"
              className="rounded object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          ) : null}
        </Link>
        <div
          className={`absolute top-7 right-4 p-2 rounded-full border transition-colors cursor-pointer
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
      </div>

      {/* Content */}
      <div
        className={`flex flex-col justify-between gap-2 ${
          viewMode === "list" ? "flex-1" : "w-full text-center"
        }`}
      >
        <div className="py-3 flex justify-between items-center px-4">
          <h3
            className={`text-base font-semibold text-gray-900 lowercase first-letter:uppercase ${
              viewMode === "list" ? "text-left" : "text-center"
            }`}
            title={displayName}
          >
            {displayName}
          </h3>

          <div
            className={`text-brand text-[1.1rem] font-semibold ${
              viewMode === "list" ? "text-left" : "text-center"
            }`}
          >
            {locale === "ar"
              ? `${toArabicNumerals(priceDisplay)} ${currency || "د.إ"}`
              : `${currency || "AED"} ${priceDisplay}`}
          </div>

          {offer_price && Number(offer_price) > 0 && (
            <p className="text-sm text-gray-400 line-through">
              {locale === "ar"
                ? `${toArabicNumerals(oldPriceDisplay)} ${currency || "د.إ"}`
                : `${currency || "AED"} ${oldPriceDisplay}`}
            </p>
          )}
        </div>

        {/* Quantity and Cart */}
        <div
          className={`pt-1 pb-3 flex items-center px-4 justify-between gap-4`}
        >
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-[#ecbf4c] rounded-full px-2 py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDecrement();
              }}
              className="border border-[#ecbf4c] rounded-full h-8 w-8 bg-white flex items-center justify-center"
            >
              <Minus className="h-4 w-4 text-gray-600" />
            </button>

            <span className="px-1">
              {locale === "ar" ? toArabicNumerals(quantity) : quantity}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleIncrement();
              }}
              className="border border-[#ecbf4c] rounded-full h-8 w-8 bg-white flex items-center justify-center"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Cart Icon */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="cursor-pointer p-2 rounded-full border border-[#ecbf4c] hover:bg-[#ecbf4c] hover:[&>svg]:text-white transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-[#ecbf4c]" />
          </div>
        </div>
      </div>
    </div>
  );
}
