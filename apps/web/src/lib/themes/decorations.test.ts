import { describe, it, expect } from "vitest";
import { getDecoration } from "./decorations";

describe("getDecoration", () => {
  describe("forest set", () => {
    it("returns a component for page-edge-left", () => {
      expect(getDecoration("forest", "page-edge-left")).toBeTypeOf("function");
    });

    it("returns a component for page-edge-right", () => {
      expect(getDecoration("forest", "page-edge-right")).toBeTypeOf("function");
    });

    it("returns a component for header-top", () => {
      expect(getDecoration("forest", "header-top")).toBeTypeOf("function");
    });

    it("returns a component for tabs-top", () => {
      expect(getDecoration("forest", "tabs-top")).toBeTypeOf("function");
    });

    it("returns null for background (not implemented for forest)", () => {
      expect(getDecoration("forest", "background")).toBeNull();
    });
  });

  describe("none set", () => {
    const slots = ["page-edge-left", "page-edge-right", "header-top", "tabs-top", "background"] as const;
    for (const slot of slots) {
      it(`returns null for ${slot}`, () => {
        expect(getDecoration("none", slot)).toBeNull();
      });
    }
  });
});
