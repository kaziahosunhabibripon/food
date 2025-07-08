"use client";

import Subscribe from "../common/Subscriber";

import { useLocale, useTranslations } from "next-intl";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
const SubscribeUs = () => {
  const locale = useLocale();
  const t = useTranslations("subscribe");

  const lang = locale === "ar" ? "ar" : "en";
  // subscribe component for newsletter subscription
  // using redux toolkit mutation and query
  return (
    <div
      className="bg-black/85 text-brand my-8 py-12 shadow-lg"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-[7fr_3fr] items-center gap-6">
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-4">
          <div className="bg-[#ecbf4c] p-2 rounded">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2 4h20v16H2V4zm2 2v.01L12 13l8-6.99V6H4zm0 12h16V8l-8 7-8-7v10z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {locale === "ar" ? toArabicNumerals(t("title")) : t("title")}
            </h3>
            <p className="text-sm text-white">{t("subtitle")}</p>
          </div>
        </div>

        {/* Right: Email input form */}
        <div>
          <Subscribe />
        </div>
      </div>
    </div>
  );
};

export default SubscribeUs;
