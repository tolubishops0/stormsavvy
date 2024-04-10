"use-client";
import { useEffect, useState } from "react";
import axios from "axios";
import weatherState from "../State/WeatherState";

const useGetCities = () => {
  const [cities, setCities] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const { userCityWeather } = weatherState;

  useEffect(() => {
    if (userCityWeather) {
      setisLoading(true);
      const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=99`;
      axios
        .get(url)
        .then((response) => {
          setisLoading(false);
          setCities(response.data.results);
          weatherState.getCities(response.data.results, isLoading);
        })
        .catch((error) => {
          setError(error.massage);
          setisLoading(false);
        });
    }
  }, [userCityWeather]);
  return { cities, error };
};

export default useGetCities;
