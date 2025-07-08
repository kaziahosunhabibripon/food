import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reserveApi = createApi({
  reducerPath: "reserveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  }),
  tagTypes: ["Reserve"],

  endpoints: (builder) => ({
    createReserve: builder.mutation({
      query: (data) => {
        console.log("🚀 ~ create Reserve data:", data);
        return {
          url: "/api/customer/reservation-save",

          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Reserve"],
    }),
  }),
});

// Export the hooks
export const { useCreateReserveMutation } = reserveApi;
