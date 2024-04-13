"use client";

import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";
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

  const [showContextMenu, setShowContextMenu] = useState(initialContextMenu);
  const [selectedCity, setSelectedCity] = useState("");
  const textAreaRef = useRef();

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
    console.log(toJS(city));
    const { pageY, pageX } = e;
    setShowContextMenu({ show: true, x: pageX, y: pageY });
  };

  const onCloseContextMenu = () => {
    setShowContextMenu(initialContextMenu);
    setSelectedCity("");
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
            <table
              ref={textAreaRef}
              className=" mx-auto table-fixed border border-spacing-2 border-separate p-4 scroll-smooth ">
              <thead>
                <tr>
                  <th className="border text-left text-yellow-700 p-4 w-1/4">
                    City
                  </th>
                  <th className="border text-left text-yellow-700 p-4 w-1/4 ">
                    Time
                  </th>
                  <th className="border text-left text-yellow-700 p-4 w-1/4">
                    Country
                  </th>
                  <th className="border text-left text-yellow-700 p-4 w-1/4">
                    Population
                  </th>
                </tr>
              </thead>
              <tbody>
                {cities?.map((city: any, index: number) => (
                  <tr key={index}>
                    <td
                      className="border p-2 w-1/4 "
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
                    <td className="border p-4 w-1/4 ">{city.timezone}</td>
                    <td className="border p-4 w-1/4 ">{city.cou_name_en}</td>
                    <td className="border p-4 w-1/4 ">{city.population}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
});

export default CityList;
