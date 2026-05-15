import { describe, expect, test } from "bun:test";
import {
  PanelTemplateGeneratorAdapter,
  template,
} from "+infra/adapters/panel/panel-template-generator.adapter";
import * as mocks from "./mocks";

const css = "";

describe("PanelTemplateGeneratorAdapter", async () => {
  test("en", async () => {
    const result = await new PanelTemplateGeneratorAdapter(template, css).generate("en", mocks.weather);

    expect(result).toInclude(mocks.location);
    expect(result).toInclude("January 1");
    expect(result).toInclude(
      `<img src="${mocks.weather.conditionImageUrl}" alt="${mocks.weather.condition}" />`,
    );
    expect(result).toInclude(mocks.weather.condition);
    expect(result).toInclude(`${mocks.weather.temperatureCelsius} °C`);
    expect(result).toInclude(`feels like ${mocks.weather.feelsLikeCelsius} °C`);
    expect(result).toInclude(
      `${mocks.weather.precipitation.probability}% precipitation (${mocks.weather.precipitation.hour}:00)`,
    );
    expect(result).toInclude("Generated at Wednesday, January 1, 2025 at 1:00 AM");
  });
});
