import { makeAutoObservable } from "mobx";

type DataTypes = {
  weatherData: {};
  cities: [];
  errors: string;
};

class WeatherState {
  userCityWeather: DataTypes | null = null;
  cities: DataTypes | [] = [];
  selectedCityWeather: DataTypes | null = null;
  isLoading = false;
  isLoadingCity = false;
  errors: DataTypes | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  currentUserCityWeather = async (
    weatherData: DataTypes,
    isLoading: boolean,
  ) => {
    this.userCityWeather = weatherData;
    this.isLoading = true;
  };

  getCities = async (cities: DataTypes, isLoading: boolean) => {
    this.cities = cities;
    this.isLoading = true;
  };

  getSeletedCityWeather = async (
    weatherData: DataTypes,
    isLoadingCity: boolean
  ) => {
    this.selectedCityWeather = weatherData;
    this.isLoadingCity = isLoadingCity;
  };
}

const weatherState = new WeatherState();
export default weatherState;
