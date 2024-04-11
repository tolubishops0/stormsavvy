"use client";

import { useEffect, useState } from "react";
import useCurrentLocationWeather from "./hooks/useCurrentLocationWeather";
import useGetCities from "./hooks/UseGetCity";
import weatherState from "./State/WeatherState";
import { toJS } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import Loader from "./Loader";

import NavBar from "./components/NavBar/NavBar";
import CityList from "./components/CityList/CityList";

type Props = {
  city: {};
};

const Page: React.FC = () => {
  useEffect(() => {}, []);
  // const {} = useGetCities();
  const { getCityWeather } = useCurrentLocationWeather();

  const {
    userCityWeather,
    cities,
    selectedCityWeather,
    isCitiesLoading,
    isLoadingSelectedCity,
    isLoadingCurrLocWeather,
  } = weatherState;

  return (
    <div className="w-[90%] mx-auto">
      <ToastContainer />
      <CityList />
    </div>
  );
};

export default Page;
