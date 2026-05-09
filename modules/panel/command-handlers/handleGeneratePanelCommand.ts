import type * as Panel from "+panel";

type Dependencies = {
  WeatherCurrentReader: Panel.Ports.WeatherCurrentReader;
  PanelTemplateGenerator: Panel.Ports.PanelTemplateGenerator;
};

export const handleGeneratePanelCommand =
  (deps: Dependencies) => async (command: Panel.Commands.GeneratePanelCommandType) => {
    const weather = await deps.WeatherCurrentReader.read(command.payload.location);
    const panelTemplate = deps.PanelTemplateGenerator.generate(weather);
  };
