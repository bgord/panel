import type * as tools from "@bgord/tools";
import type * as Panel from "+panel";

export type Weather = {
  location: Panel.VO.PanelLocationType;
  temperatureCelsius: tools.IntegerType;
};

export interface WeatherProvider {
  read(location: Panel.VO.PanelLocationType): Promise<Weather>;
}
