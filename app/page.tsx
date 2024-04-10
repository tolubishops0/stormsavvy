"use client";

import { useEffect, useState } from "react";
import useCurrentLocationWeather from "./hooks/useCurrentLocationWeather";
import useGetCities from "./hooks/UseGetCity";
import weatherState from "./State/WeatherState";
import { toJS } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import Loader from "./Loader";

type Props = {
  city: {};
};

const Page: React.FC = () => {
  useEffect(() => {}, []);
  const {} = useGetCities();
  const { getCityWeather } = useCurrentLocationWeather();

  const {
    userCityWeather,
    cities,
    selectedCityWeather,
    isLoading,
    isLoadingCity,
    errors,
  } = weatherState;
  console.log(isLoading);

  const getCityCoord = (city: {
    coordinates: { lon: number; lat: number };
  }) => {
    const { lon, lat } = city.coordinates;
    getCityWeather(lat, lon);
  };

  return (
    <div>
      <ToastContainer />
      {isLoading && <Loader />}
      {isLoadingCity && <>...isLoadingCity</>}
      {selectedCityWeather && (
        <>
          <p>latitude:{selectedCityWeather.city.coord.lat}</p>
          <p>longitude:{selectedCityWeather.city.coord.lon}</p>
        </>
      )}
      {userCityWeather && (
        <h2>
          your city is :{userCityWeather.city.name} and it is a{" "}
          {userCityWeather.list[0].weather[0].description} today
        </h2>
      )}
      {cities &&
        cities.map((city, index) => (
          <h6 onClick={() => getCityCoord(city)} key={index}>
            {city.name}
          </h6>
        ))}
    </div>
  );
};

export default Page;
