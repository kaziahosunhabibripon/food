/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck
"use client";
import { productsData } from "@/data/ProductData";
import ProductCard from "../SingleFood/ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import { useTranslations } from "next-intl";
import PopularCard from "../SingleFood/PopularCard";
import { useGetMostPopularFoodQuery } from "@/redux/apiSlice/apiSlice";

import NotFoundPage from "@/app/not-found";
import Loading from "@/app/loading";

export default function MostPopular() {
  const t = useTranslations();
  // fetching most popular food items using Redux query
  // This will be used to display the most popular food items in the component
  // This query will return the most popular food items based on the backend logic
  // The data will be used to display the food items in a swiper slider
  // The isLoading state will be used to show a loading spinner while the data is being fetched
  // The popularData will contain the most popular food items
  // The popularData.items will contain the array of food items
  // Each food item will be displayed using the PopularCard component
  // The Swiper component will be used to display the food items in a slider format
  // The SwiperSlide component will be used to wrap each food item
  // The Autoplay and Navigation modules will be used to enable autoplay and navigation functionality in the
  const { data: popularData, isLoading } = useGetMostPopularFoodQuery({});

  return (
    <main className="container mx-auto px-4 py-8 w-full">
      <AppTitleHeader
        title={t("popular.title")}
        subtitle={t("popular.subtitle")}
        secondarySubTitle={t("popular.secondarySubTitle")}
      />

      {isLoading ? (
        <Loading />
      ) : popularData?.items?.length > 0 ? (
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          navigation
          grabCursor
          slidesPerView={4}
          spaceBetween={20}
          loop
          className="foodCard"
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            468: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 4, spaceBetween: 10 },
          }}
        >
          {popularData?.items?.map((product, index) => (
            <SwiperSlide key={product.id || index}>
              <PopularCard data={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <NotFoundPage />
      )}
    </main>
  );
}
