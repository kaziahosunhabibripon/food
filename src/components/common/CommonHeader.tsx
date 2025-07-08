"use client";
import React, { memo, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const CommonHeader = ({
  title = "",
  subtitle = "",
  secondarySubTitle = "",
  componentTitle = "",
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const pathname = usePathname();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const breadCrumbTitle = title || "";
  const breadCrumbSubTitle = subtitle || "";

  // ✅ Local fallback images only
  let fallbackImage = "/assets/fallback.jpeg";
  if (pathname === "/about-us") {
    fallbackImage = "/assets/about.jpeg";
  } else if (pathname === "/all-products") {
    fallbackImage = "/assets/menu.jpeg";
  } else if (pathname === "/contact") {
    fallbackImage = "/assets/contact.jpeg";
  } else if (pathname === "/gallery") {
    fallbackImage = "/assets/gellery.jpeg";
  }

  return (
    <div className="relative h-[31rem] bg-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center h-full transition-transform duration-[3000ms] ease-in-out"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(17,17,17,0.7) 30%, rgba(17,17,17,0.9) 80%), url(${fallbackImage})`,
        }}
      />

      {/* Hero Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white">
        <div className="flex items-center justify-center">
          {isClient && (
            <>
              {/* Animated title */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                {breadCrumbTitle.split(" ").map((word, wordIndex) => (
                  <div key={`word-${wordIndex}`} className="flex">
                    {word.split("").map((letter, letterIndex) => (
                      <motion.span
                        key={`letter-${wordIndex}-${letterIndex}`}
                        className="text-white text-2xl md:text-7xl font-bold inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: (wordIndex * 6 + letterIndex) * 0.1,
                          ease: "easeOut",
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                ))}
              </div>

              <div className="w-1 md:w-3" />

              {/* Animated secondarySubTitle */}
              <div className="flex">
                {secondarySubTitle.split("").map((letter, index) => (
                  <motion.span
                    key={`sec-${index}`}
                    className="text-brand text-2xl md:text-7xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: breadCrumbTitle.length * 0.1 + index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              <div className="w-1 md:w-3" />

              {/* Animated subtitle */}
              <div className="flex">
                {breadCrumbSubTitle.split("").map((letter, index) => (
                  <motion.span
                    key={`sub-${index}`}
                    className="text-brand text-2xl md:text-7xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: breadCrumbTitle.length * 0.1 + index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Breadcrumb */}
        <motion.div
          className="mt-4 md:mt-8 text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay:
              (componentTitle?.length + breadCrumbSubTitle?.length) * 0.1 + 0.3,
          }}
        >
          <p className="flex items-center flex-wrap">
            <Link
              href="/"
              className="hover:text-brand text-white text-sm md:text-lg"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {t("companybrand.brandName")}
            </Link>
            <span className="mx-2">{">"}</span>
            <span className="text-brand font-semibold">{componentTitle}</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(CommonHeader);
