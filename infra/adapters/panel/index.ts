import type * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";
import { createPanelImageGenerator } from "./panel-image-generator.adapter";
import { createPanelTemplateGenerator } from "./panel-template-generator.adapter";
import { createWeatherProvider } from "./weather-provider.adapter";

type Dependencies = { Clock: bg.ClockPort };

export async function createPanelAdapters(Env: EnvironmentResultType, deps: Dependencies) {
  return {
    WeatherProvider: await createWeatherProvider(Env, deps),
    PanelTemplateGenerator: createPanelTemplateGenerator(Env),
    PanelImageGenerator: createPanelImageGenerator(Env),
  };
}
