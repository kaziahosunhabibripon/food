"use client";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck

import { useEffect } from "react";
import { ArrowDown } from "react-feather";
import { useLocale, useTranslations } from "next-intl";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// banner images currently static, can be replaced with dynamic images later
// import { useGetBannerQuery } from "@/redux/apiSlice/apiSlice";
// baneer images can be fetched from an API is made dynamic
// for performance issue is closed for now
const backgroundImages = [
  "/assets/fish.jpg",
  "/assets/mutton.jpg",
  "/assets/gallery.jpeg",
];

const Hero = () => {
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    AOS.init({ offset: 120, duration: 5000, easing: "ease-out" });
  }, []);

  return (
    <div
      className="relative h-screen overflow-hidden"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Background slider */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 10000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
          style={{ height: "100%" }}
        >
          {backgroundImages.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`}>
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat "
                style={{
                  backgroundImage: `url(${image})`,
                  height: "100vh",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Text & Buttons Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center h-full text-center text-slate-100 px-4">
        <p className="text-16 mb-4 hidden font-semibold md:block">
          {t("Hero.welcome")}{" "}
          <span className="text-brand">{t("Hero.second")}</span>
        </p>
        <h1
          className="text-5xl md:text-7xl font-serif max-w-5xl mb-6"
          data-aos="fade-up"
        >
          {t("Hero.headline")}
        </h1>
        <p className="text-xl mb-8" data-aos="fade-up">
          {t("Hero.subline")} <span>{t("Hero.smile")}</span>
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            data-aos="fade-up"
            onClick={() =>
              document
                .getElementById("countryFlags")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-brand text-slate-100 px-8 py-3 hover:bg-brand-dark transition-colors flex items-center gap-2 rounded"
          >
            <ArrowDown className="animate-float-item-one" />
            <span className="uppercase">{t("Hero.button")}</span>
          </button>
          {/* <button
            data-aos="fade-up"
            onClick={() => setIsOpen(true)}
            className="bg-brand text-slate-100 px-8 py-3 hover:bg-brand-dark transition-colors flex items-center gap-2 rounded"
          >
            <ArrowUp className="animate-float-item-one" />
            <span className="uppercase">{t("Hero.watch")}</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
