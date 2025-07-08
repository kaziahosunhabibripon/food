/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck
"use client";

import { FC, useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { CustomCheckbox } from "@/helpers/ui/CustomCheckbox";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import { useLocale } from "next-intl";

// Interfaces
export interface FilterItem {
  serial: number;
  id: string;
  name: string;
  count: number;
  checked: boolean;
}

export interface FilterCategory extends FilterItem {
  subCategories?: FilterItem[];
}

export interface SidebarItems {
  options: FilterCategory[];
  label?: string;
  customClasses?: string;
  selectedValue?: string;
  callback?: (selectedIds: string[]) => void;
}

// Component
const FilterSidebar: FC<SidebarItems> = ({
  options,
  label = "Filters",
  customClasses = "",
  callback,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterCategory[]>(options);
  const locale = useLocale();
  const isPriceFilter = options.length > 0 && "name_ar" in options[0];
  useEffect(() => {
    setFilters(options);
  }, [options]);

  const toggleCategory = (id: string) => {
    const updated = filters.map((category) => {
      if (category.id === id) {
        const newChecked = !category.checked;
        const updatedSub = category.subCategories?.map((sub) => ({
          ...sub,
          checked: newChecked,
        }));
        return {
          ...category,
          checked: newChecked,
          subCategories: updatedSub,
        };
      } else if (category.subCategories) {
        const updatedSubCategories = category.subCategories.map((sub) => {
          if (sub.id === id) {
            return { ...sub, checked: !sub.checked };
          }
          return sub;
        });

        return {
          ...category,
          subCategories: updatedSubCategories,
        };
      }
      return category;
    });

    setFilters(updated);

    const selectedIds: string[] = [];
    updated.forEach((cat) => {
      if (cat.checked) selectedIds.push(cat.id);
      cat.subCategories?.forEach((sub) => {
        if (sub.checked) selectedIds.push(sub.id);
      });
    });

    if (callback) {
      callback(selectedIds);
    }
  };

  const handleLabelClick = (id: string, hasSubCategories: boolean) => {
    if (hasSubCategories) {
      setExpandedCategories((prev) =>
        prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
      );
    }
    toggleCategory(id);
  };

  const isExpanded = (id: string) => expandedCategories.includes(id);

  return (
    <div
      className={`border border-gray-200 rounded-md p-4 bg-white ${customClasses}`}
    >
      <div className="mb-4">
        <button
          className="flex items-center justify-between w-full font-semibold text-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {label}
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {isOpen && (
          <div className="mt-3 space-y-3">
            {/* Removed Search Box */}

            {/* Filter Items */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {filters.map((category) => (
                <div key={category.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() =>
                      handleLabelClick(category.id, !!category.subCategories)
                    }
                  >
                    <div className="flex items-center gap-2">
                      <CustomCheckbox
                        id={category.id}
                        checked={category.checked}
                        onCheckedChange={() =>
                          handleLabelClick(
                            category.id,
                            !!category.subCategories
                          )
                        }
                      />
                      <label
                        htmlFor={category.id}
                        className="text-sm cursor-pointer"
                      >
                        {isPriceFilter
                          ? locale === "ar"
                            ? category.name_ar
                            : category.name
                          : category.name}
                      </label>
                    </div>
                    <span className="text-xs text-gray-500">
                      {locale === "ar"
                        ? toArabicNumerals(category.count)
                        : category.count}
                    </span>
                  </div>

                  {isExpanded(category.id) && category.subCategories && (
                    <div className="pl-6 mt-1 space-y-1">
                      {category.subCategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleCategory(sub.id)}
                        >
                          <div className="flex items-center gap-2">
                            <CustomCheckbox
                              id={sub.id}
                              checked={sub.checked}
                              onCheckedChange={() => toggleCategory(sub.id)}
                            />
                            <label htmlFor={sub.id} className="text-sm">
                              {locale === "ar" ? sub.name_ar : sub.name}
                            </label>
                          </div>
                          <span className="text-xs text-gray-500">
                            (
                            {locale === "ar"
                              ? toArabicNumerals(sub.count)
                              : sub.count}
                            )
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
