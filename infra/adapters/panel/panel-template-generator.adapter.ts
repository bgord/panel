import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = { FileReaderText: bg.FileReaderTextPort };

class PanelTemplateGeneratorAdapter implements Panel.Ports.PanelTemplateGenerator {
  constructor(
    private readonly template: Panel.Services.PanelTemplate,
    private readonly css: string,
  ) {}

  async generate(config: Panel.Ports.PanelTemplateGeneratorConfig): Promise<string> {
    return this.template.create(config.language, config.timezone, config.weather, this.css);
  }
}

export async function createPanelTemplateGenerator(
  Env: EnvironmentResultType,
  deps: Dependencies,
): Promise<Panel.Ports.PanelTemplateGenerator> {
  const css = await deps.FileReaderText.read(
    tools.FilePathRelative.fromString("node_modules/@bgord/design/dist/main.min.css"),
  );

  const template = new Panel.Services.PanelTemplate();

  return {
    [bg.NodeEnvironmentEnum.local]: new PanelTemplateGeneratorAdapter(template, css),
    [bg.NodeEnvironmentEnum.test]: new PanelTemplateGeneratorAdapter(template, css),
    [bg.NodeEnvironmentEnum.staging]: new PanelTemplateGeneratorAdapter(template, css),
    [bg.NodeEnvironmentEnum.production]: new PanelTemplateGeneratorAdapter(template, css),
  }[Env.type];
}
