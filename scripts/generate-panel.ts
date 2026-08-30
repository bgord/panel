import * as bg from "@bgord/bun";
import * as v from "valibot";
import { languages } from "+languages";
import * as Panel from "+panel";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";

void (async function main() {
  const di = await bootstrap();
  registerCommandHandlers(di);

  const correlationId = v.parse(bg.CorrelationId, di.Adapters.System.IdProvider.generate());

  await bg.CorrelationStorage.run(correlationId, async () => {
    for (const language of languages.values) {
      const command = bg.command(
        Panel.Commands.GeneratePanelCommand,
        { payload: { location: di.Env.PANEL_LOCATION, timezone: di.Env.PANEL_TIMEZONE, language } },
        di.Adapters.System,
      );

      await di.Tools.CommandBus.emit(command);
    }
  });
})();
