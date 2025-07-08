import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  }),
  tagTypes: ["Blogs"],

  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => `/api/customer/blogs`,
      providesTags: ["Blogs"],
    }),
  }),
});

// Export the hooks
export const { useGetAllBlogsQuery } = blogApi;
