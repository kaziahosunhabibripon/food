/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useEffect } from "react";
import { termsData } from "../../data/termsData";
import AOS from "aos";
import "aos/dist/aos.css";
import CommonHeader from "../common/CommonHeader";
import { useLocale } from "next-intl";

import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import { useTranslations } from "use-intl";
const TermsCondition = () => {
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
        title={t("terms.title")}
        subtitle={t("terms.subtitle")}
        componentTitle={t("terms.componentTitle")}
      />

      <section className="max-w-4xl mx-auto p-6" data-aos="fade-up">
        <AppTitleHeader
          title={t("terms.title")}
          subtitle={t("terms.subtitle")}
        />

        {termsData.map((section, index) => {
          const indexNumber = locale === "ar" ? toArabicNumerals(index) : index;

          return (
            <div key={section.number} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                {index === 0
                  ? section.title[locale]
                  : `${indexNumber}. ${section.title[locale]}`}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {section.text[locale]}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default TermsCondition;
