"use client";

import { useGetAllReviewsQuery } from "@/redux/reviewApi/reviewApi";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Star } from "react-feather";
import Loading from "@/app/loading";

function ReviewCard({ product }) {
  const locale = useLocale();
  const t = useTranslations("customerReviews");
  const lang = locale === "ar" ? "ar" : "en";

  const { data: reviews, isLoading } = useGetAllReviewsQuery({});

  if (isLoading) return <Loading />;

  // ✅ Only reviews with matching purchase_item_id
  const productReviews = reviews?.list?.filter(
    (review) => review.purchase_item_id === product.id
  );

  if (!productReviews?.length) {
    return (
      <div
        className="flex items-center justify-center text-xl text-gray-700 font-bold italic py-6"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {t("noReview")} &nbsp;
        <strong> {locale === "ar" ? product.arabic_name : product.name}</strong>
      </div>
    );
  }

  return (
    <div className="px-4 py-8" dir={lang === "ar" ? "rtl" : "ltr"}>
      <h2 className="text-2xl text-center font-bold mb-6">
        {t("Rfor")}{" "}
        <span className="text-[#ecbf4c]">
          {locale === "ar" ? product.arabic_name : product.name}
        </span>
      </h2>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {productReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <Image
                src={review.customer_photo || "/default-user.png"}
                width={60}
                height={60}
                alt={review.customer_name || "User"}
                className="rounded-full border object-cover"
              />
              <h3 className="font-semibold text-lg">
                {review.customer_name || "Anonymous"}
              </h3>
            </div>

            <p className="text-gray-700 italic">{review.review_message}</p>
            <div className="flex items-start gap-4 mt-4 justify-between">
              <p className="text-sm text-gray-400">
                {review.review_date || ""}
              </p>
              <div className="mb-2 text-yellow-500 flex">
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewCard;
