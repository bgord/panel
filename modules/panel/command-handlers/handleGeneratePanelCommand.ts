import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Panel from "+panel";

type Dependencies = {
  WeatherProvider: Panel.Ports.WeatherProvider;
  PanelTemplateGenerator: Panel.Ports.PanelTemplateGenerator;
  PanelImageGenerator: Panel.Ports.PanelImageGenerator;
  TemporaryFile: bg.TemporaryFilePort;
  ImageGrayscale: bg.ImageGrayscalePort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export const handleGeneratePanelCommand =
  (deps: Dependencies) => async (command: Panel.Commands.GeneratePanelCommandType) => {
    const weather = await deps.WeatherProvider.read(command.payload.location);

    const filename = tools.Filename.fromParts(
      v.parse(tools.Basename, command.createdAt.toString()),
      Panel.VO.PanelMime.extensions[0]!,
    );
    const template = await deps.PanelTemplateGenerator.generate(weather);
    const image = await deps.PanelImageGenerator.generate(
      template,
      filename,
      Panel.VO.PanelWidth,
      Panel.VO.PanelHeight,
    );

    const temporary = await deps.TemporaryFile.write(filename, image);

    await deps.ImageGrayscale.grayscale({ strategy: "in_place", input: temporary });
    await deps.RemoteFileStorage.putFromPath({ path: temporary, key: Panel.VO.PanelKeyFactory.stable() });
  };
