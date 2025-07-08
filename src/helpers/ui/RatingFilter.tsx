"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { useLocale } from "next-intl";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
interface RatingFilterProps {
  min?: number;
  max?: number;
  onChange: (value: number | null) => void;
  initialValue?: number | null;
  customClasses?: string; // <-- Added here
}

function RatingFilter({
  min = 1,
  max = 5,
  onChange,
  initialValue = null,
  customClasses = "", // <-- Default empty string
}: RatingFilterProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(
    initialValue
  );
  const [isOpen, setIsOpen] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    onChange(selectedRating);
  }, [selectedRating, onChange]);

  const handleChange = (value: number) => setSelectedRating(value);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const ratings = [];
  for (let i = max; i >= min; i--) {
    ratings.push(i);
  }

  return (
    <div
      className={`border border-gray-200 rounded-md p-4 bg-white mt-4 max-w-sm ${customClasses}`}
    >
      {/* Header */}
      <button
        onClick={toggleOpen}
        className="flex items-center justify-between w-full font-semibold text-lg cursor-pointer"
        aria-expanded={isOpen}
        aria-controls="rating-filter-content"
      >
        {locale === "ar" ? "تقييم النجوم" : "Star Rating"}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Content */}
      {isOpen && (
        <div
          id="rating-filter-content"
          className="mt-4 flex flex-col space-y-2"
        >
          {ratings.map((rating) => (
            <label
              key={rating}
              className="flex items-center cursor-pointer select-none"
            >
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={selectedRating === rating}
                onChange={() => handleChange(rating)}
                className="mr-2 transform scale-150"
              />

              <span className="flex space-x-1 text-brand text-xl font-bold">
                {Array.from({ length: max }).map((_, idx) =>
                  idx < rating ? (
                    <FaStar key={idx} size={30} />
                  ) : (
                    <FaRegStar key={idx} size={30} />
                  )
                )}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default RatingFilter;
