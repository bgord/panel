import * as tools from "@bgord/tools";
import * as v from "valibot";

export class PanelKeyFactory {
  static stable(timestamp: tools.TimestampValueType, extension: tools.ExtensionType) {
    const filename = tools.Filename.fromParts(timestamp.toString(), extension);

    return v.parse(tools.ObjectKey, `panels/${filename.get()}`);
  }
}
