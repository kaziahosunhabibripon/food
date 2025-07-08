/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck

"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Plus, Minus, Heart } from "react-feather";
import { IProduct } from "@/types/types";

import { useAddToCart } from "@/hooks/addToCart";
import { useProductQuantity } from "@/hooks/ useProductQuantity";
import { useLocale } from "next-intl";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import useWishlistToggle from "@/hooks/useWishlistToggle";

type ProductCardProps = {
  product: IProduct;
  view?: "list" | "grid";
};

export default function ProductListView({
  product,
  view = "list",
}: ProductCardProps) {
  const {
    id,
    name,
    price,
    image_url,
    currency,
    arabic_name,
    final_price,
    offer_price,
  } = product;

  const locale = useLocale();
  const { quantity, setQuantity, handleIncrement, handleDecrement } =
    useProductQuantity(id);

  const { addToCartGlobal } = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent bubbling to Link
    addToCartGlobal(product, id, quantity, setQuantity);
  };

  const handleInc = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleIncrement();
  };

  const handleDec = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDecrement();
  };
  const { isInWishlist, toggleWishlist } = useWishlistToggle(product);
  const priceDisplay =
    locale === "ar"
      ? toArabicNumerals(Number(final_price || price))
      : Number(final_price || price);

  const oldPriceDisplay =
    locale === "ar" ? toArabicNumerals(Number(price)) : Number(price);
  return (
    <div className="flex flex-col items-center justify-center md:flex-row border border-gray-200 rounded-xl p-4 w-full bg-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 space-y-4 md:space-y-0 md:space-x-4">
      {/* Image Section */}

      <div className="relative w-[300px] h-[200px]">
        <Link href={`/product/${id}`} className="shrink-0 py-1.5 px-2">
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

      {/* Product Info Section */}
      <div className="flex flex-col justify-between flex-grow">
        <Link href={`/product/${id}`}>
          <div>
            <h2 className="text-lg font-semibold text-gray-500 line-clamp-2">
              {locale === "ar" ? arabic_name : name}
            </h2>

            <div className="flex mt-3 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4" />
              ))}
            </div>

            <p className="mt-3 text-base font-bold text-gray-500 flex items-center gap-2">
              <span className="text-yellow-500">
                {locale === "ar"
                  ? `${toArabicNumerals(priceDisplay)} ${currency || "د.إ"}`
                  : `${currency || "AED"} ${priceDisplay}`}
              </span>
              {offer_price && Number(offer_price) > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {locale === "ar"
                    ? `${toArabicNumerals(oldPriceDisplay)} ${
                        currency || "د.إ"
                      }`
                    : `${currency || "AED"} ${oldPriceDisplay}`}
                </span>
              )}
            </p>
          </div>
        </Link>
      </div>

      {/* Quantity & Cart Controls */}
      <div className="flex flex-col items-center justify-center space-y-1">
        {/* Quantity Buttons */}
        <div className="mt-4 md:mt-0 md:ml-auto flex items-center space-x-2">
          <button
            onClick={handleDec}
            aria-label="Decrease quantity"
            className="p-2 border border-[#ecbf4c] rounded-md hover:bg-[#ecbf4c] transition"
            disabled={quantity === 0}
          >
            <Minus className="h-4 w-4 text-gray-700" />
          </button>

          <span className="w-8 text-center font-semibold text-gray-500">
            {locale === "ar" ? toArabicNumerals(quantity) : quantity}
          </span>

          <button
            onClick={handleInc}
            aria-label="Increase quantity"
            className="p-2 border border-[#ecbf4c] rounded-md hover:bg-[#ecbf4c] transition"
          >
            <Plus className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <div
          className={`my-4 ${
            view === "list"
              ? "md:mt-0 md:ml-auto flex justify-center items-center"
              : "flex justify-center"
          }`}
        >
          <button
            aria-label={`Add ${name} to cart`}
            className="my-4 p-2 border border-[#ecbf4c] hover:text-white hover:border-white text-[#ecbf4c] rounded-md hover:bg-[#ecbf4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleAddToCart}
            disabled={quantity === 0}
          >
            <span>{locale === "ar" ? "أضف إلى السلة" : "Add to Cart"}</span>
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
