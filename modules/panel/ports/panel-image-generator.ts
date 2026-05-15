import type * as tools from "@bgord/tools";

export interface PanelImageGenerator {
  generate(
    template: string,
    filename: tools.Filename,
    width: tools.ImageWidthType,
    height: tools.ImageHeightType,
  ): Promise<File>;
}
