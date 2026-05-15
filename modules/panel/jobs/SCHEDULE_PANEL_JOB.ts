import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Panel from "+panel";

export const SCHEDULE_PANEL_JOB = "SCHEDULE_PANEL_JOB";

export const SchedulePanelJobSchema = v.object({
  ...bg.JobEnvelopeSchema,
  name: v.literal(SCHEDULE_PANEL_JOB),
  payload: v.object({ location: Panel.VO.PanelLocation }),
});

export type SchedulePanelJobType = v.InferOutput<typeof SchedulePanelJobSchema>;
