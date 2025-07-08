"use client";

import dayjs from "dayjs";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, ChevronDown } from "react-feather";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalendarIcon from "@/helpers/ui/customSvg/CalendarIcon";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import { useCreateReserveMutation } from "@/redux/reserveApi/reserveApi";
import Loading from "@/app/loading";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
const timeOptions = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

const CALENDAR_TYPES = {
  GREGORY: "gregory",
  HEBREW: "hebrew",
  ISLAMIC: "islamic",
  ISO8601: "iso8601",
} as const;

export default function ReserveATable() {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const t = useTranslations();

  const [formData, setFormData] = useState({
    guests: "",
    date: "",
    time: "",
    fullName: "",
    message: "",
    phoneNo: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [reserve, { isLoading }] = useCreateReserveMutation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);
  // reserve table form component using redux toolkit query and react-calendar
  // custom dropdown for guests selection and time selection
  // with translations support for Arabic and English languages

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;

    // Add phone validation logic
    if (name === "phoneNo") {
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

  const handleSelectGuest = (value: string) => {
    setFormData((prev) => ({ ...prev, guests: value }));
    setDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, phoneNo, guests, message } = formData;

    if (!fullName || !phoneNo || !guests || !dateValue || !selectedTime) {
      toast.error("error");
      return;
    }

    // Build the payload in the exact format your API expects:
    const payload = {
      customer_name: fullName,
      customer_phone: phoneNo,
      number_of_people: guests,
      booking_date: dayjs(dateValue).format("YYYY-MM-DD"), // ✅ Format date properly
      start_time: selectedTime.split(" ")[0], // ✅ e.g., "10:00"
      description: message,
    };
    console.log("🚀 ~ Reservation payload before API:", payload);
    try {
      const res = await reserve(payload).unwrap();
      toast.success("success");
      console.log("✅ Reservation response:", res);

      // Reset form:
      setFormData({
        guests: "",
        date: "",
        time: "",
        fullName: "",
        message: "",
        phoneNo: "",
      });
      setDateValue(new Date());
      setSelectedTime("10:00 AM");
    } catch (error) {
      console.error("❌ Reservation error:", error);
      toast.error(t("reserve.error"));
    }
  };

  const handleDate = (value: Date | null) => {
    setDateValue(value);
    setShowCalendar(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      )
        setDropdownOpen(false);
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      )
        setShowCalendar(false);
      if (
        timeDropdownRef.current &&
        !timeDropdownRef.current.contains(event.target as Node)
      )
        setShowTimeDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div
      className="w-full bg-[#ecbf4c] text-slate-50 px-4 py-8 md:px-12 md:py-12"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex flex-col gap-4 w-full items-center justify-center">
        <p className="mt-4 text-lg sm:text-xl">{t("reserve.mainTitle")}!</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-wrap">
          {t("reserve.title")} {""}
          {t("reserve.title1")}
        </h1>
      </div>
      <div className="flex flex-col w-full gap-8 pb-4 pt-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-full bg-white text-gray-800 h-14 rounded-md flex items-center justify-between px-4 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span
                className={formData.guests ? "text-gray-800" : "text-gray-500"}
              >
                {formData.guests
                  ? lang === "ar"
                    ? `${toArabicNumerals(formData.guests)} ${
                        +formData.guests === 1
                          ? t("reserve.guestSingular")
                          : t("reserve.guestPlural")
                      }`
                    : `${formData.guests} ${
                        +formData.guests === 1
                          ? t("reserve.guestSingular")
                          : t("reserve.guestPlural")
                      }`
                  : t("reserve.selectGuest")}
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                  <div
                    key={num}
                    className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectGuest(num.toString())}
                  >
                    {lang === "ar" ? toArabicNumerals(num) : num} {""}
                    {num === 1
                      ? t("reserve.guestSingular")
                      : t("reserve.guestPlural")}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full" ref={calendarRef}>
              <button
                type="button"
                className="w-full border border-gray-300 rounded px-3 py-4 bg-white text-gray-800 flex justify-between items-center"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <span>
                  {dateValue &&
                    (lang === "ar"
                      ? toArabicNumerals(dayjs(dateValue).format("DD/MM/YYYY"))
                      : dayjs(dateValue).format("DD/MM/YYYY"))}
                </span>
                <CalendarIcon />
              </button>
              {showCalendar && (
                <div
                  className="absolute z-10 mt-1 p-2 bg-white shadow rounded"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  <Calendar
                    onChange={handleDate}
                    value={dateValue}
                    minDate={new Date()}
                    locale={lang === "ar" ? "ar" : "en"}
                    calendarType={
                      lang === "ar"
                        ? CALENDAR_TYPES.ISLAMIC
                        : CALENDAR_TYPES.GREGORY
                    }
                    className="text-gray-800"
                    formatDay={(_, date) =>
                      lang === "ar"
                        ? toArabicNumerals(date.getDate())
                        : date.getDate().toString()
                    }
                    formatMonthYear={(_, date) => {
                      const formatted = date.toLocaleDateString(
                        lang === "ar" ? "ar" : "en",
                        { month: "long", year: "numeric" }
                      );
                      return lang === "ar"
                        ? toArabicNumerals(formatted)
                        : formatted;
                    }}
                    nextLabel={lang === "ar" ? "التالي >" : ">"}
                    prevLabel={lang === "ar" ? "< السابق" : "<"}
                    next2Label={lang === "ar" ? ">>" : ">>"}
                    prev2Label={lang === "ar" ? "<<" : "<<"}
                  />
                </div>
              )}
            </div>

            <div className="relative w-full" ref={timeDropdownRef}>
              <button
                type="button"
                className="w-full border border-gray-300 rounded px-3 py-4 bg-white text-gray-800 flex justify-between items-center"
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              >
                <span>
                  {lang === "ar"
                    ? toArabicNumerals(
                        selectedTime.replace("AM", "ص").replace("PM", "م")
                      )
                    : selectedTime}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showTimeDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded shadow-lg max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {timeOptions.map((option) => (
                      <li key={option}>
                        <button
                          type="button"
                          className={`block w-full text-left px-4 py-2 cursor-pointer ${
                            selectedTime === option
                              ? "bg-brand text-gray-500"
                              : "text-gray-800"
                          }`}
                          onClick={() => {
                            setSelectedTime(option);
                            setShowTimeDropdown(false);
                          }}
                        >
                          {lang === "ar"
                            ? toArabicNumerals(
                                option.replace("AM", "ص").replace("PM", "م")
                              )
                            : option}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full bg-white text-gray-800 h-14 rounded-md px-4"
            placeholder={`${t("reserve.fullName")}*`}
            required
          />

          <PhoneInput
            international
            defaultCountry="AE"
            // Example: AE for Arabic locale, US otherwise
            placeholder={`${t("reserve.phone")}*`}
            value={formData.phoneNo}
            onChange={(value) =>
              handleChange({
                target: { name: "phoneNo", value: value || "" },
              })
            }
            disabled={isLoading}
            className="w-full bg-white text-gray-800 h-14 rounded-md px-4"
            required
          />

          <div className="relative w-full md:col-span-2">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 pt-8 bg-white text-gray-800 min-h-[120px]"
              placeholder={t("reserve.message")}
            />
          </div>

          <div className="md:col-span-2 flex item-center justify-center mt-4">
            <button
              type="submit"
              className="bg-white cursor-pointer text-base sm:text-lg md:text-xl hover:bg-brand text-brand font-bold px-12 p-4 rounded-lg"
            >
              <span className="flex justify-center items-center">
                {t("reserve.button")} <ArrowRight className="w-4 h-4 ms-2" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
