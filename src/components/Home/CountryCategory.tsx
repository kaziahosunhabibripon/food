/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import { useGetAllFoodsQuery } from "@/redux/apiSlice/apiSlice";
import { getImageUrl } from "@/utils/imageHelpers";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import Loading from "@/app/loading";

interface Country {
  id: string | number;
  name: string;
  arabic_name?: string;
  image: string;
}

interface CountryCategoryProps {
  onSelectCountry: (countryName: string) => void;
}

const CountryCategory: React.FC<CountryCategoryProps> = ({
  onSelectCountry,
}) => {
  // State to manage the selected country, default is set to "Arabic"
  const [selectedCountry, setSelectedCountry] = useState("Arabic");
  // Fetching all foods data using Redux query
  // This will be used to display the list of countries and their respective images
  const { data: foodsData, isLoading } = useGetAllFoodsQuery({});
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    AOS.init({ offset: 120, duration: 2000, easing: "ease-out" });
  }, []);

  useEffect(() => {
    if (foodsData?.group) {
      const hashCountry = window.location.hash.replace("#", "");
      if (hashCountry && hashCountry !== "countryFlags") {
        const country = foodsData.group.find(
          (c) => c.name.toLowerCase() === hashCountry.toLowerCase()
        );
        if (country) {
          handleCountrySelect(country);
        }
      }
    }
  }, [foodsData?.group]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country.name);
    onSelectCountry(country.name);
  };

  return (
    <div
      className="px-8 md:px-0 pt-16 pb-2 bg-[#f2f2f25b]"
      data-aos="fade-up"
      id="countryFlags"
    >
      <AppTitleHeader
        title={t("Country.title")}
        subtitle={t("Country.subtitle")}
        secondarySubTitle={t("Country.secondarySubTitle")}
      />

      {/* Mobile View */}
      <div className="flex items-center flex-row overflow-x-auto gap-4 rounded-md md:hidden lg:hidden">
        {/* Mobile View */}
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex items-center flex-row overflow-x-auto gap-4 rounded-md md:hidden lg:hidden">
            {foodsData?.group
              ?.slice()
              .reverse()
              .map((country: Country) => (
                <div
                  key={country.id}
                  className="w-[120px] cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out"
                  onClick={() => handleCountrySelect(country)}
                  data-country={country.name}
                >
                  <div
                    className={`${
                      selectedCountry === country.name
                        ? "border-2 shadow-2xl border-orange-500 bg-primary"
                        : "shadow-md"
                    } h-[120px] rounded-full flex flex-col justify-center items-center gap-1 p-4 hover:shadow-2xl`}
                  >
                    <Image
                      src={getImageUrl(country.image) || "/assets/arabia.png"}
                      alt={country.name}
                      width={150}
                      height={150}
                      loading="lazy"
                      className="w-36 h-32 object-cover rounded-full aspect-[4/3]"
                    />
                    <div className="w-full text-center">
                      <h3 className="mt-2 font-semibold text-[16px] text-border-dark first-letter:uppercase inline-block">
                        {locale === "ar"
                          ? country.arabic_name || country.name
                          : country.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Desktop View */}
      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:px-13 mx-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm animate-pulse flex flex-col items-center justify-center h-full"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full mb-4" />
              <div className="h-4 w-20 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      ) : (
        // Actual content
        <div className="hidden md:block lg:block">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:px-13 mx-auto">
            {foodsData?.group?.map((country: Country) => (
              <div
                key={country.id}
                role="button"
                tabIndex={0}
                onClick={() => handleCountrySelect(country)}
                className={`bg-white cursor-pointer flex rounded-lg p-6 flex-col items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 h-full
          ${
            selectedCountry === country.name
              ? "border-2 border-[#ecbf4c] shadow-2xl"
              : " hover:border-[#ecbf4c]"
          }`}
              >
                <div className="relative w-8 h-8">
                  <Image
                    src={getImageUrl(country.image)}
                    alt={country.name}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                <h3 className="text-gray-700 font-medium text-base 2xl:text-xl first-letter:uppercase mt-2">
                  {locale === "ar"
                    ? country.arabic_name || country.name
                    : country.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCategory;
