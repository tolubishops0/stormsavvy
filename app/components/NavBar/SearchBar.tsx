"use client";

import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { observer } from "mobx-react-lite";
import { useTheme } from "next-themes";
import { toJS } from "mobx";
import { CityListI } from "@/global";

type Props = {
  cityList: CityListI[];
  onSelect: any;
};

const SearchBar = observer(({ cityList, onSelect }: Props) => {
  const { resolvedTheme } = useTheme();

  const handleOnSelect = (city: { name: string }) => {
    const cityName = city.name;
    onSelect(cityName);
  };

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
      // onSearch={setSearchCity}
      // value={searchCity}
      styling={styling}
      items={cityList}
      placeholder="type to search"
    />
  );
});

export default SearchBar;
