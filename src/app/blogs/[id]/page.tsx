"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useGetAllBlogsQuery } from "@/redux/blogApi/blogApi";
import Loading from "@/app/loading";
import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import CommonHeader from "@/components/common/CommonHeader";
import AOS from "aos";
import "aos/dist/aos.css";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
export default function SingleBlogs() {
  const { id } = useParams();
  const { data: blogsData, isLoading } = useGetAllBlogsQuery({});
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const baseurl = "https://rapiderp.excellency-catering-restaurant-sweets.com";

  const blog = blogsData?.list.find((b) => String(b.id) === String(id));

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
        title={lang === "ar" ? "مقال" : "Single"}
        subtitle={lang === "ar" ? "المدونة" : "Blogs"}
        componentTitle={lang === "ar" ? "تفاصيل المدونة" : "Single Blogs"}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto" data-aos="fade-up">
          <AppTitleHeader
            title={lang === "ar" ? "مقال" : "Single"}
            subtitle={lang === "ar" ? "المدونة" : "Blogs"}
          />

          <div className="max-w-7xl mx-auto p-6 rounded-2xl shadow-md">
            <h1 className="text-3xl font-bold py-2 text-center">
              {lang === "ar" ? blog.title_ar : blog.title}
            </h1>
            <div className="w-full h-64 overflow-hidden rounded-xl my-2">
              <Image
                src={`${baseurl}/${blog.photo}`}
                alt={lang === "ar" ? blog.title_ar : blog.title}
                width={800}
                height={800}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-xl"
              />
            </div>

            <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg mb-6">
              {lang === "ar" ? blog.description_ar : blog.description}
            </p>

            <p className="text-sm text-gray-500 italic mb-8">
              {lang === "ar" ? "تاريخ النشر" : "Published on"}:{" "}
              {locale === "ar"
                ? toArabicNumerals(blog.issue_date)
                : blog.issue_date}
            </p>

            <Link
              href="/blogs"
              className="inline-block px-6 py-2 bg-[#ecbf4c] text-white font-semibold rounded-lg shadow hover:bg-[#d9a83c] transition-colors"
            >
              {lang === "ar" ? "العودة إلى المدونة" : "Back to Blogs"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
