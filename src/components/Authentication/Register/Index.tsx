"use client";
import React, { useMemo, useRef, useState } from "react";
import { size } from "lodash";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User } from "react-feather";
import CommonHeader from "@/components/common/CommonHeader";
import toastAlert from "@/utils/toastConfig";
import { useRouter } from "next/navigation";
import {
  checkEmailForValid,
  validatedTextInputField,
} from "@/utils/appHelpers";
import { useAppSelector } from "@/redux/hooks/hooks";
import { useRegisterMutation } from "@/redux/authApi/authApi";
import { useTranslations } from "next-intl";

const RegisterComponent = () => {
  const toastId = useRef<string | number | null>(null);
  const router = useRouter();
  const t = useTranslations("register");
  // get user information for registration and login from API using redux toolkit mutation  and query
  // redux states
  const { cartData, checkoutCartItem, guestUserId } = useAppSelector(
    (state) => state.cart
  );

  const updatedCartData = useMemo(
    () => cartData || checkoutCartItem,
    [cartData, checkoutCartItem]
  );

  const [mutationData, setMutationData] = useState({
    name: "",
    email: "",
    password: "",
    ...(guestUserId && size(updatedCartData) > 0
      ? { guest_id: guestUserId }
      : {}),
  });

  const [viewPassword, setViewPassword] = useState(false);
  const isValidEmail = checkEmailForValid(mutationData.email);
  const [registrationMutation, { isLoading }] = useRegisterMutation();

  const handleChange = (value: string, context: string) => {
    if (context !== "email" && validatedTextInputField(value)) {
      setMutationData((prev) => ({
        ...prev,
        [context]: value,
      }));
    } else {
      setMutationData((prev) => ({
        ...prev,
        [context]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const response = await registrationMutation(mutationData);
      if (response?.data?.message === "User registered successfully") {
        toastAlert("success", "register Success", "top-right", toastId);
        setMutationData({ name: "", email: "", password: "" });
        router.push("/login");
      }
    } catch (error) {
      const { response } = error as { response: { data: { message: string } } };
      toastAlert("error", response?.data?.message, "top-right", toastId, {
        autoClose: 4000,
      });
    }
  };

  const disableBtn =
    !(mutationData?.email && mutationData?.name) ||
    !isValidEmail ||
    isLoading ||
    size(mutationData?.password) <= 6;

  return (
    <div>
      <CommonHeader
        title={t("welcome")}
        subtitle={t("subtitle")}
        secondarySubTitle={t("secondarySubtitle")}
        componentTitle={t("register")}
      />
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-10">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-border-dark mb-6">
            {t("createAccount")}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="flex justify-start items-center text-sm font-medium text-gray-700 mb-1"
              >
                {t("name")}
                <span className="text-red-500 text-20 font-medium px-1">*</span>
              </label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={(e) => handleChange(e.target.value, "name")}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-transparent pl-10 rtl:pl-12 rtl:pr-10"
                  placeholder={t("namePlaceholder")}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="flex justify-start items-center text-sm font-medium text-gray-700 mb-1"
              >
                {t("email")}
                <span className="text-red-500 text-20 font-medium px-1">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => handleChange(e.target.value, "email")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-transparent pl-10 rtl:pl-12 rtl:pr-10"
                  placeholder={t("emailPlaceholder")}
                />
              </div>
              {mutationData?.email && !isValidEmail && (
                <span className="text-red-500 text-12 font-semibold">
                  {t("emailInvalid")}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="flex justify-start items-center text-sm font-medium text-gray-700 mb-1"
              >
                {t("password")}
                <span className="text-red-500 text-20 font-medium px-1">*</span>
              </label>
              <div className="relative">
                <div className="flex border border-gray-300 justify-center items-center relative">
                  <Lock className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={viewPassword ? "text" : "password"}
                    onChange={(e) => handleChange(e.target.value, "password")}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:border-transparent pl-10 pr-12 rtl:pl-12 rtl:pr-10"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={disableBtn}
              className={`${
                disableBtn
                  ? "cursor-not-allowed bg-orange-300"
                  : "cursor-pointer bg-brand"
              } w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white  transition-all duration-200`}
            >
              {isLoading ? t("saving") : t("signup")}
            </button>
          </form>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-center text-gray-600">
            <span>{t("alreadyHaveAccount")}</span>
            <Link
              href="/login"
              className="font-medium text-brand transition ease-in-out duration-150 px-2"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
