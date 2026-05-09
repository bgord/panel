import type * as tools from "@bgord/tools";

export interface PanelImageGenerator {
  // TODO this or array buffer?
  generate(template: string, width: tools.ImageWidthType, height: tools.ImageHeightType): Promise<File>;
}
