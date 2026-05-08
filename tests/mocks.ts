// cspell:disable
import { expect } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

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

export const GenericHourHasPassedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: "passage_of_time",
  version: 1,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: hourHasPassedTimestamp.ms },
} satisfies bg.System.Events.HourHasPassedEventType;

export const IntentionalError = "intentional.error" as const;
export const throwIntentionalError = () => {
  throw new Error(IntentionalError);
};
export const throwIntentionalErrorAsync = async () => {
  throw new Error(IntentionalError);
};
