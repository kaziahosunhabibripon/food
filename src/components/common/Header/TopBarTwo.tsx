"use client";
import { MapPin } from "react-feather";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/Language/page";

const TopBarTwo = () => {
  // const { data: socialMedia, isLoading } = useGetSocialMediaQuery({});
  // t for translations using next-intl
  const t = useTranslations();

  return (
    <div className="bg-black/80 text-white py-2 px-4">
      <div className="container mx-auto flex-col md:flex-row flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-12">{t("Topbar.location")}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* {socialMedia?.list
              ?.filter(({ index_name, title_value }) => {
                return index_name?.trim() && title_value?.trim();
              })
              .slice(0, 2)
              .map(({ id, index_name, title, title_value }, index) => {
                const safeIndexName = index_name.trim().toLowerCase();
                const safeUrl = title_value.trim();

                return (
                  <span
                    key={id || index}
                    className="w-4 h-4 flex items-center justify-center rounded"
                    suppressHydrationWarning
                  >
                    <SocialIconLink
                      indexName={safeIndexName}
                      label={title || safeIndexName}
                      url={safeUrl}
                    />
                  </span>
                );
              })}

            <span className="text-sm">{t("Topbar.followUs")}</span> */}
            <>
              <LanguageSwitcher />
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarTwo;
