"use-client";
import { useEffect, useState } from "react";
import axios from "axios";
import weatherState from "../State/WeatherState";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useGetCities = () => {
  // const [cities, setCities] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCitiesLoading, setisCitiesLoading] = useState(false);
  const { userCityWeather } = weatherState;

  useEffect(() => {
    setisCitiesLoading(true);
    if (userCityWeather) {
      const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=99`;
      axios
        .get(url)
        .then((response) => {
          // setCities(response.data.results);
          weatherState.getCities(response.data.results);
          setisCitiesLoading(false);
        })
        .catch((error) => {
          setError(error.massage);
          toast(error.message);
          setisCitiesLoading(false);
        });
    }
  }, [userCityWeather]);
  return { isCitiesLoading };
};

export default useGetCities;
