import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Panel from "+panel";

describe("PanelKeyFactory", () => {
  test("en", () => {
    expect(Panel.VO.PanelKeyFactory.stable("en")).toEqual(v.parse(tools.ObjectKey, "panels/panel-en.png"));
  });
});
