import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Panel from "+panel";

export class PanelKeyFactory {
  static stable(language: tools.LanguageType) {
    const filename = tools.Filename.fromParts(`panel-${language}`, Panel.VO.PanelMime.extensions[0]!);

    return v.parse(tools.ObjectKey, `panels/${filename.get()}`);
  }
}
