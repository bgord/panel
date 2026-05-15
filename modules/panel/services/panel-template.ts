import type * as tools from "@bgord/tools";
import type * as Panel from "+panel";

export class PanelTemplate {
  create(language: tools.LanguageType, weather: Panel.Ports.Weather, css: string): string {
    return /* HTML */ `
      <html lang="${language}">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
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
              .toLocaleString(language, { day: "numeric", month: "long" })}
          </section>

          <section data-stack="y" data-cross="center" data-p="3">
            <div data-fs="5xl" data-color="neutral-500" data-my="5">${weather.location}</div>

            <div data-stack="x" data-gap="12">
              <div data-stack="y" data-cross="center" data-main="between">
                <img src="${weather.conditionImageUrl}" alt="${weather.condition}" />
                <div data-fs="xl" data-color="neutral-400">${weather.condition}</div>
              </div>

              <div
                data-color="neutral-900"
                data-stack="y"
                data-cross="center"
                data-main="between"
                data-mt="4"
              >
                <div data-fs="5xl">${weather.temperatureCelsius} °C</div>
                <div data-fs="xl">feels like ${weather.feelsLikeCelsius} °C</div>
              </div>
            </div>

            <div data-fs="xl" data-color="neutral-300" data-mt="8">
              ${weather.precipitation.probability}% precipitation (${weather.precipitation.hour}:00)
            </div>
          </section>

          <section data-color="neutral-400" data-m="8">
            Generated at
            ${weather.generatedAt
              .toInstant()
              .toZonedDateTimeISO("Europe/Warsaw")
              .toLocaleString(language, { dateStyle: "full", timeStyle: "short" })}
          </section>
        </body>
      </html>
    `;
  }
}
