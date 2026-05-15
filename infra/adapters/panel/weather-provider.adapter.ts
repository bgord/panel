import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

type OpenMeteoCoordinates = { latitude: number; longitude: number };
type OpenMeteoGeocodingResult = { results: Array<OpenMeteoCoordinates> };
type OpenMeteoCurrentWeatherResult = {
  current: { temperature_2m: number };
  hourly: { precipitation_probability: Array<number> };
};

const WeatherProviderOpenMeteoAdapterError = {
  GeocodingFailed: "weather.provider.open.meteo.adapter.geocoding.failed",
  LocationNotFound: "weather.provider.open.meteo.adapter.location.not.found",
  WeatherFailed: "weather.provider.open.meteo.adapter.weather.failed",
};

class WeatherProviderOpenMeteoAdapter implements Panel.Ports.WeatherProvider {
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
    url.searchParams.set("current", "temperature_2m");
    url.searchParams.set("timezone", "Europe/Warsaw");

    const response = await fetch(url);
    if (!response.ok) throw new Error(WeatherProviderOpenMeteoAdapterError.WeatherFailed);

    const weather = (await response.json()) as OpenMeteoCurrentWeatherResult;

    const hourlyProbabilities = weather.hourly.precipitation_probability;

    const peakHour = hourlyProbabilities.indexOf(Math.max(...hourlyProbabilities));
    const peakProbability = hourlyProbabilities[peakHour];

    return {
      location,
      temperatureCelsius: tools.Int.of(this.rounding.round(weather.current.temperature_2m)),
      precipitation: {
        peakHour: tools.Hour.fromValue(peakHour).get(),
        probability: tools.Int.nonNegative(peakProbability as number),
      },
      generatedAt: this.deps.Clock.now(),
    };
  }
}

class WeatherProviderNoopAdapter implements Panel.Ports.WeatherProvider {
  constructor(
    private readonly weather: Omit<Panel.Ports.Weather, "generatedAt" | "location">,
    private readonly deps: Dependencies,
  ) {}

  async read(location: Panel.VO.PanelLocationType): Promise<Panel.Ports.Weather> {
    return { ...this.weather, location, generatedAt: this.deps.Clock.now() };
  }
}

export async function createWeatherProvider(
  Env: EnvironmentResultType,
  deps: Dependencies,
): Promise<Panel.Ports.WeatherProvider> {
  const weather = {
    temperatureCelsius: tools.Int.of(15),
    precipitation: { peakHour: tools.Hour.fromValue(15).get(), probability: tools.Int.nonNegative(70) },
  };

  return {
    [bg.NodeEnvironmentEnum.local]: async () =>
      WeatherProviderOpenMeteoAdapter.build(Env.PANEL_LOCATION, new tools.RoundingToNearestStrategy(), deps),
    [bg.NodeEnvironmentEnum.test]: () => new WeatherProviderNoopAdapter(weather, deps),
    [bg.NodeEnvironmentEnum.staging]: () => new WeatherProviderNoopAdapter(weather, deps),
    [bg.NodeEnvironmentEnum.production]: () => new WeatherProviderNoopAdapter(weather, deps),
  }[Env.type]();
}
