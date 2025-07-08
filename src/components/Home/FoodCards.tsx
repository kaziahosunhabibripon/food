"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  useGetAllFoodsQuery,
  useGetBannerImageQuery,
} from "@/redux/apiSlice/apiSlice";
import Loading from "@/app/loading";

const FoodCards = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const locale = useLocale();
  const router = useRouter();
  const lang = locale === "ar" ? "ar" : "en";
  // Fetching banner images and food items using Redux queries
  // These queries will be used to display the banner images and food items in the component
  const { data: bannerData, isLoading: bannerLoading } = useGetBannerImageQuery(
    {}
  );

  const { data: foodsData, isLoading } = useGetAllFoodsQuery({});
  // laravel API base URL for fetching images
  const baseUrl = "https://rapiderp.excellency-catering-restaurant-sweets.com/";
  // Initializing AOS for animations and GSAP for card animations
  // AOS is used for scroll animations and GSAP is used for card animations
  useEffect(() => {
    AOS.init({ offset: 120, duration: 2000, easing: "ease-out" });

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(cardRefs.current, {
      scale: 1.1,
      duration: 1,
      yoyo: true,
      repeat: 1,
      stagger: {
        each: 0.5,
        ease: "power1.inOut",
      },
    });
  }, []);
  if (bannerLoading || isLoading) {
    return <Loading />;
  }
  return (
    <div
      className="w-full py-16 p-4 bg-[#f2f2f25b]"
      data-aos="fade-up"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:px-12"
        lang={locale}
      >
        {bannerData?.small_banner.map((card, index) => {
          const matchedFood = foodsData?.items?.find(
            (food) => food.id === card.purchase_item_id
          );

          return (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="relative overflow-hidden rounded-lg w-full h-auto"
            >
              <Image
                src={
                  lang === "ar"
                    ? card.banner_photo_ar
                      ? `${baseUrl}${card.banner_photo_ar}`
                      : "/placeholder.svg"
                    : card.banner_photo_en
                    ? `${baseUrl}${card.banner_photo_en}`
                    : "/placeholder.svg"
                }
                alt="Food"
                width={800}
                height={800}
                className="object-cover w-full h-full"
              />

              <div
                className={`absolute bottom-4 rounded-lg ${
                  index === bannerData?.small_banner.length - 1
                    ? "left-10 bg-[#d90b06]"
                    : "right-10 bg-[#ffcc00]"
                } z-10`}
              >
                <button
                  onClick={() => {
                    if (matchedFood) {
                      router.push(`/product/${matchedFood.id}`);
                    } else {
                      router.push("/all-products");
                    }
                  }}
                  className="text-slate-100 cursor-pointer py-2 px-4 font-semibold shadow-md"
                >
                  {locale === "ar" ? "اطلب الآن" : "Order Now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FoodCards;
