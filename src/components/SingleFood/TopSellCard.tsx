"use client";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ShoppingCart } from "react-feather";

const TopSellCard = ({
  product,
  index,
}: {
  product: {
    id: number;
    name: string;
    arabic_name: string;
    final_price: number;
    image_url: string;
  };

  index: number;
}) => {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const t = useTranslations();
  // check if the product has an image, if not use a placeholder
  //shopping cart is used to add the product to the cart
  const { id, name, arabic_name, final_price, image_url } = product;
  return (
    <div
      key={index}
      className="flex flex-col relative group group-hover:shadow-2xl"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <Link href={`/product/${id}`} passHref>
        <div className="group bg-gray-50 rounded-lg mb-3 w-full h-48 relative overflow-hidden">
          <Image
            src={image_url || "/images/placeholder.png"}
            alt={
              locale === "ar"
                ? arabic_name || "صورة المنتج"
                : name || "Product image"
            }
            width={800}
            height={800}
            className="w-full p-4 h-full rounded-xl object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute  w-36 mx-auto left-0 bottom-5 right-0 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <div className="w-full bg-[#ecbf4c] text-white py-2 font-semibold shadow-md hover:bg-[#ecbf4c] flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {t("product.addToCart")}
            </div>
          </div>
        </div>
      </Link>

      <>
        <div
          className={`flex justify-between items-start  pb-2 px-2 ${
            lang === "ar" ? "text-right" : "text-left"
          }`}
        >
          {/* Left Column */}
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-gray-800 mb-1">
              {locale === "ar" ? arabic_name : name}
            </h3>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-end">
            <p className="text-base font-extrabold text-gray-900">
              {t("hurryUp.currency")}{" "}
              {locale === "ar" ? toArabicNumerals(final_price) : final_price}
            </p>
          </div>
        </div>
      </>
    </div>
  );
};

export default TopSellCard;
