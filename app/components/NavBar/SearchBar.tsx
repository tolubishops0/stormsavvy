"use client";

import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { observer } from "mobx-react-lite";
import useCurrentLocationWeather from "@/app/hooks/useCurrentLocationWeather";
import { useTheme } from "next-themes";
import Link from "next/link";

type Props = {
  cityList: any[];
  onSelect: any;
};

const SearchBar = observer(({ cityList, onSelect }: Props) => {
  const { resolvedTheme } = useTheme();
  const { getCityWeather } = useCurrentLocationWeather();
  const [searchCity, setSearchCity] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cord, setCord] = useState({
    lon: null,
    lat: null,
    cityName: null,
  });

  const handleOnSelect = (city: {
    coordinates: { lon: number; lat: number };
  }) => {
    const { lon, lat } = city.coordinates;
    const cityName = city.name;
    onSelect(lon, lat, cityName);
  };

  useEffect(() => {
    if (searchCity.trim() === "") {
      setSearchResults([]);
    }
  }, [searchCity]);

  const styling = {
    border: resolvedTheme === "dark" ? "1px solid #fff" : "1px solid #000",
    borderRadius: "5px",
    backgroundColor: "#f8f8f8",
    boxShadow: "none",
    hoverBackgroundColor: "#f2f2f2",
    color: "#000",
    fontSize: "0.8rem",
    // fontFamily: "Helvetica, sans-serif",
    fontStyle: "italic",
    width: "100%",
  };

  return (
    <ReactSearchAutocomplete
      onSelect={handleOnSelect}
      onSearch={setSearchCity}
      value={searchCity}
      styling={styling}
      items={cityList}
      placeholder="type to search"
    />
  );
});

export default SearchBar;
