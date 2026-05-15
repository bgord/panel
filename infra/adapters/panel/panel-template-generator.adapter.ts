import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = { FileReaderText: bg.FileReaderTextPort };

const template = /* HTML */ (weather: Panel.Ports.Weather, css: string) => `
    <html>
      <head>
        <style>
          html {
            font-family: sans-serif;
          }
          ${css}
        </style>
      </head>
      <body data-bg="neutral-100">
        <h1>Panel</h1>
        <section>
          <h2>Pogoda</h2>
          <div>${weather.condition}</div>
          <img src="${weather.conditionImageUrl}" alt="${weather.condition}" />
          <strong>${weather.generatedAt
            .toInstant()
            .toZonedDateTimeISO("Europe/Warsaw")
            .toLocaleString("pl-PL", { day: "numeric", month: "long" })}
          </strong>
          <div>${weather.temperatureCelsius} °C [${weather.feelsLikeCelsius} °C]</div>
          <small>${weather.location}</small>

          <div>${weather.precipitation.probability}% opadów (ok. ${weather.precipitation.hour}:00)</div>
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
  constructor(
    private readonly template: (weahter: Panel.Ports.Weather, css: string) => string,
    private readonly css: string,
  ) {}

  async generate(weather: Panel.Ports.Weather): Promise<string> {
    return this.template(weather, this.css);
  }
}

export async function createPanelTemplateGenerator(
  Env: EnvironmentResultType,
  deps: Dependencies,
): Promise<Panel.Ports.PanelTemplateGenerator> {
  const css = await deps.FileReaderText.read(
    tools.FilePathRelative.fromString("node_modules/@bgord/design/dist/main.min.css"),
  );

  return {
    [bg.NodeEnvironmentEnum.local]: new PanelTemplateGeneratorAdapter(template, css),
    [bg.NodeEnvironmentEnum.test]: new PanelTemplateGeneratorAdapter(template, css),
    [bg.NodeEnvironmentEnum.staging]: new PanelTemplateGeneratorAdapter(template, css),
    [bg.NodeEnvironmentEnum.production]: new PanelTemplateGeneratorAdapter(template, css),
  }[Env.type];
}
