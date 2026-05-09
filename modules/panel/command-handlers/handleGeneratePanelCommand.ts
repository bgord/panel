import type * as Panel from "+panel";

type Dependencies = {
  WeatherCurrentReader: Panel.Ports.WeatherCurrentReader;
  PanelGenerator: Panel.Ports.PanelGenerator;
};

export const handleGeneratePanelCommand =
  (deps: Dependencies) => async (command: Panel.Commands.GeneratePanelCommandType) => {
    const weather = await deps.WeatherCurrentReader.read(command.payload.location);
    const panel = deps.PanelGenerator.generate(weather);
  };
