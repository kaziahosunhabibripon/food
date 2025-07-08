"use client";

import { toArabicNumerals } from "@/helpers/ui/Arabic";
import { useTranslations, useLocale } from "next-intl";
import React, { useEffect, useState, useCallback, useMemo } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

interface DealCountProps {
  endDate: string | number | Date;
}

const DealCount: React.FC<DealCountProps> = ({ endDate }) => {
  const t = useTranslations("hurryUp");
  const locale = useLocale();

  const parsedEndDate = useMemo(() => {
    const date = new Date(endDate);
    return isNaN(date.getTime()) ? null : date;
  }, [endDate]);

  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    if (!parsedEndDate) return null;

    const difference = parsedEndDate.getTime() - new Date().getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return null; // expired
  }, [parsedEndDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const initial = calculateTimeLeft();
    setTimeLeft(initial);

    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);

      if (!updatedTimeLeft) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (timeLeft === null) {
    return <p className="text-gray-400">{t("loading") || "loading..."}</p>;
  }

  if (!timeLeft) {
    return <p className="text-red-600 font-semibold">{t("expired")}</p>;
  }

  return (
    <div
      className={`text-gray-600 font-medium flex items-center gap-4  text-left`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <span className="text-lg font-bold">{t("offer")}:</span>
      <div className="flex gap-4 text-center text-gray-600 font-bold">
        <TimeBox label={t("Days")} value={timeLeft.days} locale={locale} />
        <TimeBox label={t("Hours")} value={timeLeft.hours} locale={locale} />
        <TimeBox
          label={t("Minutes")}
          value={timeLeft.minutes}
          locale={locale}
        />
        <TimeBox
          label={t("Seconds")}
          value={timeLeft.seconds}
          locale={locale}
        />
      </div>
    </div>
  );
};

const TimeBox: React.FC<{ label: string; value: number; locale: string }> = ({
  label,
  value,
  locale,
}) => {
  const formattedValue =
    locale === "ar"
      ? toArabicNumerals(value.toString().padStart(2, "0"))
      : value.toString().padStart(2, "0");

  return (
    <div className="bg-gray-200 text-sm rounded-lg px-2 py-1 min-w-[50px]">
      <div className="text-lg">{formattedValue}</div>
      <div className="uppercase text-xs">{label}</div>
    </div>
  );
};

export default DealCount;
