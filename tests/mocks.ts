// cspell:disable
import { expect } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Panel from "+panel";

// IDs
export const correlationId = v.parse(bg.CorrelationId, "00000000-0000-0000-0000-000000000000");
export const revision = v.parse(tools.RevisionValue, 0);

// Timestamps
const T0 = tools.Timestamp.fromInstant(Temporal.Instant.from("2025-01-01T00:00:00Z"));
export const T0Date = "Wed, 01 Jan 2025 00:00:00 GMT";

const expectAnyId = expect.stringMatching(
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
);

export const ip = { server: { requestIP: () => ({ address: "127.0.0.1" }) } };

const etag = bg.Hash.fromString("0000000000000000000000000000000000000000000000000000000000000000");

export const head = {
  exists: true,
  etag,
  size: tools.Size.fromBytes(1234),
  lastModified: T0,
  mime: tools.Mimes.webp.mime,
};

export const stream = () => new ReadableStream({ start: (controller) => controller.close() });

// Panel
export const location = v.parse(Panel.VO.PanelLocation, "Warsaw");
export const timezone = v.parse(tools.Timezone, "Europe/Warsaw");
export const objectKey = v.parse(tools.ObjectKey, "panels/panel-en.png");
export const objectKeyPl = v.parse(tools.ObjectKey, "panels/panel-pl.png");
export const weather: Panel.Ports.Weather = {
  location,
  temperatureCelsius: tools.Int.of(15),
  feelsLikeCelsius: tools.Int.of(14),
  precipitation: {
    currentHourProbability: tools.Int.nonNegative(90),
    next3HoursMaxProbability: tools.Int.nonNegative(100),
  },
  generatedAt: T0,
  condition: "sunny",
  conditionImageUrl: "https://example.com",
  aqi: tools.Int.nonNegative(50),
};

export const GenericGeneratePanelJob = {
  id: expectAnyId,
  correlationId: correlationId,
  createdAt: T0.ms,
  name: Panel.Jobs.GENERATE_PANEL_JOB,
  revision,
  payload: { location, timezone, language: "en" },
} satisfies Panel.Jobs.GeneratePanelJobType;
