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

  async read(
    language: tools.LanguageType,
    location: Panel.VO.PanelLocationType,
  ): Promise<Panel.Ports.Weather> {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", this.coordinates.latitude.toString());
    url.searchParams.set("longitude", this.coordinates.longitude.toString());
    url.searchParams.set("hourly", "precipitation_probability");
    url.searchParams.set("forecast_days", "1");
    url.searchParams.set("current", "temperature_2m,apparent_temperature,weather_code");
    url.searchParams.set("timezone", "Europe/Warsaw");
    url.searchParams.set("language", language);

    const response = await fetch(url);
    if (!response.ok) throw new Error(WeatherProviderOpenMeteoAdapterError.WeatherFailed);

    const weather = (await response.json()) as OpenMeteoCurrentWeatherResult;

    const hour = this.deps.Clock.now().toInstant().toZonedDateTimeISO("Europe/Warsaw").hour;

    const currentHourProbability = weather.hourly.precipitation_probability[hour] ?? 0;

    const nextHours = [1, 2, 3]
      .map((offset) => weather.hourly.precipitation_probability[hour + offset])
      .filter((value) => value !== undefined);

    const nextHoursMaxProbability = Math.max(...nextHours);

    const condition = WMO[weather.current.weather_code];

    return {
      location,
      temperatureCelsius: tools.Int.of(this.rounding.round(weather.current.temperature_2m)),
      feelsLikeCelsius: tools.Int.of(this.rounding.round(weather.current.apparent_temperature)),
      precipitation: {
        currentHourProbability: tools.Int.nonNegative(currentHourProbability),
        next3HoursMaxProbability: tools.Int.nonNegative(nextHoursMaxProbability),
      },
      condition: condition?.description ?? "nieznane",
      conditionImageUrl: condition?.image ?? "",
      generatedAt: this.deps.Clock.now(),
    };
  }
}
