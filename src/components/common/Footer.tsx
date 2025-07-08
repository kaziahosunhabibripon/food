"use client";
import React, { useEffect, useState } from "react";
import { navData } from "@/data/navData";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { scrollToCountry } from "@/utils/scroll";
import { countries } from "../../data/ProductData";
import { useGetSocialMediaQuery } from "@/redux/apiSlice/apiSlice";
import Loading from "@/app/loading";
import SocialIconLink from "@/helpers/ui/FontAwesome";
import Subscribe from "./Subscriber";

interface CountryData {
  group: {
    id: number;
    en: string;
    ar: string;
  }[];
}

const Footer = () => {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const t = useTranslations();

  const [countryData, setCountryData] = useState<CountryData | null>(null);

  // Fetch social media data from the API
  const { data: socialMedia, isLoading } = useGetSocialMediaQuery({});
  const selectedItems = socialMedia?.list?.filter((_, index) =>
    [1, 2, 3, 11].includes(index)
  );

  useEffect(() => {
    setCountryData({ group: countries });
  }, []);

  const handleCountryClick = (countryName: string, e: React.MouseEvent) => {
    e.preventDefault();
    scrollToCountry(countryName);
  };

  return (
    <footer
      className={`bg-brand-secondary px-4 text-white relative ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
    >
      {/* Main Footer */}
      <div className="max-w-7xl container   mx-auto px-4 py-16">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ${
            lang === "ar" ? "rtl" : ""
          }`}
        >
          {/* Logo & Description */}
          <div>
            <Image
              src={"/assets/logo-1.png"}
              alt="Fodis Logo"
              width={800}
              height={800}
              className="w-28 h-24 mb-6 object-contain"
            />
            <p className="text-gray-400 mb-6">{t("footer.description")}</p>

            <div className="flex gap-4">
              {isLoading ? (
                <Loading />
              ) : (
                selectedItems
                  ?.filter(
                    (item) =>
                      item?.title_value &&
                      typeof item.title_value === "string" &&
                      item.title_value.startsWith("http") // ensures it's a valid link
                  )
                  .map(({ id, title_value, index_name, title }) => {
                    const trimmedIndex =
                      index_name?.trim().toLowerCase() || "facebook";

                    return (
                      <div
                        key={id}
                        className="w-8 h-8 flex items-center justify-center rounded  transition-colors"
                      >
                        <SocialIconLink
                          indexName={trimmedIndex}
                          label={title}
                          url={title_value}
                        />
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              {navData.slice(1, 6).map((item) => {
                const label = lang === "ar" ? item.labelAr : item.labelEn;
                const parts = label.split("\n");

                return (
                  <li key={item.id}>
                    <Link
                      href={item.link}
                      className="text-gray-400 hover:text-[#ff6b2c] transition-colors"
                    >
                      {parts.map((part, i) => (
                        <React.Fragment key={i}>
                          {part}
                          {i !== parts.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Groups */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t("footer.groups")}</h3>
            {countryData?.group?.length ? (
              (() => {
                const half = Math.ceil(countryData.group.length / 2);
                const firstHalf = countryData.group.slice(0, half);
                const secondHalf = countryData.group.slice(half);

                return (
                  <div className="flex gap-8">
                    <ul className="space-y-3 flex-1">
                      {firstHalf.map((item) => (
                        <li key={item.id}>
                          <a
                            href="#countryFlags"
                            className="text-gray-400 hover:text-[#ff6b2c] transition-colors cursor-pointer"
                            onClick={(e) =>
                              handleCountryClick(
                                lang === "ar" ? item.ar : item.en,
                                e
                              )
                            }
                          >
                            {lang === "ar" ? item.ar : item.en}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-3 flex-1">
                      {secondHalf.map((item) => (
                        <li key={item.id}>
                          <a
                            href="#countryFlags"
                            className="text-gray-400 hover:text-[#ff6b2c] transition-colors cursor-pointer"
                            onClick={(e) =>
                              handleCountryClick(
                                lang === "ar" ? item.ar : item.en,
                                e
                              )
                            }
                          >
                            {lang === "ar" ? item.ar : item.en}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()
            ) : (
              <p className="text-gray-500">{t("footer.noGroups")}</p>
            )}
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-6">
              {t("footer.contactUs")}
            </h3>
            <div className="space-y-4">
              <div className="text-gray-400">
                <div>{t("footer.workinghour")}</div>
              </div>
              <div className="space-y-4">
                <Subscribe />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div
            className={`flex flex-col md:flex-row justify-between items-center gap-4 ${
              lang === "ar" ? "rtl" : ""
            }`}
          >
            <div className="md:pl-4 text-right">
              <p className="text-gray-400 text-sm ">
                {t("footer.developedBy")}{" "}
                <Link
                  href="https://rapidsmarterp.com/"
                  className="hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("footer.rapid")}
                </Link>
              </p>
            </div>
            <div className="text-gray-400 text-sm text-center">
              {t("footer.copyright")}
            </div>
            <div className="flex gap-4 text-sm">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-[#ff6b2c] transition-colors"
              >
                {t("footer.terms")}
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-[#ff6b2c] transition-colors"
              >
                {t("footer.privacy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
