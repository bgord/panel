import * as v from "valibot";

const PanelLocationError = {
  Type: "panel.location.type",
  Empty: "panel.location.empty",
  TooLong: "panel.location.too.long",
};

export const PanelLocation = v.pipe(
  v.string(PanelLocationError.Type),
  v.minLength(1, PanelLocationError.Empty),
  v.maxLength(128, PanelLocationError.TooLong),
  // Stryker disable next-line StringLiteral
  v.brand("PanelLocation"),
);

export type PanelLocationType = v.InferOutput<typeof PanelLocation>;
