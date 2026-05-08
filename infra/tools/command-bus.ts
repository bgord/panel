import * as bg from "@bgord/bun";

type Dependencies = { Logger: bg.LoggerPort };

// TODO
type AcceptedCommand = bg.Preferences.Commands.SetUserLanguageCommandType;

export function createCommandBus(deps: Dependencies): bg.CommandBusPort<AcceptedCommand> {
  const inner = new bg.CommandBusEmitteryAdapter<AcceptedCommand>();

  return new bg.CommandBusWithLoggerAdapter<AcceptedCommand>({ inner, ...deps });
}
