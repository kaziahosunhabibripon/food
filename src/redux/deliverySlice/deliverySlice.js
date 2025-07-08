import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  }),
  tagTypes: ["Delivery"],
  endpoints: (builder) => ({
    getDeliveryDistance: builder.mutation({
      queryFn: async (address) => {
        try {
          // 1. Geocode the address with OpenStreetMap
          const geoResponse = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
              params: {
                q: address,
                format: "json",
                limit: 1,
              },
            }
          );

          if (!geoResponse.data.length) {
            throw new Error("Address not found");
          }

          const { lat, lon } = geoResponse.data[0];

          // 2. Call your backend API with lat & lon
          const distanceResponse = await axios.get(
            `/api/customer/map-distance-calculator`,
            {
              baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
              params: {
                latitude: lat,
                longitude: lon,
              },
            }
          );

          return {
            data: {
              ...distanceResponse.data,
              latitude: lat,
              longitude: lon,
            },
          };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
    }),
  }),
});

export const { useGetDeliveryDistanceMutation } = locationApi;
