import * as bg from "@bgord/bun";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

class PanelTemplateGeneratorNoopAdapter implements Panel.Ports.PanelTemplateGenerator {
  constructor(private readonly template: string) {}

  async generate(_weather: Panel.Ports.WeatherCurrent): Promise<string> {
    return this.template;
  }
}

export function createPanelTemplateGenerator(Env: EnvironmentResultType): Panel.Ports.PanelTemplateGenerator {
  const template = "<html><body><h1>Panel</h1></body></html>";

  return {
    [bg.NodeEnvironmentEnum.local]: new PanelTemplateGeneratorNoopAdapter(template),
    [bg.NodeEnvironmentEnum.test]: new PanelTemplateGeneratorNoopAdapter(template),
    [bg.NodeEnvironmentEnum.staging]: new PanelTemplateGeneratorNoopAdapter(template),
    [bg.NodeEnvironmentEnum.production]: new PanelTemplateGeneratorNoopAdapter(template),
  }[Env.type];
}
