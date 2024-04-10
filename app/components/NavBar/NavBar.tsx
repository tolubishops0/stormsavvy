"use client";

import { observer } from "mobx-react-lite";
import React from "react";
import weatherState from "@/app/State/WeatherState";
import SearchBar from "./SearchBar";
import ThemeSwitch from "./ThemToggle";
import location from "../../assest/icons8-location-24.png";
import Image from "next/image";

const NavBar = observer(() => {
  const { cities, userCityWeather } = weatherState;

  return (
    <div className="h-32 flex items-center ring-4 ring-opacity-5 ring-gray-500 ">
      <div className="w-[90%] mx-auto flex justify-between items-center">
        <div> Stormysavvy</div>
        <SearchBar cityList={cities} />
        <div className="flex gap-3 justify-center items-center">
          <span className="flex gap-1 items-center">
            {" "}
            <Image src={location} alt="" />
            <p>Lagos</p>
          </span>

          <img src={`https://openweathermap.org/img/wn/10d@2x.png`} />
        </div>
        <ThemeSwitch />
      </div>
    </div>
  );
});

export default NavBar;
