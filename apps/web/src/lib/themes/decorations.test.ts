import { describe, it, expect } from "vitest";
import { getDecoration } from "./decorations";
import { DecorationSetId, DecorationSlotName } from "./types";

describe("getDecoration", () => {
  describe("forest set", () => {
    it("returns a component for page-edge-left", () => {
      expect(getDecoration(DecorationSetId.Forest, DecorationSlotName.PageEdgeLeft)).toBeTypeOf(
        "function"
      );
    });

    it("returns a component for page-edge-right", () => {
      expect(getDecoration(DecorationSetId.Forest, DecorationSlotName.PageEdgeRight)).toBeTypeOf(
        "function"
      );
    });

    it("returns a component for header-top", () => {
      expect(getDecoration(DecorationSetId.Forest, DecorationSlotName.HeaderTop)).toBeTypeOf(
        "function"
      );
    });

    it("returns a component for tabs-top", () => {
      expect(getDecoration(DecorationSetId.Forest, DecorationSlotName.TabsTop)).toBeTypeOf(
        "function"
      );
    });

    it("returns null for background (not implemented for forest)", () => {
      expect(getDecoration(DecorationSetId.Forest, DecorationSlotName.Background)).toBeNull();
    });
  });
});
