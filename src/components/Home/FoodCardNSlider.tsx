"use client";

import React, { memo, useEffect, useMemo, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import NoDataFoundIcon from "@/helpers/ui/customSvg/NoDataFoundIcon";
import ProductCard from "../SingleFood/ProductCard";
import { useAppSelector } from "@/redux/hooks/hooks";
import { FoodItem } from "@/types/types";
import { FoodGroup } from "@/types/GroupFoodTypes";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Loading from "@/app/loading";

const FoodCardNSlider = ({
  group,
  items,
  isLoading,
}: {
  group: FoodGroup;
  items: FoodItem[];
  isLoading?: boolean;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { modalProps, selectedSearchData } = useAppSelector(
    (state) => state.app
  );
  const t = useTranslations();
  const locale = useLocale();

  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  // Changed this from useState to useRef to fix infinite render loop
  const swiperInstanceRef = useRef(null);

  // Initialize active category
  useEffect(() => {
    if (group?.categories && group.categories.length > 0) {
      const defaultCat =
        group.categories.find(
          (cat) => cat.name.trim().toLowerCase() === "set menu"
        ) || group.categories[0];
      setActiveMainCategory(defaultCat);
      setActiveSubCategory(null);
    }
  }, [group]);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (!activeMainCategory) return items;

    return items.filter((item) => {
      if (activeSubCategory) {
        return item.purchase_sub_category_id === activeSubCategory.id;
      }
      return item.purchase_category_id === activeMainCategory.id;
    });
  }, [items, activeMainCategory, activeSubCategory]);

  const handleMainCategoryChange = (mainCat) => {
    setActiveMainCategory(mainCat);
    setActiveSubCategory(null);
    sliderRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const handleSubCategoryChange = (subCat) => {
    setActiveSubCategory(subCat);
    sliderRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const handleRedirect = (params) => {
    router.push(`/product/${params?.id}`);
  };

  const getDisplayName = (item) =>
    locale === "ar" ? item.arabic_name || item.name : item.name;

  // Scroll to section based on app state
  useEffect(() => {
    if (
      selectedSearchData &&
      activeMainCategory &&
      selectedSearchData?.purchase_category_id === activeMainCategory?.id
    ) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSearchData, activeMainCategory]);

  useEffect(() => {
    if (modalProps?.id === group?.id && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [modalProps, group]);

  const handleMouseEnter = () => swiperInstanceRef.current?.autoplay?.stop();
  const handleMouseLeave = () => swiperInstanceRef.current?.autoplay?.start();

  const swiperModules = useMemo(() => [Autoplay, Navigation], []);
  const swiperAutoplay = useMemo(
    () => ({ delay: 100000, disableOnInteraction: false }),
    []
  );

  return (
    <div className="h-full w-full py-8" ref={sectionRef}>
      <AppTitleHeader
        title={getDisplayName(group)}
        secondaryTitle={t("food.secondaryTitle")}
      />

      {/* Main Categories */}
      <div className="flex md:justify-center mx-4 gap-4 overflow-x-auto pb-2">
        {group?.categories?.map((mainCat) => (
          <button
            key={mainCat.id}
            onClick={() => handleMainCategoryChange(mainCat)}
            className={`relative text-base 2xl:text-xl font-semibold pb-2 whitespace-nowrap ${
              activeMainCategory?.id === mainCat.id
                ? "text-brand"
                : "text-gray-600"
            }`}
          >
            {getDisplayName(mainCat)}
            {activeMainCategory?.id === mainCat.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
            )}
          </button>
        ))}
      </div>

      {/* Sub Categories */}
      {activeMainCategory?.sub_categories?.length > 0 && (
        <div className="flex md:justify-center mx-4 gap-4 overflow-x-auto pb-2">
          <button
            onClick={() => handleSubCategoryChange(null)}
            className={`relative text-base 2xl:text-xl font-semibold pb-2 whitespace-nowrap ${
              !activeSubCategory ? "text-brand" : "text-gray-600"
            }`}
          >
            All
            {!activeSubCategory && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
            )}
          </button>
          {activeMainCategory.sub_categories.map((subCat) => (
            <button
              key={subCat.id}
              onClick={() => handleSubCategoryChange(subCat)}
              className={`relative text-base 2xl:text-xl font-semibold pb-2 whitespace-nowrap ${
                activeSubCategory?.id === subCat.id
                  ? "text-brand"
                  : "text-gray-600"
              }`}
            >
              {getDisplayName(subCat)}
              {activeSubCategory?.id === subCat.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Product List */}
      <div className="px-4 md:px-12">
        {isLoading ? (
          <Loading />
        ) : filteredItems.length > 0 ? (
          <Swiper
            modules={swiperModules}
            autoplay={swiperAutoplay}
            navigation={true}
            grabCursor={true}
            onSwiper={(swiper) => {
              swiperInstanceRef.current = swiper;
            }}
            className="foodCard"
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 10 },
              468: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 4, spaceBetween: 10 },
            }}
          >
            {filteredItems.map((item) => (
              <SwiperSlide
                key={item.id}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <ProductCard
                  data={item}
                  customClasses="w-[400px] h-[300px]"
                  callback={() => handleRedirect(item)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <div className="flex flex-col items-center gap-4">
              <NoDataFoundIcon />
              <p className="font-medium first-letter:uppercase lowercase">
                {t("Topselling.noItems")}
                {activeSubCategory && (
                  <>
                    {t("Topselling.for")}
                    <span className="text-brand font-medium">
                      {getDisplayName(activeSubCategory)}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(FoodCardNSlider);
