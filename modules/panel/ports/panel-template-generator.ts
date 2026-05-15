import type * as Panel from "+panel";

export interface PanelTemplateGenerator {
  generate(weather: Panel.Ports.WeatherCurrent): Promise<string>;
}
