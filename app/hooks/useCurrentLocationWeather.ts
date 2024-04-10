"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import weatherState from "../State/WeatherState";
import { toast } from "react-toastify";
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

  const [isLoadingCurrLocWeather, setIsLoadingCurrLocWeather] = useState(false);
  const [isLoadingCurrLoc, setisLoadingCurrLoc] = useState(false);
  const [isLoadingSelectedCity, setIsLoadingSelectedCity] = useState(false);

  useEffect(() => {
    setisLoadingCurrLoc(true);
    if (!navigator.geolocation) {
      setError("there is o geolocation");
      setisLoadingCurrLoc(false);
      return;
    }
    const handleSuccess = (position: GeolocationPosition) => {
      setCurrLocation(position.coords);
      setisLoadingCurrLoc(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
      setisLoadingCurrLoc(false);
      toast("please enable your location");
    };
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  useEffect(() => {
    if (currLocation) {
      setIsLoadingCurrLocWeather(true);
      const latitude = currLocation.latitude;
      const longitude = currLocation.longitude;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&cnt=5`;
      axios
        .get(url)
        .then((response) => {
          setIsLoadingCurrLocWeather(false);
          setLocationCurrweather(response.data);
          weatherState.currentUserCityWeather(
            response.data,
            isLoadingCurrLocWeather
          );
        })
        .catch((error) => {
          toast(error, error.message);
          setIsLoadingCurrLocWeather(false);
        });
    }
  }, [currLocation]);

  const getCityWeather = (latitude: number, longitude: number) => {
    setIsLoadingSelectedCity(true);
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&cnt=5`;
    axios
      .get(url)
      .then((response) => {
        setIsLoadingSelectedCity(false);
        setSelectedCityWeather(response.data);
        weatherState.getSeletedCityWeather(response.data, isLoadingSelectedCity);
      })
      .catch((error) => {
        setIsLoadingSelectedCity(false);
        setError("Failed to fetch city weather data.");
        toast(error.massage);
      });
  };

  return { currLocationweather, selectedCityWeather, error, getCityWeather };
};

export default useCurrentLocationWeather;
