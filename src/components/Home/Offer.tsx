"use client";
import Loading from "@/app/loading";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import { useGetOfferedFoodQuery } from "@/redux/apiSlice/apiSlice";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export default function Offer() {
  const t = useTranslations();
  // Fetching the offered food data using a redux query hook
  const { data: offerData, isLoading } = useGetOfferedFoodQuery({});
  const locale = useLocale();
  const offerItem = offerData?.items?.[0];
  const imageUrl = offerItem?.image_url || "/images/default-offer.jpg";

  return (
    <div className="w-full container mx-auto py-12">
      <div className="relative bg-yellow-100/50 rounded-lg overflow-hidden p-6 md:p-10 flex flex-col md:flex-row items-center justify-between">
        {/* Left content */}
        <div className="z-10 mb-8 md:mb-0 md:w-1/2">
          <p className="text-brand font-semibold text-base mb-2 uppercase">
            {t("offer.type")}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
            {locale === "ar"
              ? toArabicNumerals(t("offer.amount"))
              : t("offer.amount")}
            <br className="hidden sm:block" /> {t("offer.items")}
          </h2>
        </div>

        {/* Right content - Product image */}
        <div className="flex items-center justify-center md:justify-end w-full md:w-1/2">
          <div className="relative h-[180px] md:h-[250px] w-[360px] md:w-[550px] my-4 flex items-center justify-center">
            {isLoading ? (
              <Loading />
            ) : (
              <Image
                src={imageUrl}
                alt={offerItem?.name || t("offer.imageAlt")}
                width={300}
                height={300}
                className="rounded-full object-contain animate-float-item-one"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
