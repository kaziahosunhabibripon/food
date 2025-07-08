"use client";

import { useGetAllReviewsQuery } from "@/redux/reviewApi/reviewApi";
import { useLocale } from "next-intl";
import Image from "next/image";
import Loading from "@/app/loading";
import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import { Star } from "react-feather";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

export default function Reviews() {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const { data: reviews, isLoading } = useGetAllReviewsQuery({});

  if (isLoading) return <Loading />;

  const reviewsList = reviews?.list || [];

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`py-16 sm:px-6 lg:px-8 bg-gray-50 ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <AppTitleHeader
          title={lang === "ar" ? "قيم" : "Valuable"}
          subtitle={lang === "ar" ? "العملاء" : "Customers"}
          secondarySubTitle={lang === "ar" ? "المراجعات" : "Reviews"}
        />

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3000 }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className={`my-8  ${lang === "ar" ? "rtl-flip" : ""}`}
        >
          {reviewsList.map((review) => (
            <SwiperSlide key={review.id} className="my-4  py-2">
              <article className="h-full flex flex-col justify-between max-w-md mx-auto min-h-[420px] bg-slate-100/90 rounded-lg p-6 shadow-md transform transition duration-300 hover:scale-105">
                <div className="flex items-center justify-center flex-col gap-4 mb-4">
                  <Image
                    src={review.customer_photo || "/default-user.png"}
                    width={100}
                    height={100}
                    alt={review.customer_name || "User"}
                    className="rounded-full border object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {review.customer_name || "Anonymous"}
                  </h3>
                </div>
                <p className="text-gray-700 italic mb-4">
                  {review.review_message}
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    {review.review_date || ""}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        fill={i < review.star_number ? "#facc15" : "none"}
                        strokeWidth={1.5}
                        size={20}
                      />
                    ))}
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex justify-center gap-4 mt-8 cursor-pointer">
          <FaCircleArrowLeft className="custom-prev text-brand text-4xl" />
          <FaCircleArrowRight className="custom-next text-brand text-4xl" />
        </div>
      </div>
    </section>
  );
}
