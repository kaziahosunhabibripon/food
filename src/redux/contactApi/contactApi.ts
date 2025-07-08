import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  }),
  tagTypes: ["Contact"],

  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (data) => {
        console.log("🚀 ~ createContact data:", data);
        return {
          url: "/api/customer/contact-send",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Contact"],
    }),
    createSubscriber: builder.mutation({
      query: (data) => {
        console.log("🚀 ~ create Subscriber data:", data);
        return {
          url: "/api/customer/subscribe-send",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const { useCreateContactMutation, useCreateSubscriberMutation } =
  contactApi;
