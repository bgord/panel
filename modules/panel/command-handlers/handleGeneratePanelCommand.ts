import type * as Panel from "+panel";

type Dependencies = {
  WeatherCurrentReader: Panel.Ports.WeatherCurrentReader;
};

export const handleGeneratePanelCommand =
  (_deps: Dependencies) => async (_command: Panel.Commands.GeneratePanelCommandType) => {};
