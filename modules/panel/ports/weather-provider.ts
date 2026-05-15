import type * as tools from "@bgord/tools";
import type * as Panel from "+panel";

export type Weather = {
  location: Panel.VO.PanelLocationType;
  temperatureCelsius: tools.IntegerType;
  feelsLikeCelsius: tools.IntegerType;
  precipitation: { probability: tools.IntegerNonNegativeType; hour: tools.HourValueType };
  condition: string;
  conditionImageUrl: string;
  generatedAt: tools.Timestamp;
};

export interface WeatherProvider {
  read(language: tools.LanguageType, location: Panel.VO.PanelLocationType): Promise<Weather>;
}
