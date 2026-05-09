import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Panel from "+panel";

// Stryker disable next-line StringLiteral
export const GENERATE_PANEL_COMMAND = "GENERATE_PANEL_COMMAND";

export const GeneratePanelCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(GENERATE_PANEL_COMMAND),
  payload: v.object({ timestamp: tools.TimestampValue, location: Panel.VO.PanelLocation }),
});

export type GeneratePanelCommandType = v.InferOutput<typeof GeneratePanelCommand>;
