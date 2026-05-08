import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { BootstrapType } from "+infra/bootstrap";

export function registerCronTasks({ Tools, Adapters }: BootstrapType) {
  const CronTaskHandler = new bg.CronTaskHandlerBareStrategy(Adapters.System);

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
