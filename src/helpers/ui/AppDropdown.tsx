"use client";
import { useLocale } from "next-intl";
import { useEffect, useState, FC, memo } from "react";
import { ChevronDown } from "react-feather";
import { toArabicNumerals, toArabicNumeralsSafe } from "./Arabic";

interface DropdownOption {
  id: number | string;
  label_en: string;
  label_ar: string;
  value: number | string;
}

interface AppDropdownProps {
  options: DropdownOption[];
  label?: string;
  customClasses?: string;
  selectedValue?: DropdownOption;
  callback?: (option: DropdownOption) => void;
}

const AppDropdown: FC<AppDropdownProps> = ({
  options,
  label,
  customClasses = "w-48",
  selectedValue,
  callback = () => {},
}) => {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize selectedOption from selectedValue prop or fallback to first option
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    selectedValue || options[0] || null
  );

  // When selectedValue or locale changes, update selectedOption accordingly
  useEffect(() => {
    if (selectedValue) {
      setSelectedOption(selectedValue);
    } else {
      // Fallback to first option in options
      setSelectedOption(options[0] || null);
    }
  }, [selectedValue, options, locale]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    callback(option);
    setIsOpen(false);
  };

  return (
    <div
      className="relative inline-block text-left w-full"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex justify-between cursor-pointer px-4 py-2.5 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md focus:outline-none ${customClasses}`}
      >
        {selectedOption
          ? locale === "ar"
            ? toArabicNumeralsSafe(selectedOption.label_ar)
            : selectedOption.label_en
          : label || (locale === "ar" ? "اختر خيارًا" : "Select an option")}

        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-40 mt-2 bg-white border border-gray-200 rounded-md shadow-lg ${customClasses}`}
        >
          <ul className="py-1 text-sm text-gray-700">
            {options.map((item) => (
              <li
                key={item.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                {locale === "ar"
                  ? toArabicNumerals(item.label_ar)
                  : item.label_en}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(AppDropdown);
