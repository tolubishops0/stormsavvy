"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
import weatherState from "../State/WeatherState";
import useCurrentLocationWeather from "../hooks/useCurrentLocationWeather";
import Loader from "../Loader";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import sunrise from "../assest/icons8-sun-48.png";
import sunset from "../assest/icons8-sunset-48.png";
import humid from "../assest/icons8-humidity-48.png";
import wind from "../assest/icons8-wind-48.png";
import face from "../assest/icons8-face-48.png";
import pressure from "../assest/icons8-pressure-48.png";
import arrow from "../assest/icons8-right-arrow-30.png";
import convert from "../assest/icons8-convert-48.png";
import ContextMenuTemp from "../components/ContextMenu/ContextMenuTemp";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

type Props = {
  lon: Number;
  lat: Number;
  list: [];
  isLoadingCurrLocWeather: boolean;
  show: boolean;
  x: number;
  y: number;
};

const WeatherDetail = observer(({}: Props) => {
  const { getCityWeather } = useCurrentLocationWeather();
  const {
    userCityWeather,
    selectedCityWeather,
    isLoadingCurrLocWeather,
    isLoadingSelectedCity,
  } = weatherState;

  const searchParams = useSearchParams();
  const lon = searchParams.get("lon");
  const lat = searchParams.get("lat");
  const from = searchParams.get("from");
  const cityname = searchParams.get("name");

  const [list, setList] = useState([]);
  const [cityName, setcityName] = useState("");
  const [selectedTemp, setselectedTemp] = useState("C");

  const [showContextMenu, setShowContextMenu] = useState(initialContextMenu);
  const textAreaRef = useRef();

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
      return (convertedTemperature = `${(temperatureCelsius * 9) / 5 + 32}F`); // Celsius to Fahrenheit
    } else if (selectedTemp === "K") {
      return (convertedTemperature = `${temperatureCelsius + 273.15}K`); // Celsius to Kelvin
    }
    convertedTemperature = Math.ceil(convertedTemperature);
    return `${convertedTemperature}°C`;
  }

  useEffect(() => {
    if (lon && lat) {
      getCityWeather(Number(lon), Number(lat));
    }
  }, [lon, lat]);

  // useEffect(() => {
  //   if (cityname) {
  //     getCityWeather(cityname);
  //     // getCityWeather(Number(lon), Number(lat));
  //   }
  // }, [cityname]);

  useEffect(() => {
    if (from === "user") {
      if (userCityWeather?.list) {
        setList(userCityWeather.list);
        setcityName(userCityWeather?.city);
      }
    } else if (selectedCityWeather?.list) {
      setList(selectedCityWeather?.list);
      setcityName(selectedCityWeather?.city);
    }
  }, [userCityWeather, selectedCityWeather]);

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  const formatTime = (timeString, timezone) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "UTC",
    };

    const timeMilliseconds = timeString * 1000 + timezone * 1000;

    return new Date(timeMilliseconds).toLocaleString("en-US", options);
  };

  const openContextMenu = (e: any) => {
    e.preventDefault();
    const { pageY, pageX } = e;
    setShowContextMenu({ show: true, x: pageX, y: pageY });
  };

  const onCloseContextMenu = () => {
    setShowContextMenu(initialContextMenu);
  };

  return (
    <div className="w-[90%] mx-auto mb-8">
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
      <div
        ref={textAreaRef}
        onClick={(e) => {
          openContextMenu(e);
        }}
        className="fixed top-[50%] left-0 cursor-pointer">
        {" "}
        <Image src={convert} alt="convert-icon" />
      </div>
      {isLoadingCurrLocWeather || isLoadingSelectedCity ? (
        <Loader />
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col md:flex-row items-center justify-center ">
            {list?.length > 0 && (
              <>
                <div className="flex flex-col justify-center items-center">
                  <img
                    className="w-[90%]"
                    src={`https://openweathermap.org/img/wn/${list[0].weather[0].icon}@2x.png`}
                    alt={list[0]?.weather[0].description}
                  />

                  <div className="flex flex-col gap-3 items-center justify-center">
                    {" "}
                    <p className="text-5xl font-black bg-gradient-to-b from-white to-gray-700 text-transparent bg-clip-text">
                      {convertTemperature(list[0]?.main?.temp, selectedTemp)}
                    </p>
                    <p className="capitalize text-4xl font-normal">
                      {cityName?.name || cityname}
                    </p>
                    <p className="capitalize text-2xl font-base">
                      {list[0]?.weather[0].description}
                    </p>
                    <p className="capitalize text-base font-base text-slate-300">
                      {formatDate(list[0]?.dt_txt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 my-8">
                  <p className="font-normal text-base text-white">Next Days</p>
                  <Image src={arrow} alt="arrow" />
                </div>
              </>
            )}
          </div>
          {list.length > 1 && (
            <div className="flex flex-col ">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex item-center gap-2 justify-start">
                    <Image src={sunrise} alt="sunrise" />
                    <span className="flex flex-col item-center gap-2 justify-start">
                      <p className="font-normal text-base text-slate-300">
                        {" "}
                        Sunrise
                      </p>
                      <p className="font-semibold text-lg">
                        {" "}
                        {formatTime(cityName?.sunrise, cityName?.timezone)}
                      </p>
                    </span>
                  </div>
                  <div className="flex item-baseline gap-2 justify-start">
                    <Image src={sunset} alt="sunset" />
                    <span className="flex flex-col item-center gap-2 justify-start">
                      <p className="font-normal text-base text-slate-300">
                        {" "}
                        Sunset
                      </p>
                      <p className="font-semibold text-lg">
                        {" "}
                        {formatTime(cityName?.sunset, cityName?.timezone)}
                      </p>
                    </span>
                  </div>
                </div>
                <hr className="flex-grow border-t border-gray-300  my-5"></hr>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex item-center gap-2 justify-start">
                    <Image src={humid} alt="sunrise" />
                    <span className="flex flex-col item-center gap-1 justify-start">
                      <p className="font-normal text-base text-slate-300">
                        {" "}
                        Humid
                      </p>
                      <p className="font-semibold text-lg">
                        {list[0]?.main?.humidity}%
                      </p>
                    </span>
                  </div>
                  <div className="flex item-baseline gap-2 justify-start">
                    <Image src={face} alt="sunset" />
                    <span className="flex flex-col item-center gap-2 justify-start">
                      <p className="font-normal text-base text-slate-300">
                        {" "}
                        Feels like
                      </p>
                      <p className="font-semibold text-lg">
                        {" "}
                        {convertTemperature(
                          list[0]?.main?.feels_like,
                          selectedTemp
                        )}
                      </p>
                    </span>
                  </div>
                </div>
                <hr className="flex-grow border-t border-gray-300  my-5"></hr>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex item-center gap-2 justify-start">
                    <Image src={pressure} alt="sunrise" />
                    <span className="flex flex-col item-center gap-1 justify-start">
                      <p className="font-normal text-base text-slate-300">
                        {" "}
                        Pressure
                      </p>
                      <p className="font-semibold text-lg">
                        {list[0]?.main?.humidity}hPa
                      </p>
                    </span>
                  </div>
                  <div className="flex item-baseline gap-2 justify-start">
                    <Image src={wind} alt="sunset" />
                    <span className="flex flex-col item-center gap-2 justify-start">
                      <p className="font-normal text-base text-slate-300">
                        {" "}
                        Wind
                      </p>
                      <p className="font-semibold text-lg">
                        {" "}
                        {list[0]?.main?.speed}m/s
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
export default WeatherDetail;

{
  /* {list.length > 1 && (
            <div>
              <h2>Upcoming Forecasts</h2>
              <ul>
                {list.slice(1).map((item, index) => (
                  <li key={index}>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].description}
                    />
                    <p>{item.weather[0].description}</p>
                    <p>{list[0]?.main?.temp}°C</p>
                  </li>
                ))}
              </ul>
            </div>
          )} */
}
