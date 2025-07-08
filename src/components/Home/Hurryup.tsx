"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import TopSellCard from "../SingleFood/TopSellCard";

import DealCount from "../DealCounter/DealCounter";
import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import { useLocale, useTranslations } from "next-intl";
import { useGetBestFoodQuery } from "@/redux/apiSlice/apiSlice";

import NotFoundPage from "@/app/not-found";
import Loading from "@/app/loading";

export default function HurryUpDeals() {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const t = useTranslations();
  // offer end time is set to 3 days from now, with additional hours and minutes
  // This is just an example, you can adjust it as needed
  // The time is set to 10 hours and 50 minutes after the current time,
  // and 10 seconds added to the current time

  // You can also use a library like moment.js or date-fns for more complex date
  const offerEndTime = new Date();
  offerEndTime.setDate(offerEndTime.getDate() + 3);
  offerEndTime.setHours(offerEndTime.getHours() + 10);
  offerEndTime.setMinutes(offerEndTime.getMinutes() + 50);
  offerEndTime.setSeconds(offerEndTime.getSeconds() + 10);

  const { data: recentlyData, isLoading } = useGetBestFoodQuery({});
  return (
    <main
      className="container mx-auto px-4 py-8 w-full"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <AppTitleHeader
        title={t("hurryUp.title")}
        subtitle={t("hurryUp.subtitle")}
        secondarySubTitle={t("hurryUp.secondarySubTitle")}
      />
      <div className="flex items-center justify-between border-b border-gray-300 mb-8">
        <h1 className="text-3xl font-bold text-gray-500 mb-2">
          {t("hurryUp.dialog")}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex flex-col py-2">
            <DealCount endDate={offerEndTime} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : recentlyData?.items?.length > 0 ? (
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          navigation={true}
          grabCursor={true}
          className="foodCard"
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            468: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 4, spaceBetween: 10 },
          }}
        >
          {recentlyData?.items?.map((product, index) => {
            const isArabic = locale === "ar";

            const localizedProduct = {
              ...product,
              title: isArabic ? product.titleAr : product.title,
              subtitle: isArabic ? product.subtitleAr : product.subtitle,
              features: isArabic ? product.featuresAr : product.features,
            };

            return (
              <SwiperSlide key={index}>
                <TopSellCard product={localizedProduct} index={index} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <NotFoundPage />
      )}
    </main>
  );
}
