// export default HomeFoodCart;
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck
"use client";

import FoodCardNSlider from "./FoodCardNSlider";
import {
  useGetAllFoodsQuery,
  useGetSearchFoodQuery,
} from "@/redux/apiSlice/apiSlice";
import { useAppSelector } from "@/redux/hooks/hooks";
import Loading from "@/app/loading";
// import SearchInput from "../common/Search/SearchInput";

interface HomeFoodCartProps {
  selectedCountry: string;
}

const HomeFoodCart = ({ selectedCountry }: HomeFoodCartProps) => {
  // Get the search term from the Redux store
  // This will be used to determine if the user is searching for a specific food item
  // beacuse of swipper slide performance issue we are not using search input in this component
  const searchTerm = useAppSelector((state) => state.app.searchTerm);

  const {
    data: allFoodsData,
    isLoading: loadingAll,
    isFetching: fetchingAll,
  } = useGetAllFoodsQuery(undefined, {
    skip: !!searchTerm, // skip all-foods API if searching
  });

  const {
    data: searchFoodsData,
    isLoading: loadingSearch,
    isFetching: fetchingSearch,
  } = useGetSearchFoodQuery(searchTerm, {
    skip: !searchTerm, // skip search API if no search term
  });

  const loading = loadingAll || loadingSearch || fetchingAll || fetchingSearch;

  if (loading) return <Loading />;
  return (
    <div>
      {searchTerm ? (
        searchFoodsData?.items?.length > 0 ? (
          <FoodCardNSlider
            group={{ id: 0, name: "Search Results" }}
            items={searchFoodsData.items}
          />
        ) : (
          <p>No search results found for {searchTerm}</p>
        )
      ) : (
        (() => {
          const groups = allFoodsData?.group || [];
          const items = allFoodsData?.items || [];

          const filteredGroup = groups.find(
            (g) => g.name.toLowerCase() === selectedCountry.toLowerCase()
          );

          const filteredItems = filteredGroup
            ? items.filter(
                (item) => item.purchase_group_id === filteredGroup.id
              )
            : [];

          return filteredGroup ? (
            <FoodCardNSlider group={filteredGroup} items={filteredItems} />
          ) : (
            <p>No food found for {selectedCountry}</p>
          );
        })()
      )}
    </div>
  );
};

export default HomeFoodCart;
