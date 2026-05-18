import type * as tools from "@bgord/tools";
import type * as Panel from "+panel";

export type PanelTemplateGeneratorConfig = {
  language: tools.LanguageType;
  timezone: tools.TimezoneType;
  weather: Panel.Ports.Weather;
};

export interface PanelTemplateGenerator {
  generate(config: PanelTemplateGeneratorConfig): Promise<string>;
}
