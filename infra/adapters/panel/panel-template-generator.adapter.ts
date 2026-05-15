import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Panel from "+panel";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = { FileReaderText: bg.FileReaderTextPort };

const template = /* HTML */ (weather: Panel.Ports.Weather, css: string) => `
    <html>
      <head>
        <meta charset="utf-8"  />
        <meta name="viewport" content="width=device-width, initial-scale=1"  />
        <style>
          html {
            font-family: sans-serif;
          }
          ${css}
        </style>
      </head>
      <body data-bg="neutral-100">
        <h1 data-fs="xl" data-color="neutral-800" data-bg="neutral-300" data-p="3">Panel</h1>

        <section data-fs="lg" data-color="neutral-700" data-bg="neutral-200" data-p="3">
          ${weather.generatedAt
            .toInstant()
            .toZonedDateTimeISO("Europe/Warsaw")
            .toLocaleString("pl-PL", { day: "numeric", month: "long" })}
        </section>

        <section data-stack="y" data-cross="center" data-p="3">
          <div data-fs="5xl" data-color="neutral-600" data-my="8">${weather.location}</div>

          <div data-stack="x" data-gap="12" data-cross="end">
            <div data-stack="y">
              <img src="${weather.conditionImageUrl}" alt="${weather.condition}" />
              <div data-fs="xl" data-color="neutral-400">${weather.condition}</div>
            </div>

            <div data-color="neutral-900" data-mt="3" data-stack="y" data-cross="center"> 
              <div data-fs="5xl">${weather.temperatureCelsius} °C</div>
              <div data-fs="xl">odczuw. ${weather.feelsLikeCelsius} °C</div>
            </div>
          </div>

          <div data-fs="xl" data-color="neutral-300" data-mt="8">${weather.precipitation.probability}% opadów (ok. ${weather.precipitation.hour}:00)</div>
        </section>

        <section data-color="neutral-400" data-m="8">
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
