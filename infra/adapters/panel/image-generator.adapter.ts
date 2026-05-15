import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

type AcceptedFormat = "png" | "jpeg" | "webp";

class ImageGeneratorWebViewAdapter implements Panel.Ports.ImageGenerator {
  async generate(
    template: string,
    filename: tools.Filename,
    width: tools.ImageWidthType,
    height: tools.ImageHeightType,
  ): Promise<Uint8Array<ArrayBuffer>> {
    await using view = new Bun.WebView({ height, width });

    await view.navigate(`data:text/html;charset=utf-8,${encodeURIComponent(template)}`);

    const image = await view.screenshot({
      encoding: "buffer",
      format: filename.getExtension() as AcceptedFormat,
    });

    return new Uint8Array(image);
  }
}

class ImageGeneratorNoopAdapter implements Panel.Ports.ImageGenerator {
  async generate(
    _template: string,
    _filename: tools.Filename,
    _width: tools.ImageWidthType,
    _height: tools.ImageHeightType,
  ): Promise<Uint8Array<ArrayBuffer>> {
    return new Uint8Array([]);
  }
}

export function createImageGenerator(Env: EnvironmentResultType): Panel.Ports.ImageGenerator {
  return {
    [bg.NodeEnvironmentEnum.local]: new ImageGeneratorWebViewAdapter(),
    [bg.NodeEnvironmentEnum.test]: new ImageGeneratorNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new ImageGeneratorNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new ImageGeneratorWebViewAdapter(),
  }[Env.type];
}
