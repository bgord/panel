import * as bg from "@bgord/bun";
import * as Panel from "+panel";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createHashFile(deps: Dependencies) {
  return new bg.HashFileSha256Adapter({
    HashContent: new bg.HashContentSha256Strategy(),
    MimeRegistry: Panel.VO.PanelMimeRegistry,
    FileReaderText: new bg.FileReaderTextAdapter(),
    ...deps,
  });
}
