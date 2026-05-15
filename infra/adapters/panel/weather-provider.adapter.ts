import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";
import { WeatherProviderOpenMeteoAdapter } from "./weather-provider-open-meteo.adapter";

type Dependencies = { Clock: bg.ClockPort };

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
    feelsLikeCelsius: tools.Int.of(14),
    condition: "sunny",
    conditionImageUrl: "http://openweathermap.org/img/wn/01d@2x.png",
    precipitation: { hour: tools.Hour.fromValue(15).get(), probability: tools.Int.nonNegative(70) },
  };

  return {
    [bg.NodeEnvironmentEnum.local]: async () =>
      WeatherProviderOpenMeteoAdapter.build(Env.PANEL_LOCATION, new tools.RoundingToNearestStrategy(), deps),
    [bg.NodeEnvironmentEnum.test]: () => new WeatherProviderNoopAdapter(weather, deps),
    [bg.NodeEnvironmentEnum.staging]: () => new WeatherProviderNoopAdapter(weather, deps),
    [bg.NodeEnvironmentEnum.production]: () => new WeatherProviderNoopAdapter(weather, deps),
  }[Env.type]();
}
