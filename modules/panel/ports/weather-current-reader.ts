import type * as tools from "@bgord/tools";
import type * as Panel from "+panel";

export type WeatherCurrent = {
  location: Panel.VO.PanelLocationType;
  temperatureCelsius: tools.IntegerType;
};

export interface WeatherCurrentReader {
  read(location: Panel.VO.PanelLocationType): Promise<WeatherCurrent>;
}
