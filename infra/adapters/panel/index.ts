import type { EnvironmentResultType } from "+infra/env";
import { createPanelImageGenerator } from "./panel-image-generator.adapter";
import { createPanelTemplateGenerator } from "./panel-template-generator.adapter";
import { createWeatherCurrentReader } from "./weather-current-reader.adapter";

export async function createPanlAdapters(Env: EnvironmentResultType) {
  return {
    WeatherCurrentReader: createWeatherCurrentReader(Env),
    PanelTemplateGenerator: createPanelTemplateGenerator(Env),
    PanelImageGenerator: createPanelImageGenerator(Env),
  };
}
