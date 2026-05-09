import type * as Panel from "+panel";

export interface PanelGenerator {
  generate(weather: Panel.Ports.WeatherCurrent): string;
}
