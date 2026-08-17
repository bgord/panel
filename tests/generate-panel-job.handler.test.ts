import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Panel from "+panel";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import * as mocks from "./mocks";

describe("LocationFramesCleanupJobHandler", async () => {
  const di = await bootstrap();
  registerCommandHandlers(di);

  const handler = Panel.JobHandlers.GeneratePanelJobHandler({ ...di.Tools, ...di.Adapters.System });

  test("happy path", async () => {
    using putFromPath = spyOn(di.Adapters.System.RemoteFileStorage, "putFromPath");
    using write = spyOn(di.Adapters.System.TemporaryFile, "write");
    using _ = spyOn(di.Adapters.System.ImageGenerator, "generate").mockResolvedValue(
      new Uint8Array([1, 2, 3]),
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => handler(mocks.GenericGeneratePanelJob));

    expect(putFromPath).toHaveBeenCalledWith({
      // @ts-expect-error
      path: expect.any(tools.FilePathAbsolute),
      key: mocks.objectKey,
    });
    expect(write.mock.calls[0]?.[1].size).toEqual(3);
  });
});
