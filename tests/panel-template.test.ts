import { describe, expect, test } from "bun:test";
import * as Panel from "+panel";
import * as mocks from "./mocks";

const css = "";

describe("PanelTemplate", async () => {
  test("en", async () => {
    const result = new Panel.Services.PanelTemplate().create("en", mocks.weather, css);

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
    expect(result).toInclude("Wednesday, January 1, 2025 at 1:00 AM");
  });
});
