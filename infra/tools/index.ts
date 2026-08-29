import type * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";
import { createBuildInfoConfig } from "./build-info-config.adapter";
import { createCommandBus } from "./command-bus";
import { createCronScheduler } from "./cron-scheduler.adapter";
import { HashContent } from "./hash-content.strategy";
import { createPrerequisites } from "./prerequisites";
import { createShieldBasicAuth } from "./shield-basic-auth.strategy";
import { createShieldRateLimit } from "./shield-rate-limit.strategy";
import { createShieldSecurity } from "./shield-security.strategy";
import { ShieldTimeout } from "./shield-timeout.strategy";

type Dependencies = {
  Clock: bg.ClockPort;
  DiskSpaceChecker: bg.DiskSpaceCheckerPort;
  Logger: bg.LoggerPort;
  CertificateInspector: bg.CertificateInspectorPort;
  Timekeeper: bg.TimekeeperPort;
  TemporaryFile: bg.TemporaryFilePort;
  FileReaderJson: bg.FileReaderJsonPort;
  IdProvider: bg.IdProviderPort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
  Sleeper: bg.SleeperPort;
  TimeoutRunner: bg.TimeoutRunnerPort;
  FileInspection: bg.FileInspectionPort;
};

export async function createTools(Env: EnvironmentResultType, deps: Dependencies) {
  const CronScheduler = await createCronScheduler(Env, deps);

  return {
    CronScheduler,
    Prerequisites: createPrerequisites(Env, { ...deps, CronScheduler }),
    ShieldBasicAuth: createShieldBasicAuth(Env),
    ShieldRateLimit: createShieldRateLimit(Env, { ...deps, HashContent }),
    ShieldTimeout,
    CommandBus: createCommandBus(deps),
    ShieldSecurity: createShieldSecurity(Env, { ...deps, HashContent }),
    BuildInfoConfig: createBuildInfoConfig(Env, deps),
    HashContent,
  };
}
