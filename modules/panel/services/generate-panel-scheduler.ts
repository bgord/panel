import * as bg from "@bgord/bun";
import * as Panel from "+panel";

type AcceptedJob = Panel.Jobs.GeneratePanelJobType;

type Config = { location: Panel.VO.PanelLocationType };
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
    const job = bg.job(Panel.Jobs.GeneratePanelJobSchema, { location: this.config.location }, this.deps);

    await this.deps.JobQueue.enqueue(job);
  }
}
