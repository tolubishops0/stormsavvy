"use client";

import { observer } from "mobx-react-lite";
import React from "react";
import weatherState from "@/app/State/WeatherState";
import { toJS } from "mobx";
import useGetCities from "@/app/hooks/UseGetCity";

type Props = {};

const CityList = observer((props: Props) => {
  const {} = useGetCities();

  const { cities } = weatherState;
  console.log(toJS(cities));

  return (
    <div className="py-8 overflow-y-auto no-scrollbar h-[80vh] overscroll-contain">
      <table className="w-[80%] mx-auto table-fixed  border border-spacing-2 border-separate p-4">
        <thead>
          <tr>
            <th className="border text-left text-yellow-700 p-4">City</th>
            <th className="border text-left text-yellow-700 p-4 ">Time</th>
            <th className="border text-left text-yellow-700 p-4">Country</th>
            <th className="border text-left text-yellow-700 p-4">
              Population
            </th>
          </tr>
        </thead>
        <tbody>
          {cities?.map((city, index) => (
            <tr className="border " key={index}>
              <td className="border p-4  ">{city.name}</td>
              <td className="border p-4  ">{city.timezone}</td>
              <td className="border p-4  ">{city.cou_name_en}</td>
              <td className="border p-4  ">{city.population}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default CityList;
