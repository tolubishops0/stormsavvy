"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import weatherState from "../State/WeatherState";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const useCurrentLocationWeather = () => {
  const apiKey = "2b310f3248de81244ea7282d785589e7";

  const [currLocation, setCurrLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currLocationweather, setLocationCurrweather] = useState<object | null>(
    null
  );
  const [selectedCityWeather, setSelectedCityWeather] = useState<object | null>(
    null
  );

  const [isLoading, setisLoading] = useState(false);
  const [isCityLoading, setIsCityLoading] = useState(false);

  useEffect(() => {
    setisLoading(true);
    if (!navigator.geolocation) {
      setError("there is o geolocation");
      console.log("on your geo");
      return;
    }
    const handleSuccess = (position: GeolocationPosition) => {
      setCurrLocation(position.coords);
      setisLoading(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
      setisLoading(false);
      toast("please enable your location");
    };
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  useEffect(() => {
    setisLoading(true);
    if (currLocation) {
      const latitude = currLocation.latitude;
      const longitude = currLocation.longitude;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&cnt=5`;
      axios
        .get(url)
        .then((response) => {
          setisLoading(false);
          setLocationCurrweather(response.data);
          weatherState.currentUserCityWeather(response.data, isLoading);
        })
        .catch((error) => {
          toast(error, error.message);
          setisLoading(false);
        });
    }
  }, [currLocation]);

  const getCityWeather = (latitude: number, longitude: number) => {
    setIsCityLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&cnt=5`;
    axios
      .get(url)
      .then((response) => {
        setIsCityLoading(false);
        setSelectedCityWeather(response.data);
        weatherState.getSeletedCityWeather(response.data, isCityLoading);
      })
      .catch((error) => {
        setIsCityLoading(false);
        setError("Failed to fetch city weather data.");
      });
  };

  return { currLocationweather, selectedCityWeather, error, getCityWeather };
};

export default useCurrentLocationWeather;
