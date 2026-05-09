import type * as tools from "@bgord/tools";

type LocationType = string;

export type WeatherCurrent = {
  location: LocationType;
  temperature_celsius: tools.IntegerType;
};

export interface WeatherCurrentReader {
  read(location: LocationType): Promise<WeatherCurrent>;
}
