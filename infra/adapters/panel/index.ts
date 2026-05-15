import type { EnvironmentResultType } from "+infra/env";
import { createWeatherCurrentReader } from "./weather-current-reader.adapter";

export async function createPanlAdapters(Env: EnvironmentResultType) {
  return { WeatherCurrentReader: createWeatherCurrentReader(Env) };
}
