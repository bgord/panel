import * as bg from "@bgord/bun";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

const template = /* HTML */ (weather: Panel.Ports.WeatherCurrent) => `
    <html>
      <head>
        <style>
          html {
            font-family: sans-serif;
          }
        </style>
      </head>
      <body>
        <h1>Panel</h1>
        <section>
          <h2>Weather</h2>
          <div>${weather.temperatureCelsius} °C</div>
          <small>${weather.location}</small>
        </section>
      </body>
    </html>
  `;

class PanelTemplateGeneratorAdapter implements Panel.Ports.PanelTemplateGenerator {
  constructor(private readonly template: (weahter: Panel.Ports.WeatherCurrent) => string) {}

  async generate(weather: Panel.Ports.WeatherCurrent): Promise<string> {
    return this.template(weather);
  }
}

export function createPanelTemplateGenerator(Env: EnvironmentResultType): Panel.Ports.PanelTemplateGenerator {
  return {
    [bg.NodeEnvironmentEnum.local]: new PanelTemplateGeneratorAdapter(template),
    [bg.NodeEnvironmentEnum.test]: new PanelTemplateGeneratorAdapter(template),
    [bg.NodeEnvironmentEnum.staging]: new PanelTemplateGeneratorAdapter(template),
    [bg.NodeEnvironmentEnum.production]: new PanelTemplateGeneratorAdapter(template),
  }[Env.type];
}
