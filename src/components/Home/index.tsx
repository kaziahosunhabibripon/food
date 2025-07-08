"use client";
import React, { useState } from "react";
import CountryCategory from "./CountryCategory";
import FoodCards from "./FoodCards";
import Header from "../common/Header";
import HomeFoodCart from "./HomeFoodCart";
import ProjectStatusCounter from "./ProjectStatusCounter";
import ReserveATable from "./ReserveATable";
// import Reviews from "../Reviews/page";
// import Brand from "../Brand/page";
import Information from "../information/page";
// import TopModal from "../OpeningModal/page";
import TopSelling from "./TopSelling";
import MostPopular from "./Popular";
import RecentlyView from "./RecentView";
import Offer from "./Offer";
import HurryUpDeals from "./Hurryup";
import LatestPost from "./Blogs";
import Popular from "@/app/popular/page";
import SubscribeUs from "../SubscribeUs/Subscribe";
import TopModal from "../OpeningModal/page";

const HomeComponent = () => {
  // State to manage the selected country by default is set to "Arabic"
  // This will be passed to HomeFoodCart to filter food items based on the selected country
  const [selectedCountry, setSelectedCountry] = useState("Arabic");

  return (
    <div className="relative">
      <Header />
      <TopModal />
      <FoodCards />
      <CountryCategory onSelectCountry={setSelectedCountry} />
      <HomeFoodCart selectedCountry={selectedCountry} />
      {/* <BookATable /> */}
      <TopSelling />
      <MostPopular />
      <RecentlyView />
      <Offer />
      <HurryUpDeals />
      <LatestPost />
      <ReserveATable />
      <Popular />
      <SubscribeUs />
      {/* <Reviews /> */}
      <ProjectStatusCounter />

      {/* <Brand /> */}

      <Information />
    </div>
  );
};

export default HomeComponent;
