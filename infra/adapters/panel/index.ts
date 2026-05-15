import type { EnvironmentResultType } from "+infra/env";
import { createPanelImageGenerator } from "./panel-image-generator.adapter";
import { createPanelTemplateGenerator } from "./panel-template-generator.adapter";
import { createWeatherProvider } from "./weather-provider.adapter";

export async function createPanelAdapters(Env: EnvironmentResultType) {
  return {
    WeatherProvider: createWeatherProvider(Env),
    PanelTemplateGenerator: createPanelTemplateGenerator(Env),
    PanelImageGenerator: createPanelImageGenerator(Env),
  };
}
