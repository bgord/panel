import { createPanelAdapters } from "+infra/adapters/panel";
import { createSystemAdapters } from "+infra/adapters/system";
import { createEnvironmentLoader } from "+infra/env";
import { createTools } from "+infra/tools";
import { createJobQueue } from "+infra/tools/job-queue.adapter";

export async function bootstrap() {
  const EnvironmentLoader = await createEnvironmentLoader();
  const Env = await EnvironmentLoader.load();

  const System = await createSystemAdapters(Env);
  const Panel = await createPanelAdapters(Env);
  const Tools = await createTools(Env, System);

  const { JobQueue, JobQueueStatsProvider, JobPruner } = await createJobQueue(Env, { ...System, ...Tools });

  return {
    Env,
    Adapters: { System, Panel },
    Tools: { ...Tools, JobQueue, JobQueueStatsProvider, JobPruner },
  };
}

export type BootstrapType = Awaited<ReturnType<typeof bootstrap>>;
