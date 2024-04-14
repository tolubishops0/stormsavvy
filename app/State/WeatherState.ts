import { makeAutoObservable } from "mobx";

type DataTypes = {
  weatherData: {};
  cities: [];
  errors: string;
  city: {};
  coord: {};
};

class WeatherState {
  userCityWeather: DataTypes | null = null;
  cities: DataTypes | [] = [];
  selectedCityWeather: DataTypes | null = null;
  isLoadingCurrLocWeather = false;
  isCitiesLoading = false;
  isLoadingSelectedCityWeather = false;
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
    console.log(isLoadingCurrLocWeather);
  };

  getCities = async (cities: DataTypes) => {
    this.cities = cities;
    // this.isCitiesLoading = isCitiesLoading;
    // console.log(isCitiesLoading, "from state");
  };

  getSeletedCityWeather = async (
    weatherData: DataTypes,
    isLoadingSelectedCityWeather: boolean
  ) => {
    this.selectedCityWeather = weatherData;
    this.isLoadingSelectedCityWeather = isLoadingSelectedCityWeather;
    // console.log(weatherData);
  };
}

const weatherState = new WeatherState();
export default weatherState;
