import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

export function createFileReaderText(Env: EnvironmentResultType): bg.FileReaderTextPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.FileReaderTextAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.FileReaderTextNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.FileReaderTextAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.FileReaderTextAdapter(),
  }[Env.type];
}
