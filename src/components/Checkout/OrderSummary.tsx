import { useMemo } from "react";
import Image from "next/image";
import { alterCardImage } from "@/utils/appHelpers";
import { useAppSelector } from "@/redux/hooks/hooks";
import { useLocale, useTranslations } from "use-intl";
import { toArabicNumerals } from "@/helpers/ui/Arabic";

const OrderSummary = () => {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  // order summary component for checkout page
  // information about the order items, total amount, and coupon code from database using API
  // from redux toolkit query and mutation
  // redux states
  //to convert numbers to arabic numerals used arabic helper function
  const { checkoutCartItem } = useAppSelector((state) => state.cart);
  // console.log(checkoutCartItem);
  const totalAmount = useMemo(() => {
    if (!Array.isArray(checkoutCartItem)) {
      console.warn("checkoutCartItem is not an array:", checkoutCartItem);
      return 0;
    }
    return checkoutCartItem.reduce(
      (sum, item) =>
        sum + (parseFloat(item?.final_price) || 0) * (item?.quantity ?? 0),
      0
    );
  }, [checkoutCartItem]);
  console.log(totalAmount);
  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`bg-gray-50 p-6 rounded-lg ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">{t("orderSummary")}</h2>

      {/* Order Items */}
      {(Array.isArray(checkoutCartItem) ? checkoutCartItem : []).map(
        (item, index) => (
          <div key={index} className="flex gap-4 mb-4 pb-4 border-b">
            <div className="relative">
              <Image
                src={item?.image_url || alterCardImage}
                alt={item.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />

              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                {locale === "ar"
                  ? toArabicNumerals(item?.quantity)
                  : item?.quantity}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">
                {locale === "ar" && item.arabic_name
                  ? item.arabic_name
                  : item.name}
              </h3>
              <div className="flex items-center gap-2 text-sm">
                {item?.offer_price > 0 && (
                  <span className="text-gray-500 line-through">
                    {t("Currency")}{" "}
                    {locale === "ar"
                      ? toArabicNumerals(Math.round(item?.price))
                      : Math.round(item?.price)}
                  </span>
                )}

                <span className="font-semibold">
                  {t("Currency")} {""}
                  {locale === "ar"
                    ? toArabicNumerals(Math.round(item?.final_price))
                    : Math.round(item?.final_price)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{item?.description}</p>
            </div>
          </div>
        )
      )}

      {/* Coupon */}
      <details className="mb-4">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
          {t("addCoupon")}
        </summary>
        <div className="mt-2">
          <input
            type="text"
            placeholder={t("couponCodePlaceholder")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </details>

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">{t("subtotal")}</span>
          <span>
            {t("Currency")}{" "}
            {locale === "ar"
              ? toArabicNumerals(Math.round(totalAmount))
              : Math.round(totalAmount)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>{t("total")}</span>
          <span>
            {t("Currency")}{" "}
            {locale === "ar"
              ? toArabicNumerals(Math.round(totalAmount))
              : Math.round(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
