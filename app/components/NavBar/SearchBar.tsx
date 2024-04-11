"use client";

import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { observer } from "mobx-react-lite";
import useCurrentLocationWeather from "@/app/hooks/useCurrentLocationWeather";
import { useTheme } from "next-themes";

type Props = {
  cityList: any[];
};

const SearchBar = observer(({ cityList }: Props) => {
  const { resolvedTheme } = useTheme();
  const { getCityWeather } = useCurrentLocationWeather();
  const [searchCity, setSearchCity] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleOnSelect = (city: {
    coordinates: { lon: number; lat: number };
  }) => {
    // console.log(city.coordinates, "selected city");
    const { lon, lat } = city.coordinates;
    getCityWeather(lat, lon);
  };

  useEffect(() => {
    if (searchCity.trim() === "") {
      setSearchResults([]);
    }
  }, [searchCity]);

  const styling = {
    border: resolvedTheme === "dark" ? "1px solid #fff" : "1px solid #000",
    borderRadius: "5px",
    backgroundColor: "transparent",
    boxShadow: "none",
    hoverBackgroundColor: "#f2f2f2",
    color: "#000",
    fontSize: "0.8rem",
    // fontFamily: "Helvetica, sans-serif",
    fontStyle: "italic",
    width: "100%",
  };

  return (
    // <div className="w-[40%] ">
      <ReactSearchAutocomplete
        onSelect={handleOnSelect}
        onSearch={setSearchCity}
        value={searchCity}
        styling={styling}
        items={cityList}
        placeholder="type to search"
      />
    // </div>
  );
});

export default SearchBar;
