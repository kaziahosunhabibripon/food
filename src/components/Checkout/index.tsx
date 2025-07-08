/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import OrderSummary from "./OrderSummary";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { CreditCard } from "react-feather";

import toastAlert from "@/utils/toastConfig";
import CommonHeader from "../common/CommonHeader";
import { getOrdersData, requestForCheckout } from "@/helpers/restApiRequest";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { setDefaultCart } from "@/redux/cart/cartSlice";
import { useLocale, useTranslations } from "next-intl";
import { getCurrentLocation } from "@/helpers/getCurrentLocation";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
type CartItems = {
  final_price: number;
  quantity: number;
};

const CheckoutComponent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations("checkout");
  const locale = useLocale();

  const lang = locale === "ar" ? "ar" : "en";
  // redux states
  const { user } = useAppSelector((state) => state.user);
  const { email, fullname } = user || {};
  const { checkoutCartItem } = useAppSelector((state) => state.cart);

  const totalAmount = useMemo(() => {
    const items = Array.isArray(checkoutCartItem) ? checkoutCartItem : [];
    return items.reduce(
      (sum: number, item: CartItems) => sum + (Number(item?.final_price) || 0), // Do not multiply
      0
    );
  }, [checkoutCartItem]);

  // ✅ formData does NOT store total_amount anymore!
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [formData, setFormData] = useState({
    payment_method: "cash_on_delivery",
    delivery_method: "home_delivery",
    delivery_address: "Mirpur Dhaka",
    firstName: fullname || "",
    postalCode: "",
    lastName: "",
    apartment: "",
    phone: "",
    city: "",
    state: "",
    latitude: null,
    longitude: null,
  });

  // ✅ Keep your input handler as is
  const handleInputChange = (value: string, name: string) => {
    if (name === "phone") {
      const isPhoneValid = isValidPhoneNumber(value || "");
      console.log("Is valid phone number:", isPhoneValid);

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        isPhoneValid: isPhoneValid,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Always update payment method & geolocation
  const handlePaymentChange = async (method) => {
    setPaymentMethod(method);

    try {
      const position = await getCurrentLocation();
      setFormData((prev) => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lon,
        payment_method:
          method === "creditCard" ? "creditCard" : "cash_on_delivery",
      }));
    } catch (error) {
      console.error("Could not get location:", error);
    }
  };

  // ✅ handleSubmit always uses up-to-date totalAmount & final_price as price
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      const position = await getCurrentLocation();

      const { firstName, lastName, city, phone, apartment, ...updatedData } =
        formData;

      const dataToSend = {
        ...updatedData,
        latitude: position.lat,
        longitude: position.lon,
        total_amount: totalAmount,
        items: checkoutCartItem.map((item) => ({
          id: item.id,
          price: Number(item.final_price),
          quantity: item.quantity,
        })),
      };

      const response = await requestForCheckout(dataToSend);

      if (response?.data?.message === "Order placed successfully") {
        dispatch(setDefaultCart());

        if (paymentMethod === "creditCard") {
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const ordersResponse = await getOrdersData();
          const orders = ordersResponse?.data?.orders || [];

          if (orders.length > 0) {
            const latestOrderId = orders[0]?.id;
            router.push(
              `https://rapiderp.excellency-catering-restaurant-sweets.com/api/customer/new-payment/${latestOrderId}`
            );
          } else {
            console.error("No orders found");
          }
        } else {
          router.push("/tracking");
        }
      }
    } catch (error) {
      const { response } = error || {};

      if (response?.data?.message === "Unauthenticated.") {
        router.replace("/login");
        return;
      }

      toastAlert(
        "error",
        response?.data?.message || "An error occurred",
        "top-right"
      );
    }
  };

  useEffect(() => {
    AOS.init({ offset: 120, duration: 2000, easing: "ease-out" });
  });

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <CommonHeader
        title={t("title")}
        subtitle={t("pageSubTitle")}
        componentTitle={t("componentTitle")}
      />

      <div className="max-w-7xl mx-auto px-4 pb-16 py-10" data-aos="fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <form className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {t("contactInformation")}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {t("contactDescription")}
              </p>

              <input
                type="email"
                name="email"
                value={email || ""}
                onChange={(e) => handleInputChange(e.target.value, "email")}
                className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Email address"
              />
              {/* <p className="text-sm text-gray-600 mt-2">
                {t("guestCheckoutNote")}

                <a href="#" className="text-[#ecbf4c] hover:text-[#ecbf4c]">
                  {t("createAccount")}
                </a>
              </p> */}
            </div>

            {/* Billing Address */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {t("billingAddress")}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {t("billingDescription")}
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "firstName")
                    }
                    placeholder={t("firstName")}
                    className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "lastName")
                    }
                    placeholder={t("lastName")}
                    className="px-4 py-2 border rounded border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <input
                  type="text"
                  name="address"
                  value={formData.delivery_address || ""}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "delivery_address")
                  }
                  placeholder={t("address")}
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment || ""}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "apartment")
                  }
                  placeholder={t("apartment")}
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange(e.target.value, "city")}
                    placeholder={t("city")}
                    className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      name="state"
                      value={formData.state || ""}
                      onChange={(e) =>
                        handleInputChange(e.target.value, "state")
                      }
                      placeholder={t("state")}
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode || ""}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "postalCode")
                    }
                    placeholder={t("postalCode")}
                    className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <PhoneInput
                    type="tel"
                    name="phone"
                    international
                    defaultCountry="AE"
                    // Example: AE for Arabic locale, US otherwise
                    placeholder={t("phone")}
                    value={formData.phone}
                    onChange={(value) =>
                      handleInputChange(value || "", "phone")
                    }
                    className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                  {/* <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange(e.target.value, "phone")}
                    placeholder={t("phone")}
                    className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  /> */}
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {t("paymentOptions")}
              </h2>

              {/* Payment Method Section */}
              <div className="space-y-4">
                <div
                  onClick={() => handlePaymentChange("COD")}
                  className={`p-4 cursor-pointer border rounded-lg flex items-center justify-between transition-colors ${
                    paymentMethod === "COD"
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300"
                  }`}
                >
                  <span className="text-lg font-medium flex justify-center items-center gap-2">
                    {t("cashOnDelivery")} AED{" "}
                  </span>
                  {paymentMethod === "COD" && (
                    <svg
                      className="w-5 h-5 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                {/* Example: */}
                <div
                  onClick={() => handlePaymentChange("creditCard")}
                  className={`p-4 cursor-pointer border rounded-lg flex items-center justify-between transition-colors ${
                    paymentMethod === "creditCard"
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300"
                  }`}
                >
                  <span className="text-lg font-medium flex justify-center items-center gap-2">
                    {t("creditCard")} <CreditCard />{" "}
                  </span>
                  {paymentMethod === "creditCard" && (
                    <svg
                      className="w-5 h-5 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {t("termsNote")}
                <a href="#" className="text-[#ecbf4c] hover:text-[#ecbf4c]">
                  {t("terms")}
                </a>

                <a href="#" className="text-[#ecbf4c] hover:text-[#ecbf4c]">
                  {t("privacy")}
                </a>
              </p>

              <div className="flex flex-col md:flex-row justify-between gap-4">
                <Link
                  href="/"
                  className=" bg-gray-300 !text-border-dark py-3 px-6 rounded transition duration-200"
                >
                  {t("returnToCart")}
                </Link>
                <button
                  role="button"
                  tabIndex={0}
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-brand hover:bg-[#ecbf4c] cursor-pointer text-white py-3 px-6 rounded transition duration-200"
                >
                  {t("placeOrder")}
                </button>
              </div>
            </div>
          </form>

          {/* Order Summary */}
          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;
