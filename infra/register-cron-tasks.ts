import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Panel from "+panel";
import type { BootstrapType } from "+infra/bootstrap";

export function registerCronTasks({ Env, Tools, Adapters }: BootstrapType) {
  const CronTaskHandler = new bg.CronTaskHandlerBareStrategy(Adapters.System);

  const GeneratePanelScheduler = CronTaskHandler.handle({
    label: "Generate panel scheduler",
    cron: bg.CronExpressionSchedules.EVERY_MINUTE,
    handler: new Panel.Services.GeneratePanelScheduler(
      { location: Env.PANEL_LOCATION },
      { ...Tools, ...Adapters.System },
    ).handle,
  });
  Tools.CronScheduler.schedule(GeneratePanelScheduler);

  const JobQueueWorker = CronTaskHandler.handle(
    bg.JobQueueWorker(
      {
        label: "Job queue worker",
        cron: bg.CronExpressionSchedules.EVERY_MINUTE,
        limit: tools.Int.positive(1),
      },
      { ...Tools },
    ),
  );
  Tools.CronScheduler.schedule(JobQueueWorker);
}
