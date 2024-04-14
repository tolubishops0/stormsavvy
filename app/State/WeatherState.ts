import { makeAutoObservable, observable, action } from "mobx";
import { WeatherDataI, CityI, CoordI, CityListI, ListI } from "@/global";

type DataTypes = {
  weatherData: WeatherDataI;
  cities: CityListI[];
  errors: string;
  city: CityI;
  coord: CoordI;
  list: ListI[] | any;
};

class WeatherState {
  // @observable cities: DataTypes[] = [];

  userCityWeather: DataTypes | null = null;
  cities: DataTypes | [] = [];
  selectedCityWeather: DataTypes | null = null;
  isLoadingCurrLocWeather: boolean = false;
  isCitiesLoading: boolean = false;
  isLoadingSelectedCityWeather: boolean = false;
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
    // console.log(weatherData, "frm state");
  };

  
  getCities = async (cities: DataTypes) => {
    this.cities.push(...cities)
    // this.isCitiesLoading = isCitiesLoading;
    // console.log(cities, "cities from state");
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
