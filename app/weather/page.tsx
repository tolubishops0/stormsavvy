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
import Link from "next/link";
import sunrise from "../assest/icons8-sun-48.png";
import sunset from "../assest/icons8-sunset-48.png";
import humid from "../assest/icons8-humidity-48.png";
import wind from "../assest/icons8-wind-48.png";
import face from "../assest/icons8-face-48.png";
import pressure from "../assest/icons8-pressure-48.png";
import arrow from "../assest/icons8-right-arrow-30.png";
import convert from "../assest/icons8-convert-48.png";
import ContextMenuTemp from "../components/ContextMenu/ContextMenuTemp";
import NavBar from "../components/NavBar/NavBar";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

type tableData = {
  temp: number;
  sunrise: number;
  sunset: number;
  description: string;
  name: string;
  timeZone: number;
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
    isLoadingSelectedCityWeather,
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
  const textAreaRef = useRef<HTMLDivElement>(null);

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
      return `${convertedTemperature}F`; // Celsius to Fahrenheit
    } else if (selectedTemp === "K") {
      convertedTemperature = temperatureCelsius + 273.15; // Celsius to Kelvin
      return `${convertedTemperature}K`;
    }
    convertedTemperature = Math.ceil(convertedTemperature);
    return `${convertedTemperature}°C`;
  }

  useEffect(() => {
    if (cityname) {
      getCityWeather(cityname);
    }
  }, [cityname]);

  useEffect(() => {
    if (from === "user") {
      if (userCityWeather?.list) {
        setList(userCityWeather.list);
        setcityName(userCityWeather?.city);
      }
    } else {
      setList(selectedCityWeather?.list);
      setcityName(selectedCityWeather?.city);
      addViewedCity(selectedCityWeather);
    }
  }, [userCityWeather, selectedCityWeather]);

  const addViewedCity = (selectedCityWeather: []) => {
    const newViewedCityData = {
      name: selectedCityWeather?.city?.name || null,
      temp: selectedCityWeather?.list[0]?.main?.temp || null,
      sunrise: selectedCityWeather?.city?.sunrise || null,
      sunset: selectedCityWeather?.city?.sunset || null,
      description:
        selectedCityWeather?.list[0]?.weather[0]?.description || null,
      timeZone: selectedCityWeather?.city?.timezone || null,
    };
    const viewedCitiesloaclstorage = localStorage.getItem("viewed-cities");
    const viewedCities = JSON.parse(viewedCitiesloaclstorage) || [];

    const isAlreadyViewed = viewedCities.some(
      (city) => city.name === newViewedCityData.name
    );

    if (!isAlreadyViewed) {
      viewedCities.push(newViewedCityData);
      localStorage.setItem("viewed-cities", JSON.stringify(viewedCities));
    }
  };

  const formatDate = (dateString: string) => {
    const options = {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  const formatTime = (timeString: string, timezone: number) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
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
    <>
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
        {isLoadingCurrLocWeather || isLoadingSelectedCityWeather ? (
          <Loader />
        ) : (
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div className="flex flex-col items-center justify-center w-[100%] lg:w-[30%]">
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
                    <Link
                      href={{
                        pathname: "/forecasts",
                        query: {
                          lon,
                          lat,
                          name: cityName?.name || cityname,
                          from: from === "user" ? "user" : "city",
                        },
                      }}>
                      {" "}
                      <p className="font-normal text-base text-white cursor-pointer">
                        View more forecast
                      </p>
                    </Link>

                    <Image src={arrow} alt="arrow" />
                  </div>
                </>
              )}
            </div>
            {list?.length > 1 && (
              <div className="flex flex-col w-[100%] lg:w-[70%]">
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
    </>
  );
});
export default WeatherDetail;
