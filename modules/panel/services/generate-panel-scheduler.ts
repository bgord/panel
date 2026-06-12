import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import { languages } from "+languages";
import type * as Panel from "+panel";
import { GeneratePanelJobSchema } from "../jobs/GENERATE_PANEL_JOB";

type AcceptedJob = Panel.Jobs.GeneratePanelJobType;

type Config = { location: Panel.VO.PanelLocationType; timezone: tools.TimezoneType };
type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  JobQueue: bg.JobDispatcherPort<AcceptedJob>;
};

export class GeneratePanelScheduler {
  constructor(
    private readonly config: Config,
    private readonly deps: Dependencies,
  ) {}

  async handle() {
    for (const language of languages.values) {
      const job = bg.job(GeneratePanelJobSchema, { ...this.config, language }, this.deps);

      await this.deps.JobQueue.enqueue(job);
    }
  }
}
