import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import { WMO } from "./wmo-codes";

type Dependencies = { Clock: bg.ClockPort };

type OpenMeteoCoordinates = { latitude: number; longitude: number };
type OpenMeteoGeocodingResult = { results: Array<OpenMeteoCoordinates> };
type OpenMeteoCurrentWeatherResult = {
  current: { temperature_2m: number; apparent_temperature: number; weather_code: number };
  hourly: { precipitation_probability: Array<number> };
};

const WeatherProviderOpenMeteoAdapterError = {
  GeocodingFailed: "weather.provider.open.meteo.adapter.geocoding.failed",
  LocationNotFound: "weather.provider.open.meteo.adapter.location.not.found",
  WeatherFailed: "weather.provider.open.meteo.adapter.weather.failed",
};

export class WeatherProviderOpenMeteoAdapter implements Panel.Ports.WeatherProvider {
  private constructor(
    private readonly coordinates: OpenMeteoCoordinates,
    private readonly rounding: tools.RoundingStrategy,
    private readonly deps: Dependencies,
  ) {}

  static async build(
    location: Panel.VO.PanelLocationType,
    rounding: tools.RoundingStrategy,
    deps: Dependencies,
  ): Promise<Panel.Ports.WeatherProvider> {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", location);
    url.searchParams.set("count", "1");

    const response = await fetch(url);
    if (!response.ok) throw new Error(WeatherProviderOpenMeteoAdapterError.GeocodingFailed);

    const geocoding = (await response.json()) as OpenMeteoGeocodingResult;
    const coordinates = geocoding.results?.at(0);
    if (!coordinates) throw new Error(WeatherProviderOpenMeteoAdapterError.LocationNotFound);

    return new WeatherProviderOpenMeteoAdapter(coordinates, rounding, deps);
  }

  async read(location: Panel.VO.PanelLocationType): Promise<Panel.Ports.Weather> {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", this.coordinates.latitude.toString());
    url.searchParams.set("longitude", this.coordinates.longitude.toString());
    url.searchParams.set("hourly", "precipitation_probability");
    url.searchParams.set("forecast_days", "1");
    url.searchParams.set("current", "temperature_2m,apparent_temperature,weather_code");
    url.searchParams.set("timezone", "Europe/Warsaw");

    const response = await fetch(url);
    if (!response.ok) throw new Error(WeatherProviderOpenMeteoAdapterError.WeatherFailed);

    const weather = (await response.json()) as OpenMeteoCurrentWeatherResult;

    const probabilities = weather.hourly.precipitation_probability;
    const hour = probabilities.indexOf(Math.max(...probabilities));
    const probability = probabilities[hour];

    const condition = WMO[weather.current.weather_code];

    return {
      location,
      temperatureCelsius: tools.Int.of(this.rounding.round(weather.current.temperature_2m)),
      feelsLikeCelsius: tools.Int.of(this.rounding.round(weather.current.apparent_temperature)),
      precipitation: {
        hour: tools.Hour.fromValue(hour).get(),
        probability: tools.Int.nonNegative(probability as number),
      },
      condition: condition?.description ?? "nieznane",
      conditionImageUrl: condition?.image ?? "",
      generatedAt: this.deps.Clock.now(),
    };
  }
}
