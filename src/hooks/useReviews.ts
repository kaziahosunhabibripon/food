// hooks/useReviews.ts
import {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
} from "@/redux/reviewApi/reviewApi";
import { useRef } from "react";
import toastAlert from "@/utils/toastConfig";

export const useReviews = () => {
  const {
    data: reviews,
    isLoading: loadingReviews,
    refetch,
  } = useGetAllReviewsQuery({});
  const [createReview, { isLoading: creating }] = useCreateReviewMutation();

  const toastId = useRef<string | number | null>(null);

  const submitReview = async ({
    customer_id,
    purchase_item_id,
    review_message,
    star_number,
  }: {
    customer_id: string;
    purchase_item_id: string;
    review_message: string;
    star_number: string;
  }) => {
    try {
      await createReview({
        customer_id,
        purchase_item_id,
        review_message,
        star_number,
      }).unwrap();

      toastAlert(
        "success",
        "Your Review Submitted Successfully",
        "top-right",
        toastId
      );
      refetch();
    } catch (error) {
      console.log(error);
      toastAlert("error", "Failed to submit review", "top-right", toastId);
    }
  };

  return {
    reviews: reviews?.list || [],
    loadingReviews,
    creating,
    submitReview,
  };
};
