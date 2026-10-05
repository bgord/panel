import * as bg from "@bgord/bun";
import type * as Panel from "+panel";

type Dependencies = { Logger: bg.LoggerPort; Clock: bg.ClockPort };

type AcceptedCommand = Panel.Commands.GeneratePanelCommandType;

export function createCommandBus(deps: Dependencies): bg.CommandBusPort<AcceptedCommand> {
  const emittery = new bg.CommandBusEmitteryAdapter<AcceptedCommand>();
  const inner = new bg.CommandBusStrictAdapter<AcceptedCommand>({ inner: emittery });

  return new bg.CommandBusWithLoggerAdapter<AcceptedCommand>({ inner, ...deps });
}
