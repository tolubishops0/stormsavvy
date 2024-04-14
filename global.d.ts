type DateText = string;

export interface CoordI {
  lon: number;
  lat: number;
}

export interface CityListI {
  city: string;
  country: string;
  timezone: number;
  population: number;
}

export interface CityI {
  id?: number;
  coord: CoordI;
  country: string;
  timezone: number;
  sunrise: number;
  sunset: number;
  name: string;
  population?: number;
}

export interface MainI {
  temp?: number;
  tem_min?: number;
  tem_max?: number;
  feelsLike?: number;
  pressure?: number;
  humidity?: number;
}

export interface WindI {
  speed: number;
  deg: number;
  gust: number;
}

export interface WeatherTypeI {
  id?: number;
  main: string;
  description: string;
  icon: string;
}

export interface ListI {
  wind: WindI;
  main: MainI;
  cloud?: { all: number };
  date: number;
  dateText: DateText;
  pop?: number;
  visibilty?: number;
  weather: WeatherTypeI;
}

export interface WeatherDataI {
  city: CityI;
  list: ListI[];
  cnt?: number;
  cod?: number;
  message?: number;
}
