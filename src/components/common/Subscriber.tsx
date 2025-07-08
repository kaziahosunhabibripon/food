"use client";

import { useState } from "react";
import toastAlert from "@/utils/toastConfig";
import { useCreateSubscriberMutation } from "@/redux/contactApi/contactApi";
import { useLocale, useTranslations } from "next-intl";

const Subscribe = () => {
  const locale = useLocale();
  const t = useTranslations("agree");

  const lang = locale === "ar" ? "ar" : "en";
  const [value, setValue] = useState("");
  const [agree, setAgree] = useState(false); // 👈 new state

  const [createSubscriber, { isLoading: subLoading }] =
    useCreateSubscriberMutation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value || !value.includes("@")) {
      toastAlert("error", "Please enter a valid email");
      return;
    }

    if (!agree) {
      toastAlert("error", "You must agree to the privacy policy.");
      return;
    }

    try {
      const res = await createSubscriber({ email: value }).unwrap();

      if (res?.status === false) {
        toastAlert("error", res?.message || "Subscription failed");
        return;
      }

      toastAlert("success", "Subscribed successfully!");
      setValue("");
      setAgree(false);
    } catch (error) {
      toastAlert("error", error?.data?.message || "Subscription failed.");
    }
  };

  return (
    <form
      onSubmit={handleSubscribe}
      className="space-y-4"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex w-full max-w-2xl mx-auto text-nowrap">
        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`flex-grow min-w-0 w-full lg:w-[500px] px-4 py-2 bg-gray-800 border border-gray-700 focus:outline-none ${
            locale === "ar" ? "rounded-r" : "rounded-l"
          }`}
          required
        />
        <button
          type="submit"
          disabled={subLoading}
          className={`bg-brand text-white px-4 py-2 hover:bg-orange-600 transition disabled:opacity-50 ${
            locale === "ar" ? "rounded-l" : "rounded-r"
          }`}
        >
          {t("subscribeButton")}
        </button>
      </div>

      {/* Privacy checkbox */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="privacy"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1.5"
        />
        <label htmlFor="privacy" className="text-sm text-white">
          {t("agreeText")}
        </label>
      </div>
    </form>
  );
};

export default Subscribe;
