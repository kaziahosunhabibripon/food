"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useGetAllBlogsQuery } from "@/redux/blogApi/blogApi";
import Loading from "@/app/loading";
import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import CommonHeader from "@/components/common/CommonHeader";
import AOS from "aos";
import "aos/dist/aos.css";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
export default function Blogs() {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const { data: blogsData, isLoading } = useGetAllBlogsQuery({});
  const baseurl = "https://rapiderp.excellency-catering-restaurant-sweets.com";
  useEffect(() => {
    AOS.init({ offset: 120, duration: 2000, easing: "ease-out" });
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div
      className="min-h-screen bg-gray-50 overflow-x-hidden"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <CommonHeader
        title={lang === "ar" ? "الكل" : "All"}
        subtitle={lang === "ar" ? "المدونة" : "Blogs"}
        componentTitle={lang === "ar" ? "كل المدونات" : "All Blogs"}
      />

      <div className="container mx-auto px-4 py-12">
        <AppTitleHeader
          title={lang === "ar" ? "الكل" : "All"}
          subtitle={lang === "ar" ? "المدونة" : "Blogs"}
        />

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 p-4">
          {blogsData?.list?.map((blog) => (
            <div
              data-aos="fade-up"
              key={blog.id}
              className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col bg-white"
            >
              {/* Image */}
              <div className="w-full h-56 overflow-hidden">
                <Image
                  src={`${baseurl}/${blog.photo}`}
                  alt={lang === "ar" ? blog.title_ar : blog.title}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">
                  {lang === "ar" ? toArabicNumerals(blog.title_ar) : blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {lang === "ar" ? blog.description_ar : blog.description}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  {lang === "ar" ? "تاريخ النشر" : "Published on"}:{" "}
                  {locale === "ar"
                    ? toArabicNumerals(blog.issue_date)
                    : blog.issue_date}
                </p>

                <Link
                  href={`/blogs/${blog.id}`}
                  className="mt-auto inline-block text-[#ecbf4c] text-sm font-semibold hover:underline"
                >
                  {lang === "ar" ? "اقرأ المزيد" : "Read more"} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
