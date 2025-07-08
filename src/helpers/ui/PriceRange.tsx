"use client";

import React, { useState, useEffect } from "react";
import { toArabicNumerals } from "./Arabic";
import { useLocale } from "next-intl";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onChange: (value: number) => void;
  initialValue?: number;
}

function PriceRangeFilter({
  min,
  max,
  onChange,
  initialValue = min,
}: PriceRangeSliderProps) {
  const [value, setValue] = useState<number>(initialValue);
  const locale = useLocale();

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <div className="mt-4">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full"
      />
      <div className="text-center mt-1">
        {locale === "ar"
          ? `السعر: د.إ ${toArabicNumerals(value)}`
          : `Price: AED ${value}`}
      </div>
    </div>
  );
}

export default PriceRangeFilter;
