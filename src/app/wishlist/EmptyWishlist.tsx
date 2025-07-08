"use client";

import AppSpinner from "@/helpers/ui/AppSpinner";
import { useLocale, useTranslations } from "next-intl";

const EmptyWishlist = () => {
  const locale = useLocale();
  const t = useTranslations("wishList");
  const lang = locale === "ar" ? "ar" : "en";
  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white"
    >
      <AppSpinner clsname="" />
      <h2 className="text-xl font-semibold mt-4 text-gray-600">{t("no")}</h2>
    </div>
  );
};

export default EmptyWishlist;
