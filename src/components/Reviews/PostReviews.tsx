"use client";
import toastAlert from "@/utils/toastConfig";

import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import { useAppSelector } from "@/redux/hooks/hooks";
import { useCreateReviewMutation } from "@/redux/reviewApi/reviewApi";

import { useLocale, useTranslations } from "next-intl";
import Loading from "@/app/loading";
export default function ReviewForm({ product }) {
  const locale = useLocale();
  const t = useTranslations("customerReviews");

  const lang = locale === "ar" ? "ar" : "en";
  const { user } = useAppSelector((state) => state.user);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");

  const displayRating = hover || rating;
  const toastId = useRef<string | number | null>(null);

  const handleClick = (starValue) => {
    if (rating === starValue) {
      setRating(starValue - 0.5);
    } else if (rating === starValue - 0.5) {
      setRating(starValue);
    } else {
      setRating(starValue);
    }
  };
  const [createReview, { isLoading }] = useCreateReviewMutation();
  // console.log(product);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewPayload = {
      customer_id: user?.userId,
      purchase_item_id: product.id,
      review_message: message,
      star_number: rating,
    };

    try {
      await createReview(reviewPayload).unwrap();

      toastAlert(
        "success",
        "Your Review Submitted Successfully",
        "top-right",
        toastId
      );

      // ✅ Reset the form fields
      setMessage("");
      setRating(0);
      setHover(0);
    } catch (error) {
      toastAlert("error", "Failed to submit review", "top-right", toastId);
      console.error("Review submission error:", error);
    }
  };

  useEffect(() => {
    AOS.init({ offset: 120, duration: 2000, easing: "ease-out" });
  }, []);

  if (isLoading) return <Loading />;
  return (
    <div
      className="py-8 px-4"
      data-aos="fade-up"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4"
      >
        {/* Your form content here: textarea, stars, button */}
        <h2 className="text-xl font-semibold">{t("reviewTtile")}</h2>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {t("reviewIn")}
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {t("rating")}
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                filled={star <= displayRating}
                onClick={() => handleClick(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#ecbf4c] text-white py-2 rounded-lg transition"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}

function Star({ filled, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <svg
      className={`w-8 h-8 cursor-pointer transition ${
        filled ? "text-yellow-400" : "text-gray-300"
      }`}
      fill="currentColor"
      viewBox="0 0 20 20"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.286 3.959c.3.921-.755 1.688-1.54 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.784.57-1.838-.197-1.539-1.118l1.285-3.959a1 1 0 00-.364-1.118L2.07 9.386c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.951-.69l1.286-3.959z" />
    </svg>
  );
}
