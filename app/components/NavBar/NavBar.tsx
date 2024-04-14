"use client";

import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";
import weatherState from "@/app/State/WeatherState";
import SearchBar from "./SearchBar";
import ThemeSwitch from "./ThemToggle";
import location from "../../assest/icons8-location-24.png";
import Image from "next/image";
import newTab from "../../assest/new tab.png";
import ContextNavBar from "../ContextMenu/ContextNavBar";
import Link from "next/link";
import useCurrentLocationWeather from "@/app/hooks/useCurrentLocationWeather";
import { toJS } from "mobx";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

type WeatherData = {
  coord?: {};
  name: string;
};

const NavBar = observer(() => {
  const { cities, userCityWeather } = weatherState;
  const {} = useCurrentLocationWeather;
  const { lat, lon } = userCityWeather?.city?.coord || {};

  const [showContextMenu, setShowContextMenu] = useState(initialContextMenu);
  const [currentCity, setcurrentCity] = useState("");
  const textAreaRef = useRef<HTMLDivElement>(null);
  const contextMenuItems = [
    {
      id: 0,
      label: "See weather",
      icon: newTab,
      onclick: () => {
        if (currentCity) {
          window.open(
            `/weather?lon=${lon}&lat=${lat}&from=user&name=${currentCity}`,
            "_blank"
          );
        }
      },
    },
    {
      id: 1,
      label: "See Wiki",
      icon: newTab,
      onclick: () => {
        if (currentCity) {
          window.open(`https://en.wikipedia.org/wiki/${currentCity}`, "_blank");
        }
      },
    },
  ];

  const handleCitySelection = (lon: number, lat: number, name: number) => {
    const url = `/weather?lon=${lon}&lat=${lat}&from=city&name=${name}`;

    window.location.href = url;
  };

  const openContextMenu = (e: any, name: string) => {
    setcurrentCity(name);
    e.preventDefault();
    const { pageY, pageX } = e;
    setShowContextMenu({ show: true, x: pageX, y: pageY });
  };

  const onCloseContextMenu = () => {
    setShowContextMenu(initialContextMenu);
    setcurrentCity("");
  };

  return (
    <>
      {userCityWeather && (
        <>
          {" "}
          {showContextMenu.show && (
            <ContextNavBar
              parentRef={textAreaRef}
              onCloseContextMenu={onCloseContextMenu}
              y={showContextMenu.y}
              x={showContextMenu.x}>
              <div className="flex flex-col gap-3">
                {" "}
                {contextMenuItems.map((city, index) => (
                  <div
                    className="flex gap-1 items-center cursor-pointer"
                    key={index}
                    onClick={() => {
                      city.onclick();
                      onCloseContextMenu();
                    }}>
                    <Image src={newTab} alt="arrow-icon" />
                    <span> {city.label}</span>
                  </div>
                ))}
              </div>
            </ContextNavBar>
          )}
          <div
            ref={textAreaRef}
            className="h-40 flex flex-col md:flex-row items-center justify-center ring-4 ring-opacity-5 ring-gray-500 gap-6 md:gap-0">
            <ThemeSwitch />
            <div className="w-[90%] mx-auto flex md:flex-row justify-between items-center gap-4">
              <Link href={"/"}>
                <div className="">Stormysavvy</div>
              </Link>
              <div className="hidden md:block md:w-[40%] ">
                <SearchBar
                  cityList={
                    Array.isArray(cities) ? cities.map((city) => city) : []
                  }
                  onSelect={handleCitySelection}
                />
              </div>
              <div
                onContextMenu={(e) =>
                  openContextMenu(e, userCityWeather?.city?.name)
                }
                className="flex gap-2 justify-center items-center">
                <span className="flex gap-2 items-center w-32">
                  <Image src={location} alt="" />
                  {userCityWeather ? (
                    <Link
                      href={{
                        pathname: "/weather",
                        query: {
                          lon,
                          lat,
                          name: userCityWeather?.city?.name,
                          from: "user",
                        },
                      }}>
                      <span className="flex gap-1 items-baseline">
                        <p>{userCityWeather?.city?.name},</p>
                        <p> {userCityWeather?.city?.country}</p>
                      </span>
                    </Link>
                  ) : (
                    "..."
                  )}
                </span>
                <div className="w-10">
                  <img
                    className="w-[100%]"
                    src={`https://openweathermap.org/img/wn/${userCityWeather?.list[0]?.weather[0]?.icon}@2x.png`}
                    alt="cloud description"
                  />
                </div>
              </div>
            </div>
            <div className=" block md:hidden w-[90%]">
              <SearchBar
                cityList={
                  Array.isArray(cities) ? cities.map((city) => city) : []
                }
                onSelect={handleCitySelection}
              />
            </div>
          </div>
        </>
      )}{" "}
    </>
  );
});

export default NavBar;
