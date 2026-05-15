import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

class WeatherProviderNoopAdapter implements Panel.Ports.WeatherProvider {
  constructor(private readonly temperatureCelsius: tools.IntegerType) {}

  async read(location: Panel.VO.PanelLocationType): Promise<Panel.Ports.Weather> {
    return { location, temperatureCelsius: this.temperatureCelsius };
  }
}

export function createWeatherProvider(Env: EnvironmentResultType): Panel.Ports.WeatherProvider {
  return {
    [bg.NodeEnvironmentEnum.local]: new WeatherProviderNoopAdapter(tools.Int.of(15)),
    [bg.NodeEnvironmentEnum.test]: new WeatherProviderNoopAdapter(tools.Int.of(15)),
    [bg.NodeEnvironmentEnum.staging]: new WeatherProviderNoopAdapter(tools.Int.of(15)),
    [bg.NodeEnvironmentEnum.production]: new WeatherProviderNoopAdapter(tools.Int.of(15)),
  }[Env.type];
}
