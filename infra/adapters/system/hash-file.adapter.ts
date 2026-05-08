import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createHashFile(deps: Dependencies) {
  return new bg.HashFileSha256Adapter({
    HashContent: new bg.HashContentSha256Strategy(),
    // TODO
    MimeRegistry: new tools.MimeRegistry([]),
    FileReaderText: new bg.FileReaderTextAdapter(),
    ...deps,
  });
}
