import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Panel from "+panel";
import * as mocks from "./mocks";

const css = "";

const badge = (label: string) => `data-mt="3">${label}</div>`;

describe("PanelTemplate", async () => {
  test("en", async () => {
    const result = new Panel.Services.PanelTemplate().create("en", mocks.timezone, mocks.weather, css);

    expect(result).toInclude(mocks.location);
    expect(result).toMatch(/data-bg="neutral-200" data-p="3">\s*January 1\s*<\/section>/);
    expect(result).toInclude(
      `<img src="${mocks.weather.conditionImageUrl}" alt="${mocks.weather.condition}" />`,
    );
    expect(result).toInclude(mocks.weather.condition);
    expect(result).toInclude(`${mocks.weather.temperatureCelsius} °C`);
    expect(result).toInclude(`feels like ${mocks.weather.feelsLikeCelsius} °C`);
    expect(result).toInclude(`${mocks.weather.precipitation.currentHourProbability}% precipitation`);
    expect(result).toInclude(mocks.weather.precipitation.next3HoursMaxProbability.toString());
    expect(result).toInclude(`${mocks.weather.aqi}/500`);
    expect(result).toInclude("Wednesday, January 1, 2025 at 1:00 AM");
  });

  test.each([
    [50, "good"],
    [100, "moderate"],
    [150, "sensitive"],
    [200, "unhealthy"],
    [300, "very unhealthy"],
    [500, "hazardous"],
    [501, ""],
  ])("aqi %i is %s", async (aqi, label) => {
    const weather = { ...mocks.weather, aqi: tools.Int.nonNegative(aqi) };

    const result = new Panel.Services.PanelTemplate().create("en", mocks.timezone, weather, css);

    expect(result).toInclude(badge(label));
  });
});
