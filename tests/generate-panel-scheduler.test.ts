import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Panel from "+panel";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("GeneratePanelScheduler", async () => {
  const di = await bootstrap();

  const scheduler = new Panel.Services.GeneratePanelScheduler(
    { location: di.Env.PANEL_LOCATION, timezone: di.Env.PANEL_TIMEZONE },
    { ...di.Tools, ...di.Adapters.System },
  );

  test("happy path", async () => {
    using enqueue = spyOn(di.Tools.JobQueue, "enqueue");

    expect(async () =>
      bg.CorrelationStorage.run(mocks.correlationId, async () => scheduler.handle()),
    ).not.toThrow();
    expect(enqueue).toHaveBeenCalledWith(mocks.GenericGeneratePanelJob);
  });
});
