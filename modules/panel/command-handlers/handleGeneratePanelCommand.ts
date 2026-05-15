import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Panel from "+panel";

type Dependencies = {
  WeatherProvider: Panel.Ports.WeatherProvider;
  PanelTemplateGenerator: Panel.Ports.PanelTemplateGenerator;
  ImageGenerator: bg.ImageGenerator;
  TemporaryFile: bg.TemporaryFilePort;
  ImageGrayscale: bg.ImageGrayscalePort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export const handleGeneratePanelCommand =
  (deps: Dependencies) => async (command: Panel.Commands.GeneratePanelCommandType) => {
    const weather = await deps.WeatherProvider.read(command.payload.language, command.payload.location);

    const filename = tools.Filename.fromParts(
      v.parse(tools.Basename, command.createdAt.toString()),
      Panel.VO.PanelMime.extensions[0]!,
    );
    const template = await deps.PanelTemplateGenerator.generate(command.payload.language, weather);
    const image = await deps.ImageGenerator.generate(
      template,
      filename,
      Panel.VO.PanelWidth,
      Panel.VO.PanelHeight,
    );

    const file = new File([image], filename.toString());
    const temporary = await deps.TemporaryFile.write(filename, file);

    await deps.ImageGrayscale.grayscale({ strategy: "in_place", input: temporary });
    await deps.RemoteFileStorage.putFromPath({
      path: temporary,
      key: Panel.VO.PanelKeyFactory.stable(command.payload.language),
    });
  };
