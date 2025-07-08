/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck

"use client";
import React, { useEffect } from "react";
import CommonHeader from "../common/CommonHeader";
import { useLocale } from "next-intl";
import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import { privacyData } from "../../data/privacyData";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { useTranslations } from "use-intl";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
const PrivacyPolicy = () => {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const t = useTranslations();
  useEffect(() => {
    AOS.init({ offset: 120, duration: 2000, easing: "ease-out" });
  }, []);
  return (
    <div
      className="min-h-screen bg-gray-50 overflow-x-hidden"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <CommonHeader
        title={t("privacy.title")}
        subtitle={t("privacy.subtitle")}
        componentTitle={t("privacy.componentTitle")}
      />
      <section className="max-w-4xl mx-auto p-6" data-aos="fade-up">
        <AppTitleHeader
          title={t("privacy.title")}
          subtitle={t("privacy.subtitle")}
        />

        {privacyData.map((section, index) => (
          <div key={section.number} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {index === 0
                ? section.title[locale]
                : `${locale === "ar" ? toArabicNumerals(index) : index}. ${
                    section.title[locale]
                  }`}
            </h2>

            <p className="text-gray-700 whitespace-pre-line">
              {section.text[locale]}
            </p>

            {/* Render subsections if available */}
            {section.subsections &&
              section.subsections.map((sub) => (
                <div key={sub.number} className="ml-4 mt-2">
                  <h3 className="text-lg font-medium">
                    {`${
                      locale === "ar"
                        ? toArabicNumerals(sub.number)
                        : sub.number
                    } ${sub.title[locale]}`}
                  </h3>

                  {sub.text && (
                    <p className="text-gray-700 whitespace-pre-line">
                      {sub.text[locale]}
                    </p>
                  )}
                </div>
              ))}

            {/* Render email and address if present */}
            {section.email && (
              <div className="flex items-center mt-2 space-x-2 text-black/85">
                <MdEmail className="text-xl" />
                <a
                  href={`mailto:${section.email}`}
                  className="underline hover:text-brand"
                >
                  {section.email}
                </a>
              </div>
            )}
            {section.address && (
              <div className="flex items-center mt-1 space-x-2 text-brand">
                <MdLocationOn className="text-xl" />
                <span>
                  {typeof section.address === "object"
                    ? section.address[locale]
                    : section.address}
                </span>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default PrivacyPolicy;
