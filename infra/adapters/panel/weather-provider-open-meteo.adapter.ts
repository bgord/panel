import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import { WMO } from "./wmo-codes";

type Dependencies = { Clock: bg.ClockPort };

type OpenMeteoCoordinates = { latitude: number; longitude: number };
type OpenMeteoGeocodingResult = { results: Array<OpenMeteoCoordinates> };
type OpenMeteoWeatherResult = {
  current: { temperature_2m: number; apparent_temperature: number; weather_code: number };
  hourly: { precipitation_probability: Array<number> };
};
type OpenMeteoAqiResult = { current: { us_aqi: number } };

const WeatherProviderOpenMeteoAdapterError = {
  GeocodingFailed: "weather.provider.open.meteo.adapter.geocoding.failed",
  LocationNotFound: "weather.provider.open.meteo.adapter.location.not.found",
  WeatherFailed: "weather.provider.open.meteo.adapter.weather.failed",
  AQIFailed: "weather.provider.open.meteo.adapter.aqi.failed",
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
    timezone: tools.TimezoneType,
    location: Panel.VO.PanelLocationType,
  ): Promise<Panel.Ports.Weather> {
    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", this.coordinates.latitude.toString());
    weatherUrl.searchParams.set("longitude", this.coordinates.longitude.toString());
    weatherUrl.searchParams.set("hourly", "precipitation_probability");
    weatherUrl.searchParams.set("forecast_days", "1");
    weatherUrl.searchParams.set("current", "temperature_2m,apparent_temperature,weather_code");
    weatherUrl.searchParams.set("timezone", timezone);
    weatherUrl.searchParams.set("language", language);

    const aqiUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
    aqiUrl.searchParams.set("latitude", this.coordinates.latitude.toString());
    aqiUrl.searchParams.set("longitude", this.coordinates.longitude.toString());
    aqiUrl.searchParams.set("current", "us_aqi");
    aqiUrl.searchParams.set("timezone", timezone);

    const [weatherResponse, aqiResponse] = await Promise.all([fetch(weatherUrl), fetch(aqiUrl)]);

    if (!weatherResponse.ok) throw new Error(WeatherProviderOpenMeteoAdapterError.WeatherFailed);
    if (!aqiResponse.ok) throw new Error(WeatherProviderOpenMeteoAdapterError.AQIFailed);

    const weather = (await weatherResponse.json()) as OpenMeteoWeatherResult;
    const aqi = (await aqiResponse.json()) as OpenMeteoAqiResult;

    const currentHour = this.deps.Clock.now().toInstant().toZonedDateTimeISO(timezone).hour;
    const currentHourProbability = weather.hourly.precipitation_probability[currentHour] ?? 0;
    const nextHours = [0, 1, 2]
      .map((offset) => weather.hourly.precipitation_probability[currentHour + offset])
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
      condition: condition?.description ?? "unknown",
      conditionImageUrl: condition?.image ?? "",
      aqi: tools.Int.nonNegative(aqi.current.us_aqi),
      generatedAt: this.deps.Clock.now(),
    };
  }
}
