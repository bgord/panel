import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Panel from "+panel";
import { PanelHeight } from "../value-objects/panel-height";
import { PanelKeyFactory } from "../value-objects/panel-key";
import { PanelMime } from "../value-objects/panel-mime-registry";
import { PanelWidth } from "../value-objects/panel-width";

type Dependencies = {
  WeatherProvider: Panel.Ports.WeatherProvider;
  PanelTemplateGenerator: Panel.Ports.PanelTemplateGenerator;
  ImageGenerator: bg.ImageGeneratorPort;
  TemporaryFile: bg.TemporaryFilePort;
  ImageGrayscale: bg.ImageGrayscalePort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export const handleGeneratePanelCommand =
  (deps: Dependencies) => async (command: Panel.Commands.GeneratePanelCommandType) => {
    const weather = await deps.WeatherProvider.read(
      command.payload.language,
      command.payload.timezone,
      command.payload.location,
    );

    const filename = tools.Filename.fromParts(
      v.parse(tools.Basename, command.createdAt.toString()),
      PanelMime.extensions[0]!,
    );
    const template = await deps.PanelTemplateGenerator.generate({ ...command.payload, weather });
    const image = await deps.ImageGenerator.generate({
      template,
      filename,
      width: PanelWidth,
      height: PanelHeight,
    });

    const file = new File([image], filename.toString());
    const temporary = await deps.TemporaryFile.write(filename, file);

    await deps.ImageGrayscale.grayscale({ strategy: "in_place", input: temporary });
    await deps.RemoteFileStorage.putFromPath({
      path: temporary,
      key: PanelKeyFactory.stable(command.payload.language),
    });
  };
