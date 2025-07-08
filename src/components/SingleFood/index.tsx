"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Image from "next/image";
import CommonHeader from "../common/CommonHeader";

import { useProductQuantity } from "@/hooks/ useProductQuantity";
import { useAddToCart } from "@/hooks/addToCart";
import SocialIconLink from "@/helpers/ui/FontAwesome";
import { useGetSocialMediaQuery } from "@/redux/apiSlice/apiSlice";
import Loading from "@/app/loading";

import SubscribeUs from "../SubscribeUs/Subscribe";
import ReviewForm from "../Reviews/PostReviews";
import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import ReviewCard from "../Reviews/ReviewCard";
import { useLocale, useTranslations } from "next-intl";
import { toArabicNumerals } from "@/helpers/ui/Arabic";

const SingleFoodComponent = (product) => {
  const locale = useLocale();
  const t = useTranslations();

  const lang = locale === "ar" ? "ar" : "en";
  const {
    id,
    price,
    name,
    arabic_name,
    image_url,
    description,
    final_price,
    offer_price,
  } = product || {};

  // filter out the all food data from the props
  // using two endpoint one for all food data and one for single food data
  const { quantity, setQuantity, handleIncrement, handleDecrement } =
    useProductQuantity(id);
  // // Add to cart functionality using custom hook
  const { addToCartGlobal } = useAddToCart();
  // Fetch social media data
  const { data: socialMedia, isLoading } = useGetSocialMediaQuery({});
  const selectedItems = socialMedia?.list?.filter((_, index) =>
    [1, 2, 3, 11].includes(index)
  );
  // console.log(selectedItems);
  // Function to handle adding product to cart
  const handleAddToCart = () => {
    addToCartGlobal(product, id, quantity, setQuantity);
  };

  useEffect(() => {
    AOS.init({ offset: 120, duration: 2000, easing: "ease-out" });
  }, []);

  // Product URL for sharing
  const productUrl = `https://rapiderp.excellency-catering-restaurant-sweets.com/product/${id}`;

  // Social brand colors
  const socialColors = {
    facebook: "#1877F2", // Facebook Blue
    twitter: "#000000", // Twitter Blue
    whatsapp: "#25D366", // WhatsApp Green
    linkedin: "#0077B5", // LinkedIn Blue
    instagram: "#E4405F", // Instagram Pinkish Red
    youtube: "#FF0000", // YouTube Red
    pinterest: "#E60023", // Pinterest Red
  };

  // Open share popup window helper
  const openShareWindow = (url) => {
    const width = 600;
    const height = 500;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      url,
      "Share",
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,status=0`
    );
  };

  return (
    <div className="w-full" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* hero section */}
      <CommonHeader
        title={locale === "ar" ? arabic_name : name}
        componentTitle={t("singleFood.componentTitle")}
      />

      <div className="container mx-auto my-8" data-aos="fade-up">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          id="single-food"
          data-aos="fade-up"
        >
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute top-4 left-4 bg-brand text-white px-3 py-1 text-sm font-semibold rounded">
                {t("singleFood.sale")}
              </div>
              <div className="rounded-full border-2 border-dashed border-red-200 p-2 inline-block">
                <div className="relative w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden group">
                  {image_url && image_url.trim() !== "" && (
                    <Image
                      src={image_url}
                      alt={locale === "ar" ? arabic_name : name}
                      width={800}
                      height={800}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      href="/all-products"
                      className="bg-brand text-white px-4 py-2 rounded-full shadow-lg bg-brand/75"
                    >
                      {t("singleFood.viewAll")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6" data-aos="fade-up">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold">
                {locale === "ar" ? arabic_name : name}
              </h1>
              <div className="flex items-center gap-2">
                {offer_price > 0 && (
                  <span className="text-gray-400 line-through">
                    {t("product.currency")}{" "}
                    {locale === "ar"
                      ? toArabicNumerals(Math.round(Number(price)))
                      : Math.round(Number(price))}
                  </span>
                )}

                <span className="text-3xl font-bold">
                  {t("product.currency")}
                  {"\u00A0"}
                  {locale === "ar"
                    ? toArabicNumerals(Math.round(final_price))
                    : Math.round(final_price)}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span>{t("product.quantity")}</span>

              <div className="flex items-center border border-gray-200 rounded">
                <button
                  role="button"
                  tabIndex={0}
                  className="px-3 py-1 border-r border-gray-200 cursor-pointer"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <span className="px-4 py-1 select-none">
                  {locale === "ar" ? toArabicNumerals(quantity) : quantity}
                </span>
                <button
                  role="button"
                  tabIndex={0}
                  className="px-3 py-1 border-l border-gray-200 cursor-pointer"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {locale === "ar" ? "الوصف :" : "Description :"}
              </span>
              <p className="text-gray-700">
                {locale === "ar" ? description : description}
              </p>
            </div>

            {/* Add to cart */}
            <div className="flex gap-4">
              <button
                role="button"
                tabIndex={0}
                className="flex-1 bg-brand text-white px-6 cursor-pointer py-3 rounded transition duration-200"
                onClick={handleAddToCart}
              >
                {t("product.addToCart")}
              </button>
            </div>

            {/* Shop Meta */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div>
                <span className="font-semibold">{t("product.shop")} </span>
                <span className="text-brand font-semibold px-2">
                  {t("product.excellency")}
                </span>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <span className="font-semibold">{t("product.share")}</span>
              <div className="flex gap-2">
                {isLoading ? (
                  <Loading />
                ) : (
                  selectedItems
                    ?.filter(
                      (item) =>
                        item?.title_value &&
                        typeof item.title_value === "string" &&
                        item.title_value.startsWith("http")
                    )
                    .map(({ id, index_name, title }) => {
                      const trimmedIndex =
                        index_name?.trim().toLowerCase() || "facebook";

                      const productName = locale === "ar" ? arabic_name : name;

                      let shareUrl = "#";

                      if (trimmedIndex === "facebook") {
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          `https://www.facebook.com/excellencyrest2/(productUrl)`
                        )}&text=${encodeURIComponent(productName)}`;
                      } else if (trimmedIndex === "twitter") {
                        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          productUrl
                        )}&text=${encodeURIComponent(productName)}`;
                      } else if (trimmedIndex === "instagram") {
                        // Instagram doesn’t support direct share URLs, fallback to profile
                        shareUrl = `https://www.instagram.com/excellencyrest2/`;
                      } else if (trimmedIndex === "youtube") {
                        // YouTube doesn’t support direct share URLs, fallback to channel
                        shareUrl = `https://www.youtube.com/@excellencyrest2`;
                      }

                      return (
                        <button
                          key={id}
                          onClick={() => openShareWindow(shareUrl)}
                          className="w-8 h-8 flex items-center justify-center rounded border border-gray-400 transition-colors"
                          style={{
                            borderColor:
                              socialColors[trimmedIndex] ||
                              "rgba(251 191 36 / 0.75)",
                            color:
                              socialColors[trimmedIndex] ||
                              "rgba(251 191 36 / 0.75)",
                          }}
                          data-aos="fade-up"
                          aria-label={title}
                          type="button"
                        >
                          <SocialIconLink
                            indexName={trimmedIndex}
                            label={title}
                            url="#"
                            color={
                              socialColors[trimmedIndex] ||
                              "rgba(251 191 36 / 0.75)"
                            }
                          />
                        </button>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="container mx-auto my-8">
        <AppTitleHeader
          title={t("customerReviews.title")}
          subtitle={t("customerReviews.subtitle")}
          secondarySubTitle={t("customerReviews.secondarySubTitle")}
        />
        <div
          className="grid grid-cols-2 md:grid-cols-2 gap-6"
          data-aos="fade-up"
        >
          <ReviewForm product={product} />
          <ReviewCard product={product} />
        </div>
      </div>

      <div className="pt-4" data-aos="fade-up">
        <SubscribeUs />
      </div>
      {/* <div className="container mx-auto my-8" data-aos="fade-up">
        <MostPopular />
        <TopSelling />
      </div> */}
    </div>
  );
};

export default SingleFoodComponent;
