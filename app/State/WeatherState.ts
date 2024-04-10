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

  isLoadingCurrLocWeather = false;
  isCitiesLoading = false;
  isLoadingSelectedCity = false;
  errors: DataTypes | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  currentUserCityWeather = async (
    weatherData: DataTypes,
    isLoadingCurrLocWeather: boolean
  ) => {
    this.userCityWeather = weatherData;
    this.isLoadingCurrLocWeather = isLoadingCurrLocWeather;
  };

  getCities = async (cities: DataTypes, isCitiesLoading: boolean) => {
    this.cities = cities;
    this.isCitiesLoading = isCitiesLoading;
  };

  getSeletedCityWeather = async (
    weatherData: DataTypes,
    isLoadingSelectedCity: boolean
  ) => {
    this.selectedCityWeather = weatherData;
    this.isLoadingSelectedCity = isLoadingSelectedCity;
  };
}

const weatherState = new WeatherState();
export default weatherState;
