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
  const [isLoadingSelectedCityWeather, setisLoadingSelectedCityWeather] =
    useState(false);

  // const [selectedCityWeatherCoord, setSelectedCityWeatherCoord] =
  useState<Coordinates | null>(null);

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

    const locationUpdate = setInterval(() => {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }, 300000);

    return () => clearInterval(locationUpdate);
  }, []);

  useEffect(() => {
    if (currLocation) {
      setIsLoadingCurrLocWeather(true);
      const latitude = currLocation.latitude;
      const longitude = currLocation.longitude;
      // const url = `https://api.openweathermap.org/data/2.5/forcast?q=${cityname}&appid=${apiKey}&cnt=5&units=metric`;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&cnt=5&units=metric`;
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

  // const getCityWeather = (latitude: number, longitude: number) => {
  const getCityWeather = (cityname: string) => {
    setisLoadingSelectedCityWeather(true);
    // api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${apiKey}`;
    // const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&cnt=5&units=metric`;
    axios
      .get(url)
      .then((response) => {
        setisLoadingSelectedCityWeather(false);
        setSelectedCityWeather(response.data);
        weatherState.getSeletedCityWeather(
          response.data,
          isLoadingSelectedCityWeather
        );
        groupForecastByDay(response.data);
      })
      .catch((error) => {
        setisLoadingSelectedCityWeather(false);
        setError("Failed to fetch city weather data.");
        toast(error.message);
      });

    const fetchWeatherData = () => {
      axios
        .get(url)
        .then((response) => {
          setisLoadingSelectedCityWeather(false);
          setSelectedCityWeather(response.data);
          weatherState.getSeletedCityWeather(
            response.data,
            isLoadingSelectedCityWeather
          );
          groupForecastByDay(response.data);
        })
        .catch((error) => {
          setisLoadingSelectedCityWeather(false);
          setError("Failed to fetch city weather data.");
          toast(error.message);
        });
    };

    const groupForecastByDay = (forecastData) => {
      const cityName = forecastData.city.name; // Get the city name from the forecast data
      const groupedForecast = [];
      forecastData.list.forEach((forecast) => {
        const date = new Date(forecast.dt_txt);
        const dateString = date.toDateString();
        const existingGroup = groupedForecast.find(
          (group) => group.dateString === dateString
        );
        if (!existingGroup) {
          groupedForecast.push({
            cityName: cityName,
            dateString: dateString,
            forecasts: [forecast],
          });
        } else {
          existingGroup.forecasts.push(forecast);
        }
      });
      findClosestForecast(groupedForecast);
      return groupedForecast;
    };

    const findClosestForecast = (groupedForecast) => {
      const cityName = groupedForecast[0]?.cityName;
      const closestForecasts = [{ cityName: cityName }];
      groupedForecast.reverse(); 
      groupedForecast.forEach((group) => {
        const forecastsForDay = group.forecasts;
        const closestForecast = forecastsForDay.find((item) => {
          const forecastTime = new Date(item.dt_txt).getHours();
          return forecastTime === 12;
        });
        if (closestForecast) {
          closestForecasts.unshift(closestForecast);
        }
      });
      saveForecastToLocalStorage(closestForecasts);
      return closestForecasts;
    };

    const saveForecastToLocalStorage = (forecast) => {
      localStorage.setItem("foreCast", JSON.stringify(forecast));
    };
    const getCityWeatherInterval = setInterval(fetchWeatherData, 300000);

    return () => clearInterval(getCityWeatherInterval);
  };

  return { currLocationweather, selectedCityWeather, error, getCityWeather };
};

export default useCurrentLocationWeather;
