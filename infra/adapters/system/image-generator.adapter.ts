import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

export function createImageGenerator(Env: EnvironmentResultType): bg.ImageGeneratorPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.ImageGeneratorWebViewAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.ImageGeneratorNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.ImageGeneratorNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.ImageGeneratorWebViewAdapter(),
  }[Env.type];
}
