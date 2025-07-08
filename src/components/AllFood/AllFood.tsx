/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useState, useMemo, useCallback } from "react"; // Added useCallback
import { useGetAllFoodsQuery } from "@/redux/apiSlice/apiSlice";
import { useLocale, useTranslations } from "next-intl";
import CommonHeader from "@/components/common/CommonHeader";
import AppDropdown from "@/helpers/ui/AppDropdown";

import { Grid, List, Search } from "react-feather";

import ProductGridView from "../Products/ProductGridView";
import ProductListView from "../Products/ProductListView";
import FilterSidebar, { FilterCategory } from "../Products/FilterSidebar";

import PriceRangeFilter from "@/helpers/ui/PriceRange";
import Loading from "@/app/loading";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import RatingFilter from "@/helpers/ui/RatingFilter";

const ITEMS_OPTIONS = [
  { id: 12, label_en: "12 per page", label_ar: "12 لكل صفحة", value: 12 },
  { id: 24, label_en: "24 per page", label_ar: "24 لكل صفحة", value: 24 },
  { id: 48, label_en: "48 per page", label_ar: "48 لكل صفحة", value: 48 },
];
const SORT_OPTIONS = [
  {
    id: "newest",
    label_en: "Newest Item",
    label_ar: "الأحدث أولاً",
    value: "newest",
  },
  {
    id: "oldest",
    label_en: "Oldest Item",
    label_ar: "الأقدم أولاً",
    value: "oldest",
  },
  {
    id: "price_asc",
    label_en: "Price: Low to High",
    label_ar: "السعر: من الأقل للأعلى",
    value: "price_asc",
  },
  {
    id: "price_desc",
    label_en: "Price: High to Low",
    label_ar: "السعر: من الأعلى للأقل",
    value: "price_desc",
  },
];

export default function AllFoods() {
  // State management for various filters and pagination sort grid view list view
  // and search functionality
  // Using useState for local state management
  // Using useMemo for derived state to optimize performance
  // Using useEffect to handle side effects like filtering, sorting, and pagination
  // Using useCallback for stable function references to prevent unnecessary re-renders
  // Using translations for internationalization support
  // Using Redux Toolkit Query for data fetching and caching

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("newest");

  const [searchTerm, setSearchTerm] = useState("");
  // searchQuery is the actual term used for filtering, updated on Enter or Search icon click
  const [searchQuery, setSearchQuery] = useState("");

  const [visibleItems, setVisibleItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Default max price for the slider
  const [price, setPrice] = useState<number>(100);

  const locale = useLocale();
  const t = useTranslations();
  const { data: foodsData, isLoading } = useGetAllFoodsQuery({});

  // Memoize categories to prevent unnecessary re-creation if foodsData is stable
  const categories = useMemo<FilterCategory[]>(() => {
    if (!foodsData?.group) return [];

    const mappedCategories = foodsData.group.map((g, index) => ({
      id: g.id.toString(),
      name: locale === "ar" ? g.arabic_name ?? g.name : g.name,
      // Ensure count is based on current filters if logic changes, otherwise it's just raw count
      count: foodsData.items.filter((it) => it.purchase_group_id === g.id)
        .length,
      checked: false,
      serial: index + 1, // Keep original serial if needed for other purposes, but sorting will reorder visually
    }));

    // Sort categories alphabetically by name
    return mappedCategories.sort((a, b) =>
      a.name.localeCompare(b.name, locale)
    );
  }, [foodsData, locale]);

  // Define static price ranges outside or memoize them
  // If `foodsData` affects counts, `useMemo` is appropriate here too.
  const prices = useMemo<FilterCategory[]>(
    () => [
      {
        id: "price-0-10",
        name: "AED 0–10",
        name_ar: "٠–١٠ درهم",
        count: foodsData?.items.filter((i) => i.price < 10).length || 0,
        checked: false,
        serial: 1,
      },
      {
        id: "price-10-20",
        name: "AED 10–20",
        name_ar: "١٠–٢٠ درهم",
        count:
          foodsData?.items.filter((i) => i.price >= 10 && i.price < 20)
            .length || 0,
        checked: false,
        serial: 2,
      },
      {
        id: "price-20+",
        name: "AED 20+",
        name_ar: "+٢٠ درهم",
        count: foodsData?.items.filter((i) => i.price >= 20).length || 0,
        checked: false,
        serial: 3,
      },
    ],

    [foodsData] // Depend on foodsData if counts depend on it
  );
  // Star Ratings
  const [rating, setRating] = useState(0); // 0 means no filter

  const handleRatingChange = (value) => {
    console.log("Selected rating:", value);
    setRating(value); // save selected rating to state
  };
  // Effect to filter, sort, and paginate items
  useEffect(() => {
    if (!foodsData?.items) {
      setVisibleItems([]);
      setTotalPages(1);
      return;
    }

    let items = [...foodsData.items];

    // Search filter
    if (searchQuery) {
      items = items.filter((item) =>
        ((item.name ?? "") + " " + (item.country ?? ""))
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Active filters (category and price ranges)
    if (activeFilters.length > 0) {
      items = items.filter((it) =>
        activeFilters.some((filter) => {
          if (filter.startsWith("price-")) {
            if (filter === "price-0-10") return it.price < 10;
            if (filter === "price-10-20")
              return it.price >= 10 && it.price < 20;
            if (filter === "price-20+") return it.price >= 20;
          }
          return it.purchase_group_id.toString() === filter;
        })
      );
    }

    // Slider price filter (max price)
    items = items.filter((it) => it.price <= price);

    // if item has ratings
    if (rating) {
      items = items.filter((it) => (it.average_rating ?? 0) >= rating);
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        items.sort(
          (a, b) =>
            new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
        );
        break;
      case "oldest":
        items.sort(
          (a, b) =>
            new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf()
        );
        break;
      case "price_asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        // Fallback for unknown sort by to ensure consistent behavior
        break;
    }

    // Calculate total pages for the *filtered and sorted* set of items
    const newTotalPages = Math.ceil(items.length / itemsPerPage);
    setTotalPages(newTotalPages);

    // Adjust page if current page exceeds new total pages after filtering/sorting
    // This is crucial to prevent being stuck on a page that no longer exists
    if (page > newTotalPages && newTotalPages > 0) {
      setPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setPage(1); // Reset to page 1 if no items
    }

    // Pagination slicing
    const start = (page - 1) * itemsPerPage;
    const paginatedItems = items.slice(start, start + itemsPerPage);

    setVisibleItems(paginatedItems);
  }, [
    foodsData,
    searchQuery,
    activeFilters,
    sortBy,
    page,
    itemsPerPage,
    price,
    rating, // if item has rating field then work on it
  ]);

  // --- Event Handlers (using useCallback for stability, though not strictly required for primitives) ---

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        // Only update searchQuery if it's different to prevent unnecessary effect re-run
        if (searchTerm.trim() !== searchQuery) {
          setSearchQuery(searchTerm.trim());
          setPage(1); // Reset page on new search
        }
        setSearchTerm(""); // Clear input after search
      }
    },
    [searchTerm, searchQuery]
  ); // Depend on searchTerm and searchQuery

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleSearchIconClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      // Only update searchQuery if it's different
      if (searchTerm.trim() !== searchQuery) {
        setSearchQuery(searchTerm.trim());
        setPage(1); // Reset page on new search
      }
      setSearchTerm(""); // Clear input after search
    },
    [searchTerm, searchQuery]
  );

  const handleViewModeChange = useCallback((mode: "grid" | "list") => {
    // Removed e: React.MouseEvent and its usage if not needed elsewhere
    setViewMode(mode);
  }, []);

  const handlePrevPage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Only update page if it will change
    setPage((p) => Math.max(p - 1, 1));
  }, []); // No dependencies as setPage uses functional update

  const handleNextPage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      // Only update page if it will change
      setPage((p) => Math.min(p + 1, totalPages));
    },
    [totalPages]
  ); // Depends on totalPages

  const handleItemsPerPageChange = useCallback(
    (opt: { value: number; label: string; id: number }) => {
      setItemsPerPage(Number(opt.value));
      setPage(1); // Reset page when items per page changes
    },
    [] // No dependencies as it directly sets state
  );

  const handleSortChange = useCallback(
    (opt: { value: string; label: string; id: string }) => {
      setSortBy(opt.value as string);
      setPage(1); // Reset page when sort order changes
    },
    [] // No dependencies as it directly sets state
  );

  const handleFilterUpdate = useCallback((selected: string[]) => {
    setActiveFilters(selected);
    setPage(1); // Reset page when filters change
  }, []);

  const handlePriceSliderChange = useCallback((value: number) => {
    setPrice(value);
    setPage(1); // Reset page when price filter changes
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <CommonHeader
        title={t("All.title")}
        subtitle={t("All.subtitle")}
        componentTitle={t("All.secondarySubTitle")}
      />

      <div className="px-4 grid grid-cols-[25%_75%] gap-4">
        {/* Sidebar */}
        <div className="bg-transparent px-4 py-12">
          <div className="mb-4 relative">
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={handleSearchIconClick}
                />
                <input
                  type="text"
                  placeholder={
                    locale === "ar"
                      ? "البحث باسم الطعام"
                      : "Search by food name"
                  }
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full border px-10 py-2 rounded-md focus:outline-none"
                />
              </>
            )}
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              <FilterSidebar
                options={categories}
                label={locale === "ar" ? "الفئة" : "Category"}
                callback={handleFilterUpdate}
              />
              <>
                <FilterSidebar
                  options={prices}
                  label={locale === "ar" ? "نطاق السعر" : "Price Range"}
                  customClasses="mt-4"
                  callback={handleFilterUpdate}
                />

                <PriceRangeFilter
                  min={0}
                  max={100}
                  initialValue={price} // Make sure this reflects current price state
                  onChange={handlePriceSliderChange}
                  label={locale === "ar" ? "نطاق السعر" : "Price Range"}
                />
                <RatingFilter onChange={handleRatingChange} />
              </>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full md:w-1/3 flex justify-center text-nowrap">
              <div className="flex items-center gap-2">
                <AppDropdown
                  options={ITEMS_OPTIONS}
                  selectedValue={ITEMS_OPTIONS.find(
                    (item) => item.value === itemsPerPage
                  )}
                  callback={handleItemsPerPageChange}
                />
              </div>
            </div>

            <div className="w-full md:w-1/3 flex justify-center text-nowrap">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 text-nowrap">
                  {locale === "ar" ? "ترتيب حسب" : "Sort by"}
                </span>
                {/* No need for onClick={(e) => e.stopPropagation()} directly on parent div */}
                <AppDropdown
                  options={SORT_OPTIONS}
                  selectedValue={SORT_OPTIONS.find((o) => o.value === sortBy)}
                  callback={handleSortChange}
                />
              </div>
            </div>

            <div className="w-full md:w-1/3 flex justify-end">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">
                  {locale === "ar" ? "عرض كـ" : "View as"}
                </span>
                <div className="flex border border-gray-200 rounded-md">
                  <button
                    type="button"
                    className={`${
                      viewMode === "grid" ? "bg-gray-100" : ""
                    } p-2`}
                    onClick={() => handleViewModeChange("grid")} // Simplified handler call
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    type="button"
                    className={`${
                      viewMode === "list" ? "bg-gray-100" : ""
                    } p-2`}
                    onClick={() => handleViewModeChange("list")} // Simplified handler call
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product list */}
          {isLoading ? (
            <Loading />
          ) : (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                  : "grid-cols-1"
              } gap-6`}
            >
              {visibleItems.length > 0 ? (
                visibleItems.map(
                  (
                    item // Changed idx to item.id for key
                  ) =>
                    viewMode === "grid" ? (
                      <ProductGridView
                        key={item.id}
                        product={item}
                        viewMode={viewMode}
                      />
                    ) : (
                      <ProductListView key={item.id} product={item} />
                    )
                )
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  {locale === "ar"
                    ? "لم يتم العثور على نتائج"
                    : "No Result Found"}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-brand text-gray-800 rounded disabled:opacity-50"
              >
                {locale === "ar" ? "السابق" : "Prev"}
              </button>
              <span>
                {locale === "ar"
                  ? `صفحة ${toArabicNumerals(page)} / ${toArabicNumerals(
                      totalPages
                    )}`
                  : `Page ${page} / ${totalPages}`}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-4 py-2 bg-brand text-gray-800 rounded disabled:opacity-50"
              >
                {locale === "ar" ? "التالي" : "Next"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
