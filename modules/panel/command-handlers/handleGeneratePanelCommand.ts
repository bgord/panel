import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Panel from "+panel";

type Dependencies = {
  WeatherCurrentReader: Panel.Ports.WeatherCurrentReader;
  PanelTemplateGenerator: Panel.Ports.PanelTemplateGenerator;
  PanelImageGenerator: Panel.Ports.PanelImageGenerator;
  TemporaryFile: bg.TemporaryFilePort;
  ImageGrayscale: bg.ImageGrayscalePort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export const handleGeneratePanelCommand =
  (deps: Dependencies) => async (command: Panel.Commands.GeneratePanelCommandType) => {
    const weather = await deps.WeatherCurrentReader.read(command.payload.location);

    const template = await deps.PanelTemplateGenerator.generate(weather);
    const image = await deps.PanelImageGenerator.generate(
      template,
      Panel.VO.PanelWidth,
      Panel.VO.PanelHeight,
    );

    const filename = tools.Filename.fromParts(
      v.parse(tools.Basename, command.createdAt),
      Panel.VO.PanelMime.extensions[0]!,
    );
    const temporary = await deps.TemporaryFile.write(filename, image);

    await deps.ImageGrayscale.grayscale({ strategy: "in_place", input: temporary });

    await deps.RemoteFileStorage.putFromPath({ path: temporary, key: Panel.VO.PanelKeyFactory.stable() });
  };
