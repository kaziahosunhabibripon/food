"use client";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useGetAllBlogsQuery } from "@/redux/blogApi/blogApi";

export default function LatestPost() {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  // currently the blogs data is local hardcoded json data
  // in the future, you can fetch this data from an API or a database

  const { data: blogsData } = useGetAllBlogsQuery({});

  const baseurl = "https://rapiderp.excellency-catering-restaurant-sweets.com";
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center border-b border-gray-300 mb-8">
        <h2 className="text-xl font-bold text-gray-800 my-2">
          <span className="border-l-4 border-[#ecbf4c] pl-2">
            {lang === "ar" ? "المدونة" : "Blogs"}
          </span>
        </h2>
        <Link href="/blogs" className="text-sm text-[#ecbf4c] font-medium">
          {lang === "ar" ? "استكشف المزيد" : "Explore more"}
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Slider */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="w-full"
        >
          {blogsData?.list.map((blog) => (
            <SwiperSlide key={blog.id}>
              <div className="mx-auto ">
                <div className="w-full max-w-md  mx-auto  p-4">
                  <Image
                    src={`${baseurl}/${blog.photo}`}
                    alt={blog.title}
                    width={800}
                    height={800}
                    className="w-full  object-cover rounded"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Right Side - Blog List */}
        <div className="space-y-4">
          {blogsData?.list.map((blog) => (
            <div
              key={blog.id}
              className="flex justify-between items-center border shadow-emerald-200 border-slate-300 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex flex-col items-start justify-center">
                {/* <p className="text-xs text-gray-400 mb-1">{blog[lang].tag}</p> */}
                <h4 className="text-md font-semibold text-gray-800 mb-1">
                  {/* {blog[lang].title} */}
                  {blog.title}
                </h4>
                <Link
                  href={`/blogs/${blog.id}`}
                  className="text-[#ecbf4c] text-sm flex items-center gap-1"
                >
                  {lang === "ar" ? "اقرأ المزيد" : "Read more"}{" "}
                  <span className="text-lg">→</span>
                </Link>
              </div>
              <div className="w-20 h-14 relative flex-shrink-0">
                <Image
                  src={`${baseurl}/${blog.photo}`}
                  alt={blog.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
