import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import { PanelLocation } from "../value-objects/panel-location";

// Stryker disable next-line StringLiteral
export const GENERATE_PANEL_COMMAND = "GENERATE_PANEL_COMMAND";

export const GeneratePanelCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(GENERATE_PANEL_COMMAND),
  payload: v.object({ location: PanelLocation, timezone: tools.Timezone, language: tools.Language }),
});

export type GeneratePanelCommandType = v.InferOutput<typeof GeneratePanelCommand>;
