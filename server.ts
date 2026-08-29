import * as bg from "@bgord/bun";
import { Hono } from "hono";
import { HTTP } from "+app";
import type * as infra from "+infra";
import { languages } from "+languages";
import type { BootstrapType } from "+infra/bootstrap";
import { host, localhost } from "+infra/config";

export function createServer({ Env, Adapters, Tools }: BootstrapType) {
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ type: "infinite" });
  const CacheResolver = new bg.CacheResolverReadThroughStrategy({ CacheRepository });

  const origin = [localhost, host];

  const server = new Hono<infra.Config>()
    .basePath("/api")
    .use(
      ...bg.SetupHono.essentials(
        {
          csrf: { origin },
          cors: { origin },
          I18n: { languages, strategies: [new bg.LanguageDetectorHeaderStrategy()] },
        },
        { ...Adapters.System, ...Tools, CacheResolver },
      ),
    )
    .use(Tools.ShieldSecurity.handle());

  // Probes =================
  server.get("/liveness", ...new bg.LivenessHonoHandler().handle());
  server.get(
    "/readiness",
    Tools.ShieldTimeout.handle(),
    ...new bg.ReadinessHonoHandler({ prerequisites: Tools.Prerequisites.readiness }).handle(),
  );
  server.get(
    "/healthcheck",
    Tools.ShieldRateLimit.handle(),
    Tools.ShieldTimeout.handle(),
    Tools.ShieldBasicAuth.handle(),
    ...new bg.HealthcheckHonoHandler(
      { Env: Env.type, prerequisites: Tools.Prerequisites.healthcheck },
      {
        ...Adapters.System,
        ...Tools,
        LoggerStatsProvider: Adapters.System.Logger,
        JobQueueStatsProvider: Tools.JobQueueStatsProvider,
      },
    ).handle(),
  );
  // =============================

  // Panel =======================
  server.get(
    "/panel",
    Tools.ShieldRateLimit.handle(),
    Tools.ShieldTimeout.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Panel.GetPanel(Adapters.System)),
  );
  // =============================

  server.onError(HTTP.ErrorHandler.handle(Adapters.System));

  return server;
}
