import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const messageLoaders = {
  en: () => import("../messages/en.json"),
  ar: () => import("../messages/ar.json"),
};

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get("MYNEXTAPP_LOCALE")?.value || "en";

  const locale = cookieLocale in messageLoaders ? cookieLocale : "en";

  let messages;
  try {
    messages = (await messageLoaders[locale]()).default;
  } catch (error) {
    console.error(
      `Failed to load messages for locale "${locale}", falling back to "en".`,
      error
    );
    messages = (await messageLoaders["en"]()).default;
  }

  return {
    locale,
    messages,
  };
});
