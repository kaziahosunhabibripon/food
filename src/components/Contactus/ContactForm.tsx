"use client";

import { useCreateContactMutation } from "@/redux/contactApi/contactApi";
import toastAlert from "@/utils/toastConfig";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const ContactForm = () => {
  const locale = useLocale();
  const t = useTranslations("contactForm");
  // data sending for contact form using redux toolkit mutation and query
  const lang = locale === "ar" ? "ar" : "en";
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
  });

  const [createContact, { isLoading }] = useCreateContactMutation();

  const handleInputChange = (field: string, value: string) => {
    // Example: special check for phone number
    if (field === "phoneNo") {
      const isValid = isValidPhoneNumber(value || "");
      console.log("Is phone valid:", isValid);

      setFormData((prev) => ({
        ...prev,
        [field]: value,
        isPhoneValid: isValid, // optional: store validity
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Contact API request:", formData);
      const result = await createContact(formData).unwrap();
      console.log("Contact API response:", result);
      toastAlert("success", "Message sent successfully!", "top-right");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        description: "",
      });
    } catch (error) {
      toastAlert(
        "error",
        error?.data?.message || "Failed to send message",
        "top-right"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <h2 className="text-2xl font-bold mb-6">
        {t("getIn")} <span className="text-brand">{t("touch")}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={t("firstName")}
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder={t("lastName")}
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="email"
          placeholder={t("email")}
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isLoading}
        />

        {/* Phone Input */}
        <PhoneInput
          international
          defaultCountry="AE"
          // Example: AE for Arabic locale, US otherwise
          placeholder={t("phone")}
          value={formData.phone}
          onChange={(value) => handleInputChange("phone", value || "")}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <textarea
        placeholder={t("message")}
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[150px]"
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand hover:bg-bgLight text-white py-3 px-6 rounded-md transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {locale === "ar" ? "إرسال" : "Submit"}
      </button>
    </form>
  );
};

export default ContactForm;
