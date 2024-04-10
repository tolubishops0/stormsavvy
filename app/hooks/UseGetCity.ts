"use-client";
import { useEffect, useState } from "react";
import axios from "axios";
import weatherState from "../State/WeatherState";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useGetCities = () => {
  const [cities, setCities] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCitiesLoading, setisCitiesLoading] = useState(false);
  const { userCityWeather } = weatherState;
  

  useEffect(() => {
    if (userCityWeather) {
      setisCitiesLoading(true);
      const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=99`;
      axios
        .get(url)
        .then((response) => {
          setisCitiesLoading(false);
          setCities(response.data.results);
          weatherState.getCities(response.data.results, isCitiesLoading);
        })
        .catch((error) => {
          setError(error.massage);
          setisCitiesLoading(false);
          toast(error.massage);
        });
    }
  }, [userCityWeather]);
  return { cities, error };
};

export default useGetCities;
