import type * as Panel from "+panel";

export interface PanelTemplateGenerator {
  generate(weather: Panel.Ports.Weather): Promise<string>;
}
