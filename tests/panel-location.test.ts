import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Panel from "+panel";

describe("PanelLocation", () => {
  test("happy path", () => {
    expect(v.safeParse(Panel.VO.PanelLocation, "a".repeat(128)).success).toEqual(true);
    expect(v.safeParse(Panel.VO.PanelLocation, "A".repeat(128)).success).toEqual(true);
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Panel.VO.PanelLocation, null)).toThrow("panel.location.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Panel.VO.PanelLocation, 123)).toThrow("panel.location.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Panel.VO.PanelLocation, "")).toThrow("panel.location.empty");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Panel.VO.PanelLocation, `${"a".repeat(128)}a`)).toThrow("panel.location.too.long");
  });
});
