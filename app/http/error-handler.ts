import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";

type Dependencies = { Logger: bg.LoggerPort };

const http = new bg.ErrorClassifierHttpExceptionHonoStrategy({
  known: [
    bg.ShieldCsrfStrategyError.Rejected,
    bg.ShieldTimeoutStrategyError.Rejected,
    bg.ShieldRateLimitStrategyError.Rejected,
    bg.ShieldBasicAuthStrategyError.Rejected,
  ],
});

const validation = new bg.ErrorClassifierValidationStrategy({
  validationErrors: [
    tools.LanguageError.Type,
    tools.LanguageError.BadChars,
    tools.ObjectKeyError.Type,
    tools.ObjectKeyError.Empty,
    tools.ObjectKeyError.TooLong,
    tools.ObjectKeyError.BadChars,
    tools.ObjectKeyError.LeadingSlash,
  ],
});

const unknown = new bg.ErrorClassifierUnknownStrategy();

export class ErrorHandler {
  static handle: (deps: Dependencies) => hono.ErrorHandler = (deps) =>
    new bg.ErrorHonoHandler({
      classifiers: [
        http,
        new bg.ErrorClassifierWithLoggerStrategy({ operation: "validation" }, { inner: validation, ...deps }),
      ],
      fallback: new bg.ErrorClassifierWithLoggerStrategy(
        { operation: "unknown_error" },
        { inner: unknown, ...deps },
      ),
    }).handle();
}
