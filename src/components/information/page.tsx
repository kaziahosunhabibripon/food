"use client";

import { useLocale } from "next-intl";
import { contactInfoData } from "@/data/contactInfoData";
import InfoCard from "../Contactus/InfoCard";
import AppTitleHeader from "@/helpers/ui/AppTitleHeader";

export default function Information() {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  // data is local components json file for contact information but can be dynamically fetched from an API using redux toolkit query
  return (
    <section
      className="py-16 sm:px-6 lg:px-8 bg-gray-50"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto ">
        <AppTitleHeader
          title={lang === "ar" ? "معلومات" : "Our"}
          subtitle={lang === "ar" ? "الاتصال" : "Contact"}
          secondarySubTitle={lang === "ar" ? "معلومات" : "Information"}
        />
        <div className="container mx-auto my-8 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfoData?.map((card, index) => (
              <InfoCard
                key={index}
                type={card.type}
                title={card.title[lang]}
                description={card.description[lang]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
