import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Panel from "+panel";

// Stryker disable next-line StringLiteral
export const GENERATE_PANEL_JOB = "GENERATE_PANEL_JOB";

export const GeneratePanelJobSchema = v.object({
  ...bg.JobEnvelopeSchema,
  name: v.literal(GENERATE_PANEL_JOB),
  payload: v.object({ location: Panel.VO.PanelLocation, timezone: tools.Timezone, language: tools.Language }),
});

export type GeneratePanelJobType = v.InferOutput<typeof GeneratePanelJobSchema>;
