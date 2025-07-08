"use client";

import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { useGetAllFoodsQuery } from "@/redux/apiSlice/apiSlice";

import { getImageUrl } from "@/utils/imageHelpers";
import Link from "next/link";

import { ShoppingCart } from "react-feather";
import Loading from "@/app/loading";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
const ALLOWED_COUNTRIES = ["Bangladesh", "Indian", "Pakistan", "Arabic"];
export default function TopSelling() {
  const router = useRouter();
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const t = useTranslations();

  // Fetching all foods data using Redux query
  const { data: foodsData, isLoading } = useGetAllFoodsQuery({});
  // console.log(foodsData?.items);
  const [selectedCountry, setSelectedCountry] = useState<string>("Arabic");

  // Filter allowed groups
  const filteredGroups = useMemo(() => {
    return foodsData?.group?.filter((group) =>
      ALLOWED_COUNTRIES.includes(group.name)
    );
  }, [foodsData]);

  // Filter items by selected group(s)
  const filteredItems = useMemo(() => {
    if (!foodsData?.items || !filteredGroups) return [];

    const targetGroupIds =
      selectedCountry === "All"
        ? filteredGroups.map((g) => g.id)
        : filteredGroups
            .filter((g) => g.name === selectedCountry)
            .map((g) => g.id);

    return foodsData.items
      .filter((item) => targetGroupIds.includes(item.purchase_group_id))
      .slice(0, 5); // Limit to 5 items
  }, [foodsData, selectedCountry, filteredGroups]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className="w-full py-12 px-4 md:px-6 container mx-auto"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <AppTitleHeader
        title={t("Topselling.title")}
        subtitle={t("Topselling.subtitle")}
        secondarySubTitle={t("Topselling.secondarySubTitle")}
      />

      {/* Filter */}
      <div className="flex items-center justify-between border-b border-[#ecbf4c] mb-8">
        <h1 className="text-3xl font-bold text-gray-600 mb-2">
          {t("Topselling.dialog")}
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-4 py-1 rounded-md border text-sm transition cursor-pointer ${
              selectedCountry === "All"
                ? "bg-[#ecbf4c] text-white border-[#ecbf4c]"
                : "border-[#ecbf4c] text-gray-600 hover:bg-[#ecbf4c] hover:text-white"
            }`}
            onClick={() => {
              router.push("/");
            }}
          >
            {t("All.title")}
          </button>
          {filteredGroups?.map((group) => (
            <button
              key={group.id}
              className={`px-4 py-1 rounded-md border text-sm transition cursor-pointer ${
                selectedCountry === group.name
                  ? "bg-[#ecbf4c] text-white border-[#ecbf4c]"
                  : "border-[#ecbf4c] text-gray-600 hover:bg-[#ecbf4c] hover:text-white"
              }`}
              onClick={() => setSelectedCountry(group.name)}
            >
              {locale === "ar" ? group.arabic_name : group.name}
            </button>
          ))}
        </div>
      </div>

      {/* Swiper Cards */}
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={true}
        spaceBetween={20}
        grabCursor={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          468: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {filteredItems.map((item) => {
          return (
            <SwiperSlide key={item.id}>
              <div className="group block p-3 rounded-xl bg-white transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Link href={`/product/${item.id}`} passHref>
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                      <div className="w-full bg-[#ecbf4c] text-white py-2 font-semibold shadow-md hover:bg-[#ecbf4c] flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        {t("product.addToCart")}
                      </div>
                    </div>
                  </Link>
                </div>

                <div
                  className={`mt-4 flex ${
                    item?.offerPrice >= 0 ? "flex-col" : "flex-row"
                  } items-start justify-between px-2`}
                >
                  <h3 className="text-lg flex font-normal text-[#ecbf4c]">
                    {lang === "ar" ? item.arabic_name : item.name}
                  </h3>
                  <div
                    className={` flex text-[#ecbf4c] ${
                      item?.offerPrice >= 0 ? "flex-row " : "flex-col"
                    } items-start justify-between px-2`}
                  >
                    {item?.offer_price > 0 && (
                      <span className="text-gray-500 line-through">
                        {t("hurryUp.currency")}{" "}
                        {locale === "ar"
                          ? toArabicNumerals(Math.round(item.price))
                          : Math.round(item.price)}
                      </span>
                    )}
                    <span className="font-semibold">
                      {t("hurryUp.currency")}{" "}
                      {locale === "ar"
                        ? toArabicNumerals(Math.round(item?.final_price))
                        : Math.round(item?.final_price)}
                    </span>

                    {/* {t("hurryUp.currency")}{" "}
                    {locale === "ar"
                      ? toArabicNumerals(item.price)
                      : item.price} */}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
