import * as bg from "@bgord/bun";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

const template = /* HTML */ (weather: Panel.Ports.Weather) => `
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
          <h2>Pogoda</h2>
          <strong>${weather.generatedAt
            .toInstant()
            .toZonedDateTimeISO("Europe/Warsaw")
            .toLocaleString("pl-PL", { day: "numeric", month: "long" })}
          </strong>
          <div>${weather.temperatureCelsius} °C</div>
          <small>${weather.location}</small>
        </section>

        <section>
          Wygenerowano ${weather.generatedAt
            .toInstant()
            .toZonedDateTimeISO("Europe/Warsaw")
            .toLocaleString("pl-PL", { dateStyle: "full", timeStyle: "short" })}
        </section>
      </body>
    </html>
  `;

class PanelTemplateGeneratorAdapter implements Panel.Ports.PanelTemplateGenerator {
  constructor(private readonly template: (weahter: Panel.Ports.Weather) => string) {}

  async generate(weather: Panel.Ports.Weather): Promise<string> {
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
