"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { size } from "lodash";
import { Eye, EyeOff, Lock, Mail } from "react-feather";
import AOS from "aos";
import "aos/dist/aos.css";
import CommonHeader from "@/components/common/CommonHeader";
import toastAlert from "@/utils/toastConfig";
import {
  checkEmailForValid,
  validatedTextInputField,
} from "@/utils/appHelpers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { setAuthUser } from "@/redux/user/userSlice";
import { requestForLogin } from "@/helpers/restApiRequest";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

const LoginComponent = () => {
  const t = useTranslations("login"); // <-- use translation namespace
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const dir = lang === "ar" ? "rtl" : "ltr";

  const toastId = useRef<string | number | null>(null);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  // navigation
  // to login page component
  //user login for authentication
  const { cartData, checkoutCartItem, guestUserId } = useAppSelector(
    (state) => state.cart
  );

  const updatedCartData = useMemo(
    () => cartData || checkoutCartItem,
    [cartData, checkoutCartItem]
  );

  const [mutationData, setMutationData] = useState({
    email: "",
    password: "",
    ...(guestUserId && size(updatedCartData) > 0
      ? { guest_id: guestUserId }
      : {}),
  });

  const [viewPassword, setViewPassword] = useState(false);
  const [Loading, setLoading] = useState(false);
  const isValidEmail = checkEmailForValid(mutationData.email);

  const handleChange = (value: string, context: string) => {
    if (context !== "email" && validatedTextInputField(value)) {
      setMutationData((prev) => ({
        ...prev,
        password: value,
      }));
    } else {
      setMutationData((prev) => ({
        ...prev,
        email: value,
      }));
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await requestForLogin(mutationData);

      if (response?.data?.message === "Login successful") {
        const updatedRes = response?.data || {};

        const prepareUserData = {
          token: updatedRes?.token,
          fullname: updatedRes?.user?.full_name,
          photo: updatedRes?.user?.image_url || updatedRes?.user?.image,
          email: updatedRes?.user?.email,
          userId: updatedRes?.user?.id,
        };

        dispatch(setAuthUser(prepareUserData));
        setMutationData({ email: "", password: "" });

        const redirectPath = searchParams.get("redirect") || "/";
        router.push(redirectPath);
      }
    } catch (err) {
      setLoading(false);
      const { response } = err as { response: { data: { message: string } } };
      toastAlert("error", response?.data?.message, "top-right", toastId, {
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const disableBtn =
    !mutationData?.email ||
    Loading ||
    !isValidEmail ||
    size(mutationData?.password) <= 6;

  useEffect(() => {
    AOS.init({ offset: 120, duration: 2000, easing: "ease-out" });
  }, []);

  const iconPositionClass = dir === "rtl" ? "right-3" : "left-3";
  const inputPaddingClass = dir === "rtl" ? "pr-10 pl-3" : "pl-10 pr-3";

  return (
    <div dir={dir}>
      <CommonHeader
        title={t("welcome")}
        subtitle={t("back")}
        componentTitle={t("loginTitle")}
      />
      <div
        className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-10"
        data-aos="fade-up"
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-border-dark mb-6 capitalize">
            {t("signIn")} <span className="text-brand">{t("account")}</span>
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("email")}
                <span className="text-red-500 text-xs font-medium px-1">*</span>
              </label>
              <div className="relative">
                <Mail
                  className={`${iconPositionClass} absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`}
                />
                <input
                  id="email"
                  name="email"
                  value={mutationData.email}
                  type="email"
                  onChange={(e) => handleChange(e.target.value, "email")}
                  autoComplete="email"
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-transparent ${inputPaddingClass}`}
                  placeholder={t("emailPlaceholder")}
                />
              </div>
              {mutationData?.email && !isValidEmail && (
                <span className="text-red-500 text-12 font-semibold">
                  {t("emailInvalid")}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("password")}
                <span className="text-red-500 text-xs font-medium px-1">*</span>
              </label>
              <div className="relative">
                <div className="flex border border-gray-300 justify-center items-center relative">
                  <Lock
                    className={`${iconPositionClass} absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`}
                  />
                  <input
                    id="password"
                    name="password"
                    value={mutationData.password}
                    type={viewPassword ? "text" : "password"}
                    onChange={(e) => handleChange(e.target.value, "password")}
                    autoComplete={"current-password"}
                    required
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:border-transparent ${inputPaddingClass}`}
                    placeholder="••••••••"
                  />
                  {viewPassword ? (
                    <EyeOff
                      onClick={() => setViewPassword(false)}
                      className="absolute top-1/2 right-2 rtl:right-auto rtl:left-2 transform -translate-y-1/2 text-gray-400 cursor-pointer rtl:ml-2"
                    />
                  ) : (
                    <Eye
                      onClick={() => setViewPassword(true)}
                      className="absolute top-1/2 right-2 rtl:right-auto rtl:left-2 transform -translate-y-1/2 text-gray-400 cursor-pointer rtl:ml-2"
                    />
                  )}
                </div>
              </div>
              {mutationData?.password && size(mutationData?.password) <= 6 && (
                <span className="text-red-500 text-12 font-semibold">
                  {t("passwordHint")}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={disableBtn}
              className={`${
                disableBtn
                  ? "cursor-not-allowed bg-orange-300"
                  : "cursor-pointer bg-brand"
              } w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200`}
            >
              {Loading ? t("loginLoading") : t("login")}
            </button>
          </form>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-center text-gray-600">
            <span>{t("dontHaveAccount")}</span>
            <Link
              href="/register"
              className="font-medium text-brand transition ease-in-out duration-150 px-2"
            >
              {t("register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
