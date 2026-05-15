import type * as tools from "@bgord/tools";
import type * as Panel from "+panel";

export interface PanelTemplateGenerator {
  generate(
    language: tools.LanguageType,
    timezone: tools.TimezoneType,
    weather: Panel.Ports.Weather,
  ): Promise<string>;
}
