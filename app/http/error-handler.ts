import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";

type Dependencies = { Logger: bg.LoggerPort };

const http = new bg.ErrorClassifierHttpExceptionHonoStrategy([bg.HttpExceptionErrors]);

const validation = new bg.ErrorClassifierValidationStrategy([tools.LanguageError, tools.ObjectKeyError]);

export class ErrorHandler {
  static handle: (deps: Dependencies) => hono.ErrorHandler = (deps) =>
    new bg.ErrorHonoHandler(
      [
        http,
        new bg.ErrorClassifierWithLoggerStrategy({ operation: "validation" }, { inner: validation, ...deps }),
      ],
      deps,
    ).handle();
}
