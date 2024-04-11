"use client";

import { observer } from "mobx-react-lite";
import React from "react";
import weatherState from "@/app/State/WeatherState";
import SearchBar from "./SearchBar";
import ThemeSwitch from "./ThemToggle";
import location from "../../assest/icons8-location-24.png";
import Image from "next/image";
import { toJS } from "mobx";

const NavBar = observer(() => {
  const { cities, userCityWeather } = weatherState;

  return (
    <div className="h-40 flex flex-col md:flex-row items-center justify-center ring-4 ring-opacity-5 ring-gray-500 gap-6 md:gap-0">
      <ThemeSwitch />
      <div className="w-[90%] mx-auto flex md:flex-row justify-between items-center gap-4">
        <div>Stormysavvy</div>
        <div className="hidden md:block md:w-[40%] ">
          <SearchBar cityList={cities} />
        </div>
        <div className="flex gap-2 justify-center items-center">
          <span className="flex gap-2 items-center w-28">
            <Image src={location} alt="" />
            {userCityWeather ? (
              <span className="flex gap-1 items-baseline">
                <p>{userCityWeather?.city.name},</p>
                <p> {userCityWeather?.city.country}</p>
              </span>
            ) : (
              "..."
            )}
          </span>
          <div className="w-10">
            <img className="w-[100%]"
              src={`https://openweathermap.org/img/wn/${userCityWeather?.list[0]?.weather[0]?.icon}@2x.png`}
              alt="cloud description"
            />
          </div>
        </div>
      </div>
      <div className=" block md:hidden w-[90%]">
        <SearchBar cityList={cities} />
      </div>
    </div>
  );
});

export default NavBar;
