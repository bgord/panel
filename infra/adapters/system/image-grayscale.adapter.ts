import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = { FileRenamer: bg.FileRenamerPort; FileWriter: bg.FileWriterPort };

export function createImageGrayscale(Env: EnvironmentResultType, deps: Dependencies): bg.ImageGrayscalePort {
  const ImageGrayscale = new bg.ImageGrayscaleAdapter(deps);

  return {
    [bg.NodeEnvironmentEnum.local]: ImageGrayscale,
    [bg.NodeEnvironmentEnum.test]: new bg.ImageGrayscaleNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: ImageGrayscale,
    [bg.NodeEnvironmentEnum.production]: ImageGrayscale,
  }[Env.type];
}
