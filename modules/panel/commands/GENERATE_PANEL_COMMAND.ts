import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+panel/value-objects";

// Stryker disable next-line StringLiteral
export const GENERATE_PANEL_COMMAND = "GENERATE_PANEL_COMMAND";

export const GeneratePanelCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(GENERATE_PANEL_COMMAND),
  payload: v.object({ location: VO.PanelLocation }),
});

export type GeneratePanelCommandType = v.InferOutput<typeof GeneratePanelCommand>;
