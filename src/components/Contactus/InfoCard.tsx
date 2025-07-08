"use client";
import { MapPin, Mail, Phone, Clock } from "react-feather";
import { useLocale } from "next-intl";
import { toArabicNumerals } from "@/helpers/ui/Arabic";

const iconMap = {
  location: MapPin,
  email: Mail,
  phone: Phone,
  clock: Clock,
};

const InfoCard = ({ type, title, description }) => {
  const Icon = iconMap[type] || null;
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";

  // Function to convert any numbers in the string to Arabic numerals
  const convertTitleNumbers = (str) => {
    if (lang === "ar") {
      // This simple regex finds digits and converts them
      return str.replace(/\d+/g, (num) => toArabicNumerals(Number(num)));
    }
    return str;
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg border border-red-200 opacity-80 transform transition duration-300 ease-in-out hover:opacity-100 hover:-translate-y-2 cursor-pointer text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
        {Icon && <Icon className="w-10 h-10 text-brand" />}
      </div>
      <h3 className="text-16 font-semibold mb-2">
        {convertTitleNumbers(title)}
      </h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default InfoCard;
