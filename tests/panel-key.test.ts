import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Panel from "+panel";

describe("PanelKeyFactory", () => {
  test("happy path", () => {
    expect(Panel.VO.PanelKeyFactory.stable()).toEqual(v.parse(tools.ObjectKey, "panels/panel.png"));
  });
});
