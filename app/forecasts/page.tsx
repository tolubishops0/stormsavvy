"use client";

import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useRef } from "react";
import weatherState from "../State/WeatherState";
import NavBar from "../components/NavBar/NavBar";
import useCurrentLocationWeather from "../hooks/useCurrentLocationWeather";
import { useSearchParams } from "next/navigation";
import { toJS } from "mobx";
import Loader from "../Loader";
import { FormatDateOptions } from "date-fns";
import convert from "../assest/icons8-convert-48.png";
import Image from "next/image";
import ContextMenuTemp from "../components/ContextMenu/ContextMenuTemp";

type Props = {
  lon: number;
  lat: number;
};
const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

const Forecast = observer(({}: Props) => {
  const { getCityWeather } = useCurrentLocationWeather();

  const [isLoading, setisLoading] = useState(false);
  const [selectedTemp, setselectedTemp] = useState("C");
  const [forecast, setForcast] = useState<[] | null>(null);

  const [showContextMenu, setShowContextMenu] = useState(initialContextMenu);
  const textAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const foreCastData = JSON.parse(localStorage.getItem("foreCast") || '"');
      setForcast(foreCastData);
    }
  }, []);

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    if (forecast) {
      setisLoading(false);
    }
  }, []);

  const formatDate = (dateString: string, index: number) => {
    const date = new Date(dateString).getDate();
    const dayInWeek = new Date().getDay();
    const fordays = weekDays
      .slice(dayInWeek, weekDays.length)
      .concat(weekDays.slice(0, dayInWeek));

    return `${fordays[index]}, ${date}`;
  };

  const contextMenuItems = [
    {
      id: 0,
      label: "To F",
      value: "F",
    },
    {
      id: 1,
      label: "Kelvin",
      value: "K",
    },
  ];
  if (selectedTemp !== "C") {
    contextMenuItems.push({ id: 3, label: "Celsius", value: "C" });
  }

  function convertTemperature(
    temperatureCelsius: number,
    selectedTemp: string
  ) {
    let convertedTemperature = temperatureCelsius;
    if (selectedTemp === "F") {
      convertedTemperature = (temperatureCelsius * 9) / 5 + 32;
      return `${convertedTemperature.toFixed(2)}F`;
    } else if (selectedTemp === "K") {
      convertedTemperature = temperatureCelsius + 273.15;
      return `${convertedTemperature.toFixed(2)}K`;
    }
    return `${convertedTemperature.toFixed(2)}°C`;
  }

  const openContextMenu = (e: any) => {
    e.preventDefault();
    const { pageY, pageX } = e;
    setShowContextMenu({ show: true, x: pageX, y: pageY });
  };

  const onCloseContextMenu = () => {
    setShowContextMenu(initialContextMenu);
  };

  return (
    <div className="w-[90%] mx-auto ">
      {!isLoading ? (
        <>
          <div
            ref={textAreaRef}
            onClick={(e) => {
              openContextMenu(e);
            }}
            className="fixed top-[50%] left-0 cursor-pointer">
            {" "}
            <Image src={convert} alt="convert-icon" />
          </div>
          {showContextMenu.show && (
            <ContextMenuTemp
              parentRef={textAreaRef}
              onCloseContextMenu={onCloseContextMenu}
              y={showContextMenu.y}
              x={showContextMenu.x}>
              <div className="flex flex-col gap-3">
                {" "}
                {contextMenuItems.map((temp, index) => (
                  <div
                    className="flex gap-1 items-center cursor-pointer"
                    key={index}>
                    <p
                      onClick={() => {
                        setselectedTemp(temp.value);
                        onCloseContextMenu();
                      }}>
                      {temp.label}
                    </p>
                  </div>
                ))}
              </div>
            </ContextMenuTemp>
          )}
          <div className="flex flex-col justify-center my-8">
            {forecast && (
              <p className="text-center font-bold mb-6">{forecast[5]?.cityName}</p>
            )}
            {forecast &&
              forecast?.slice(0, 5)?.map((item, index) => (
                <>
                  <div
                    key={index}
                    className="flex justify-between items-center ">
                    <p className="text-sm">{formatDate(item?.dt_txt, index)}</p>
                    <div className="flex items-center">
                      {" "}
                      <img
                        className="w-[3rem]"
                        src={`https://openweathermap.org/img/wn/${item?.weather[0]?.icon}@2x.png`}
                        alt={item?.weather[0]?.description}
                      />
                      <p className="font-normal text-base text-slate-300">
                        {item?.weather[0]?.main}
                      </p>
                    </div>

                    <p className="font-semibold text-lg">
                      {convertTemperature(item?.main?.temp, selectedTemp)}
                    </p>
                  </div>
                  {index !== forecast?.length - 2 && (
                    <hr className="flex-grow border-t border-gray-300  my-7"></hr>
                  )}
                </>
              ))}
          </div>
        </>
      ) : (
        <Loader />
      )}
      <div></div>
    </div>
  );
});

export default Forecast;
