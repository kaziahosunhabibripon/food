import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  }),
  tagTypes: ["Review"],

  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => {
        console.log("🚀 ~ Create Review Post:", data);
        return {
          url: "/api/customer/customer-review/save",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Review"],
    }),
    getAllReviews: builder.query({
      query: () => "/api/customer/customer-review/list",
      providesTags: ["Review"],
    }),
  }),
});

export const { useCreateReviewMutation, useGetAllReviewsQuery } = reviewApi;
