import * as Panel from "+panel";
import type { BootstrapType } from "+infra/bootstrap";

export function registerCommandHandlers({ Adapters, Tools }: BootstrapType) {
  const deps = { ...Adapters.System, ...Tools };

  Tools.CommandBus.on(
    Panel.Commands.GENERATE_PANEL_COMMAND,
    Panel.CommandHandlers.handleGeneratePanelCommand(deps),
  );
}
