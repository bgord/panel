import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerCronTasks } from "+infra/register-cron-tasks";
import { createServer } from "./server";

(async function main() {
  const di = await bootstrap();
  const server = createServer(di);

  await new bg.PrerequisiteRunnerStartup(di.Adapters.System).check(di.Tools.Prerequisites.healthcheck);
  bg.EventLoopLag.start();

  registerCommandHandlers(di);
  registerCronTasks(di);

  const app = Bun.serve({
    port: di.Env.PORT,
    maxRequestBodySize: tools.Size.fromMB(12).toBytes(),
    idleTimeout: tools.Duration.Seconds(10).seconds,
    routes: { "/api/*": server.fetch },
  });

  new bg.GracefulShutdown(di.Adapters.System).applyTo(app);

  di.Adapters.System.Logger.info({
    message: "Server has started",
    component: "infra",
    operation: "server_startup",
    metadata: { port: di.Env.PORT },
  });
})();
