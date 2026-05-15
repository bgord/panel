import * as bg from "@bgord/bun";
import * as Panel from "+panel";

type AcceptedCommand = Panel.Commands.GeneratePanelCommandType;

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<AcceptedCommand>;
};

export const GeneratePanelJobHandler =
  (deps: Dependencies) =>
  async (job: Panel.Jobs.GeneratePanelJobType): Promise<void> => {
    const command = bg.command(
      Panel.Commands.GeneratePanelCommand,
      { payload: { location: job.payload.location } },
      deps,
    );

    await deps.CommandBus.emit(command);
  };
