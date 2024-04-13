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

  const {
    userCityWeather,
    selectedCityWeather,
    isLoadingCurrLocWeather,
    isLoadingSelectedCityWeather,
  } = weatherState;

  const [isLoading, setisLoading] = useState(false);
  const [forecastDay, setForecastDay] = useState();
  const [selectedTemp, setselectedTemp] = useState("C");

  const [showContextMenu, setShowContextMenu] = useState(initialContextMenu);
  const textAreaRef = useRef();
  const search = useSearchParams();

  const from = search.get("from");
  const lon = search.get("lon");
  const lat = search.get("lat");

  useEffect(() => {
    if (!userCityWeather && from === "user") {
      getCityWeather(lon, lat);
    }

    if (!selectedCityWeather && from !== "user") {
      getCityWeather(lon, lat);
      console.log("not from user");
    }
  }, [
    userCityWeather,
    selectedCityWeather,
    isLoadingCurrLocWeather,
    isLoadingSelectedCityWeather,
  ]);

  useEffect(() => {
    if (from === "user") {
      setForecastDay(userCityWeather);
    } else {
      setForecastDay(selectedCityWeather);
    }
  }, [userCityWeather, selectedCityWeather, from]);
  useEffect(() => {
    // setisLoading(true);
    if (userCityWeather) {
      setisLoading(false);
    } else if (userCityWeather && selectedCityWeather) {
      setisLoading(false);
    }
  }, []);
  console.log(toJS(forecastDay));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today " + date.getDate();
    } else if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return "today" + date.getDate();
    } else {
      return date.getDate();
    }
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

  function convertTemperature(temperatureCelsius, selectedTemp) {
    let convertedTemperature = temperatureCelsius;

    if (selectedTemp === "F") {
      return (convertedTemperature = `${(
        (temperatureCelsius * 9) / 5 +
        32
      ).toFixed(2)}F`);
    } else if (selectedTemp === "K") {
      return (convertedTemperature = `${(temperatureCelsius + 273.15).toFixed(
        2
      )}K`); 
    }
    console.log(convertedTemperature.toFixed(2));
    return `${convertedTemperature}°C`;
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
            {forecastDay &&
              forecastDay?.list?.map((item, index) => (
                <>
                  <div
                    key={index}
                    className="flex justify-between items-center ">
                    <p>{formatDate(item?.dt_txt)}</p>
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
                  {index !== forecastDay?.list?.length - 1 && (
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
