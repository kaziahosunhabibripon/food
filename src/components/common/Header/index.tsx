"use client";

import React from "react";
import Hero from "./Hero";
import TopBarTwo from "./TopBarTwo";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <>
      <TopBarTwo />

      <Navbar />

      <Hero />
    </>
  );
};

export default Header;
