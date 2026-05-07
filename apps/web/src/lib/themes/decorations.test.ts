import { describe, it, expect } from "vitest";
import { getDecoration } from "./decorations";
import { DecorationSlotName } from "./types";

describe("getDecoration", () => {
  describe("forest set", () => {
    it("returns a component for page-edge-left", () => {
      expect(getDecoration("forest", DecorationSlotName.PageEdgeLeft)).toBeTypeOf("function");
    });

    it("returns a component for page-edge-right", () => {
      expect(getDecoration("forest", DecorationSlotName.PageEdgeRight)).toBeTypeOf("function");
    });

    it("returns a component for header-top", () => {
      expect(getDecoration("forest", DecorationSlotName.HeaderTop)).toBeTypeOf("function");
    });

    it("returns a component for tabs-top", () => {
      expect(getDecoration("forest", DecorationSlotName.TabsTop)).toBeTypeOf("function");
    });

    it("returns null for background (not implemented for forest)", () => {
      expect(getDecoration("forest", DecorationSlotName.Background)).toBeNull();
    });
  });

  describe("none set", () => {
    const slots = [
      DecorationSlotName.PageEdgeLeft,
      DecorationSlotName.PageEdgeRight,
      DecorationSlotName.HeaderTop,
      DecorationSlotName.TabsTop,
      DecorationSlotName.Background,
    ];
    for (const slot of slots) {
      it(`returns null for ${slot}`, () => {
        expect(getDecoration("none", slot)).toBeNull();
      });
    }
  });
});
