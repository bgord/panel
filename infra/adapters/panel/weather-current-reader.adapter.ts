import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

class WeatherCurrentReaderNoopAdapter implements Panel.Ports.WeatherCurrentReader {
  constructor(private readonly temperatureCelsius: tools.IntegerType) {}

  async read(location: Panel.VO.PanelLocationType): Promise<Panel.Ports.WeatherCurrent> {
    return { location, temperatureCelsius: this.temperatureCelsius };
  }
}

export function createWeatherCurrentReader(Env: EnvironmentResultType): Panel.Ports.WeatherCurrentReader {
  return {
    [bg.NodeEnvironmentEnum.local]: new WeatherCurrentReaderNoopAdapter(tools.Int.of(15)),
    [bg.NodeEnvironmentEnum.test]: new WeatherCurrentReaderNoopAdapter(tools.Int.of(15)),
    [bg.NodeEnvironmentEnum.staging]: new WeatherCurrentReaderNoopAdapter(tools.Int.of(15)),
    [bg.NodeEnvironmentEnum.production]: new WeatherCurrentReaderNoopAdapter(tools.Int.of(15)),
  }[Env.type];
}
