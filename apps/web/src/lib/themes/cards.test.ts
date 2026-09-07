import { describe, it, expect } from "vitest";
import { resolveCard, resolveCardFromTheme, CARD_TEMPLATE_DEFAULTS } from "./cards";
import { CardImageAlignment, CardTemplateId } from "./types";
import type { BannerSettings, CompactSettings, PolaroidSettings } from "./types";

describe("resolveCard", () => {
  it("returns typed defaults for a template with no stored settings", () => {
    const result = resolveCard(CardTemplateId.Banner, {});
    expect(result).toEqual({
      template: "banner",
      settings: { imageAlignment: CardImageAlignment.Left },
    });
    const alignment: BannerSettings["imageAlignment"] = result.settings.imageAlignment;
    expect(alignment).toBe("left");
  });

  it("merges stored settings over defaults", () => {
    const result = resolveCard(CardTemplateId.Polaroid, {
      card: { template: "polaroid", settings: { rotation: 4 } },
    });
    expect(result.settings).toEqual({ rotation: 4, frameColor: "#f5f0e6" });
    const rotation: PolaroidSettings["rotation"] = result.settings.rotation;
    expect(rotation).toBe(4);
  });

  it("drops unknown settings keys", () => {
    const result = resolveCard(CardTemplateId.Compact, {
      card: { template: "compact", settings: { showTags: false, bogus: 1 } },
    });
    expect(result.settings).toEqual({ showTags: false });
  });

  it("falls back to the default when a value has the wrong type", () => {
    const result = resolveCard(CardTemplateId.Banner, {
      card: { template: "banner", settings: { imageAlignment: 42 } },
    });
    expect(result.settings).toEqual({ imageAlignment: CardImageAlignment.Left });
  });

  it("keeps only matching-type keys when settings are mixed", () => {
    const result = resolveCard(CardTemplateId.Compact, {
      card: { template: "compact", settings: { showTags: "yes", bogus: 1 } },
    });
    expect(result.settings).toEqual({ showTags: true });
  });

  it("narrows settings per template without casts", () => {
    const portrait = resolveCard(CardTemplateId.Portrait, {});
    const keys: string[] = Object.keys(portrait.settings);
    expect(keys).toEqual([]);

    const compact = resolveCard(CardTemplateId.Compact, {});
    const showTags: CompactSettings["showTags"] = compact.settings.showTags;
    expect(showTags).toBe(true);
  });
});

describe("resolveCardFromTheme", () => {
  it("resolves the stored template and its settings", () => {
    const result = resolveCardFromTheme({
      colors: { bg: "#000000" },
      card: { template: "banner", settings: { imageAlignment: "right" } },
    });
    expect(result.template).toBe("banner");
    expect(result.settings).toEqual({ imageAlignment: CardImageAlignment.Right });
  });

  it("falls back to portrait when theme has no card key", () => {
    const result = resolveCardFromTheme({ colors: { bg: "#000000" } });
    expect(result).toEqual({ template: "portrait", settings: {} });
  });

  it("falls back to portrait for a legacy flat theme shape", () => {
    const result = resolveCardFromTheme({
      bgColor: "#1a1a2e",
      textColor: "#e0e0e0",
      accentColor: "#7c3aed",
    });
    expect(result).toEqual({ template: "portrait", settings: {} });
  });

  it("falls back to portrait for an unknown template id", () => {
    const result = resolveCardFromTheme({
      card: { template: "hologram", settings: {} },
    });
    expect(result.template).toBe("portrait");
    expect(result.settings).toEqual({});
  });

  it("falls back to portrait when card is not an object", () => {
    expect(resolveCardFromTheme({ card: "banner" })).toEqual({
      template: "portrait",
      settings: {},
    });
    expect(resolveCardFromTheme({ card: 42 })).toEqual({
      template: "portrait",
      settings: {},
    });
  });

  it("falls back to defaults when settings are not an object", () => {
    const result = resolveCardFromTheme({
      card: { template: "compact", settings: "show-tags" },
    });
    expect(result.settings).toEqual(CARD_TEMPLATE_DEFAULTS[CardTemplateId.Compact]);
  });

  it("falls back to defaults when settings are missing", () => {
    const result = resolveCardFromTheme({ card: { template: "polaroid" } });
    expect(result.settings).toEqual(CARD_TEMPLATE_DEFAULTS[CardTemplateId.Polaroid]);
  });
});

describe("CARD_TEMPLATE_DEFAULTS", () => {
  it("has an entry for every CardTemplateId", () => {
    for (const id of Object.values(CardTemplateId)) {
      expect(CARD_TEMPLATE_DEFAULTS[id]).toBeDefined();
    }
  });
});
