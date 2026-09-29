import * as bg from "@bgord/bun";
import * as Panel from "+panel";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createHashFile(deps: Dependencies) {
  return new bg.HashFileSha256Adapter({
    HashBytes: new bg.HashBytesSha256Strategy(),
    MimeRegistry: Panel.VO.PanelMimeRegistry,
    FileReaderRaw: new bg.FileReaderRawAdapter(),
    ...deps,
  });
}
