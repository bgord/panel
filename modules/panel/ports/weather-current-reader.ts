import type * as tools from "@bgord/tools";

type LocationType = string;

type WeatherCurrent = {
  location: LocationType;
  temperature_celsius: tools.IntegerType;
};

export interface WeatherCurrentReader {
  reader(location: LocationType): Promise<WeatherCurrent>;
}
