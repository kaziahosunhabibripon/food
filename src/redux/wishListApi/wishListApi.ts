import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const wishListApi = createApi({
  reducerPath: "wishListApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  }),
  tagTypes: ["Wish"],
  endpoints: (builder) => ({
    createWishList: builder.mutation({
      query: (data) => ({
        url: "/api/customer/wishlist",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wish"],
    }),
    getWishList: builder.query({
      query: (data) => ({
        url: "/api/customer/wishlist/all",
        method: "POST",
        body: data,
      }),
      providesTags: ["Wish"],
    }),
  }),
});

export const { useCreateWishListMutation, useGetWishListQuery } = wishListApi;
