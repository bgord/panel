import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

type AcceptedFormat = "png" | "jpeg" | "webp";

class PanelImageGeneratorWebViewAdapter implements Panel.Ports.PanelImageGenerator {
  async generate(
    template: string,
    filename: tools.Filename,
    width: tools.ImageWidthType,
    height: tools.ImageHeightType,
  ): Promise<File> {
    await using view = new Bun.WebView({ height, width });

    await view.navigate(`data:text/html,${template}`);

    const image = await view.screenshot({
      encoding: "blob",
      format: filename.getExtension() as AcceptedFormat,
    });

    return new File([image], filename.toString());
  }
}

class PanelImageGeneratorNoopAdapter implements Panel.Ports.PanelImageGenerator {
  async generate(
    _template: string,
    filename: tools.Filename,
    _width: tools.ImageWidthType,
    _height: tools.ImageHeightType,
  ): Promise<File> {
    return new File([], filename.toString());
  }
}

export function createPanelImageGenerator(Env: EnvironmentResultType): Panel.Ports.PanelImageGenerator {
  return {
    [bg.NodeEnvironmentEnum.local]: new PanelImageGeneratorWebViewAdapter(),
    [bg.NodeEnvironmentEnum.test]: new PanelImageGeneratorNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new PanelImageGeneratorNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new PanelImageGeneratorWebViewAdapter(),
  }[Env.type];
}
