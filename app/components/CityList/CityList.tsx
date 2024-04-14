"use client";

import { observer } from "mobx-react-lite";
import React, { useRef, useState, useEffect } from "react";
import weatherState from "@/app/State/WeatherState";
import { toJS } from "mobx";
import useGetCities from "@/app/hooks/UseGetCity";
import newTab from "../../assest/new tab.png";
import Loader from "../../Loader";
import useCurrentLocationWeather from "@/app/hooks/useCurrentLocationWeather";
import Link from "next/link";
import ContextMenu from "../ContextMenu/ContextMenu";
import Image from "next/image";
import NavBar from "../NavBar/NavBar";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

type Props = {
  show: boolean;
  x: number;
  y: number;
};

const CityList = observer(({ show, y, x }: Props) => {
  const { isCitiesLoading } = useGetCities();
  const { cities } = weatherState;

  const [sortDirection, setSortDirection] = useState("asc");
  const [cityList, setCityList] = useState([]);
  const [viewedCities, setViewedCities] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(initialContextMenu);
  const [selectedCity, setSelectedCity] = useState("");
  const textAreaRef = useRef();

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const foreCastData =
        JSON.parse(localStorage.getItem("viewed-cities") || '"') || null;
      setViewedCities(foreCastData);
    }
  }, []);

  useEffect(() => {
    if (cities) {
      setCityList(cities);
    }
  }, []);


  const mergedCities = [...cities, ...viewedCities];
  const contextMenuItems = [
    {
      id: 0,
      label: "See weather",
      icon: newTab,
      onclick: () => {
        if (selectedCity) {
          window.open(`/weather?city=${selectedCity}`, "_blank");
        }
      },
    },
    {
      id: 1,
      label: "See Wiki",
      icon: newTab,
      onclick: () => {
        if (selectedCity) {
          window.open(
            `https://en.wikipedia.org/wiki/${selectedCity}`,
            "_blank"
          );
        }
      },
    },
  ];

  const openContextMenu = (e: any, name: string, city: object) => {
    setSelectedCity(name);
    e.preventDefault();
    const { pageY, pageX } = e;
    setShowContextMenu({ show: true, x: pageX, y: pageY });
  };

  const onCloseContextMenu = () => {
    setShowContextMenu(initialContextMenu);
    setSelectedCity("");
  };

  const formatTime = (timeString, timezone) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC",
    };

    const timeMilliseconds = timeString * 1000 + timezone * 1000;

    return new Date(timeMilliseconds).toLocaleString("en-US", options);
  };

  return (
    <>
      {isCitiesLoading === false ? (
        <>
          {" "}
          {showContextMenu.show && (
            <ContextMenu
              parentRef={textAreaRef}
              onCloseContextMenu={onCloseContextMenu}
              y={showContextMenu.y}
              x={showContextMenu.x}>
              <div className="flex flex-col gap-3 ">
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
            </ContextMenu>
          )}
          <div className="py-8 overflow-y-auto overflow-x-auto no-scrollbar h-[80vh] overscroll-contain">
            {mergedCities && (
              <table
                ref={textAreaRef}
                className=" mx-auto table-fixed border  border-collapse p-4 scroll-smooth ">
                <thead>
                  <tr>
                    <th className="border text-left p-4 w-1/4">City</th>
                    <th className="border text-left  p-4 w-1/4 ">Time</th>
                    <th className="border text-left  p-4 w-1/4">Country</th>
                    <th className="border text-left  p-4 w-1/4">Population</th>
                    {viewedCities.length > 0 && (
                      <>
                        <th className="border text-left p-4 w-1/4">
                          Description
                        </th>
                        <th className="border text-left  p-4 w-1/4">
                          Temperature
                        </th>
                        <th className="border text-left  p-4 w-1/4">Sunrise</th>
                        <th className="border text-left  p-4 w-1/4">Sunset</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {mergedCities?.map((city: any, index: number) => {
                    const viewedCity = viewedCities.find(
                      (viewedCity: any) => viewedCity.name === city.name
                    );
                    return (
                      <tr key={index}>
                        <td
                          className="border p-2 w-1/4 text-sm "
                          onContextMenu={(e) =>
                            openContextMenu(e, city.name, city)
                          }>
                          <Link
                            href={{
                              pathname: "/weather",
                              query: {
                                lon: city?.coordinates?.lon,
                                lat: city?.coordinates?.lat,
                                from: "city",
                                name: city?.name,
                              },
                            }}>
                            {city.name}
                          </Link>
                        </td>
                        <td className="border p-4 w-1/4 text-sm  ">
                          {city.timezone}
                        </td>
                        <td className="border p-4 w-1/4 text-sm  ">
                          {city.cou_name_en}
                        </td>
                        <td className="border p-4 w-1/4 text-sm ">
                          {city.population}
                        </td>
                        <td className="border p-4 w-1/4 text-sm capitalize">
                          {viewedCity ? viewedCity.description : "-"}
                        </td>
                        <td className="border p-4 w-1/4 text-sm  ">
                          {viewedCity ? viewedCity.temp : "-"}
                        </td>
                        <td className="border p-4 w-1/4 text-sm ">
                          {viewedCity
                            ? formatTime(
                                viewedCity?.sunrise,
                                viewedCity?.timeZone
                              )
                            : "-"}
                        </td>
                        <td className="border p-4 w-1/4 text-sm ">
                          {viewedCity
                            ? formatTime(
                                viewedCity?.sunset,
                                viewedCity?.timeZone
                              )
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
});

export default CityList;
