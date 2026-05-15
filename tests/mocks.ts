// cspell:disable

import { expect } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Panel from "+panel";

// IDs
export const correlationId = "00000000-0000-0000-0000-000000000000";

export const etag = bg.Hash.fromString("0000000000000000000000000000000000000000000000000000000000000000");

// Timestamps
export const T0 = tools.Timestamp.fromInstant(tools.Temporal.Instant.from("2025-01-01T00:00:00Z"));

export const hourHasPassedTimestamp = T0;

export const expectAnyId = expect.stringMatching(
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
);

export const ip = { server: { requestIP: () => ({ address: "127.0.0.1" }) } };

export const correlationIdHeaders = { "correlation-id": correlationId };

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
export const objectKey = v.parse(tools.ObjectKey, "panels/panel.png");
export const weather: Panel.Ports.Weather = {
  location,
  temperatureCelsius: tools.Int.of(15),
  feelsLikeCelsius: tools.Int.of(14),
  precipitation: { probability: tools.Int.nonNegative(90), hour: tools.Hour.fromValue(15).get() },
  generatedAt: T0,
  condition: "sunny",
  conditionImageUrl: "https://example.com",
};

export const IntentionalError = "intentional.error" as const;
export const throwIntentionalError = () => {
  throw new Error(IntentionalError);
};
export const throwIntentionalErrorAsync = async () => {
  throw new Error(IntentionalError);
};

export const GenericGeneratePanelJob = {
  id: expectAnyId,
  correlationId: correlationId,
  createdAt: T0.ms,
  name: Panel.Jobs.GENERATE_PANEL_JOB,
  revision: 0,
  payload: { location, language: "en" },
} satisfies Panel.Jobs.GeneratePanelJobType;
