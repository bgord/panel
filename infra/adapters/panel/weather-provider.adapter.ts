import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

type OpenMeteoCoordinates = { latitude: number; longitude: number };
type OpenMeteoGeocodingResult = { results: Array<{ latitude: number; longitude: number }> };
type OpenMeteoCurrentWeatherResult = { current: { temperature_2m: number } };

const WeatherProviderOpenMeteoAdapterError = {
  GeocodingFailed: "weather.provider.open.meteo.adapter.geocoding.failed",
  LocationNotFound: "weather.provider.open.meteo.adapter.location.not.found",
  WeatherFailed: "weather.provider.open.meteo.adapter.weather.failed",
};

class WeatherProviderOpenMeteoAdapter implements Panel.Ports.WeatherProvider {
  private constructor(
    private readonly coordinates: OpenMeteoCoordinates,
    private readonly rounding: tools.RoundingStrategy,
  ) {}

  static async build(
    location: Panel.VO.PanelLocationType,
    rounding: tools.RoundingStrategy,
  ): Promise<Panel.Ports.WeatherProvider> {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", location);
    url.searchParams.set("count", "1");

    const response = await fetch(url);
    if (!response.ok) throw new Error(WeatherProviderOpenMeteoAdapterError.GeocodingFailed);

    const geocoding = (await response.json()) as OpenMeteoGeocodingResult;
    const coordinates = geocoding.results?.at(0);
    if (!coordinates) throw new Error(WeatherProviderOpenMeteoAdapterError.LocationNotFound);

    return new WeatherProviderOpenMeteoAdapter(coordinates, rounding);
  }

  async read(location: Panel.VO.PanelLocationType): Promise<Panel.Ports.Weather> {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", this.coordinates.latitude.toString());
    url.searchParams.set("longitude", this.coordinates.longitude.toString());
    url.searchParams.set("current", "temperature_2m");
    url.searchParams.set("timezone", "Europe/Warsaw");

    const response = await fetch(url);
    if (!response.ok) throw new Error(WeatherProviderOpenMeteoAdapterError.WeatherFailed);

    const weather = (await response.json()) as OpenMeteoCurrentWeatherResult;

    return {
      location,
      temperatureCelsius: tools.Int.of(this.rounding.round(weather.current.temperature_2m)),
    };
  }
}

class WeatherProviderNoopAdapter implements Panel.Ports.WeatherProvider {
  constructor(private readonly temperatureCelsius: tools.IntegerType) {}

  async read(location: Panel.VO.PanelLocationType): Promise<Panel.Ports.Weather> {
    return { location, temperatureCelsius: this.temperatureCelsius };
  }
}

export async function createWeatherProvider(
  Env: EnvironmentResultType,
): Promise<Panel.Ports.WeatherProvider> {
  return {
    [bg.NodeEnvironmentEnum.local]: async () =>
      WeatherProviderOpenMeteoAdapter.build(Env.PANEL_LOCATION, new tools.RoundingToNearestStrategy()),
    [bg.NodeEnvironmentEnum.test]: () => new WeatherProviderNoopAdapter(tools.Int.of(15)),
    [bg.NodeEnvironmentEnum.staging]: () => new WeatherProviderNoopAdapter(tools.Int.of(15)),
    [bg.NodeEnvironmentEnum.production]: () => new WeatherProviderNoopAdapter(tools.Int.of(15)),
  }[Env.type]();
}
