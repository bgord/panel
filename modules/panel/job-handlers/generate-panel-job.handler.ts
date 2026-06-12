import * as bg from "@bgord/bun";
import type * as Panel from "+panel";
import { GeneratePanelCommand } from "../commands/GENERATE_PANEL_COMMAND";

type AcceptedCommand = Panel.Commands.GeneratePanelCommandType;

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<AcceptedCommand>;
};

export const GeneratePanelJobHandler =
  (deps: Dependencies) =>
  async (job: Panel.Jobs.GeneratePanelJobType): Promise<void> => {
    const command = bg.command(GeneratePanelCommand, { payload: job.payload }, deps);

    await deps.CommandBus.emit(command);
  };
