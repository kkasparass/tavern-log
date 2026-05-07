import { describe, it, expect } from "vitest";
import { resolveTheme, DEFAULT_THEME, THEME_PRESETS } from "./presets";

describe("resolveTheme", () => {
  describe("new shape (nested colors)", () => {
    it("returns the stored config when fully specified", () => {
      const result = resolveTheme({
        preset: "forest",
        colors: { bg: "#0f1a0f", text: "#d4e8d4", accent: "#4ade80" },
        bgPattern: "none",
        transition: "bells-flower",
        decorations: "forest",
      });
      expect(result).toEqual({
        preset: "forest",
        colors: { bg: "#0f1a0f", text: "#d4e8d4", accent: "#4ade80" },
        bgPattern: "none",
        transition: "bells-flower",
        decorations: "forest",
      });
    });

    it("falls back to DEFAULT_THEME for missing fields", () => {
      const result = resolveTheme({ colors: { bg: "#aabbcc", text: "#ffffff", accent: "#ff0000" } });
      expect(result.preset).toBe(DEFAULT_THEME.preset);
      expect(result.bgPattern).toBe(DEFAULT_THEME.bgPattern);
      expect(result.transition).toBe(DEFAULT_THEME.transition);
      expect(result.decorations).toBe(DEFAULT_THEME.decorations);
      expect(result.colors.bg).toBe("#aabbcc");
    });

    it("falls back individual color fields to defaults when missing", () => {
      const result = resolveTheme({ colors: { bg: "#112233" } });
      expect(result.colors.bg).toBe("#112233");
      expect(result.colors.text).toBe(DEFAULT_THEME.colors.text);
      expect(result.colors.accent).toBe(DEFAULT_THEME.colors.accent);
    });
  });

  describe("legacy flat shape (bgColor / textColor / accentColor)", () => {
    it("maps flat fields to nested colors", () => {
      const result = resolveTheme({
        bgColor: "#1a1a2e",
        textColor: "#e0e0e0",
        accentColor: "#7c3aed",
      });
      expect(result.colors).toEqual({
        bg: "#1a1a2e",
        text: "#e0e0e0",
        accent: "#7c3aed",
      });
    });

    it("uses DEFAULT_THEME for other fields not present in legacy data", () => {
      const result = resolveTheme({ bgColor: "#111111" });
      expect(result.preset).toBe(DEFAULT_THEME.preset);
      expect(result.transition).toBe(DEFAULT_THEME.transition);
      expect(result.decorations).toBe(DEFAULT_THEME.decorations);
    });

    it("falls back individual legacy color fields to defaults when missing", () => {
      const result = resolveTheme({ accentColor: "#ff0000" });
      expect(result.colors.bg).toBe(DEFAULT_THEME.colors.bg);
      expect(result.colors.text).toBe(DEFAULT_THEME.colors.text);
      expect(result.colors.accent).toBe("#ff0000");
    });
  });

  describe("empty / missing data", () => {
    it("returns DEFAULT_THEME for an empty object", () => {
      expect(resolveTheme({})).toEqual(DEFAULT_THEME);
    });

    it("returns DEFAULT_THEME for unrecognised shape", () => {
      expect(resolveTheme({ foo: "bar", unknown: 42 })).toEqual(DEFAULT_THEME);
    });
  });
});

describe("THEME_PRESETS", () => {
  it("has 5 presets", () => {
    expect(THEME_PRESETS).toHaveLength(5);
  });

  it("each preset has a label and a full ThemeConfig", () => {
    for (const preset of THEME_PRESETS) {
      expect(preset.label).toBeTruthy();
      expect(preset.config.colors.bg).toBeTruthy();
      expect(preset.config.colors.text).toBeTruthy();
      expect(preset.config.colors.accent).toBeTruthy();
    }
  });

  it("Forest preset has decorations set to 'forest'", () => {
    const forest = THEME_PRESETS.find((p) => p.label === "Forest");
    expect(forest?.config.decorations).toBe("forest");
  });

  it("non-Forest presets have decorations set to null", () => {
    const others = THEME_PRESETS.filter((p) => p.label !== "Forest");
    for (const preset of others) {
      expect(preset.config.decorations).toBeNull();
    }
  });
});
