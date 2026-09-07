import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCharacterForm } from "./useCharacterForm";
import { DEFAULT_THEME } from "@/lib/themes/presets";
import { CardImageAlignment, CardTemplateId, DecorationSetId } from "@/lib/themes/types";

describe("useCharacterForm", () => {
  it("initialises card state from defaultValues theme", () => {
    const { result } = renderHook(() =>
      useCharacterForm({
        theme: { bgColor: "#1a1a2e", card: { template: "compact", settings: { showTags: false } } },
      })
    );
    expect(result.current.card).toEqual({
      template: CardTemplateId.Compact,
      settings: { showTags: false },
    });
  });

  it("defaults card state to portrait when theme has no card", () => {
    const { result } = renderHook(() => useCharacterForm());
    expect(result.current.card).toEqual({ template: CardTemplateId.Portrait, settings: {} });
  });

  it("card changes do not touch theme state", () => {
    const { result } = renderHook(() => useCharacterForm());
    act(() => {
      result.current.setCard({ template: CardTemplateId.Banner, settings: { imageAlignment: CardImageAlignment.Right } });
    });
    // reference equality — card edits must not replace the theme state object
    expect(result.current.theme).toBe(DEFAULT_THEME);
    expect(result.current.card).toEqual({
      template: CardTemplateId.Banner,
      settings: { imageAlignment: CardImageAlignment.Right },
    });
  });

  it("theme preset fills do not stomp card state", () => {
    const { result } = renderHook(() =>
      useCharacterForm({ theme: { card: { template: "compact", settings: { showTags: false } } } })
    );
    act(() => {
      result.current.setTheme({
        preset: DecorationSetId.Forest,
        colors: { bg: "#0f1a0f", text: "#d4e8d4", accent: "#4ade80" },
        bgPattern: "none",
        transition: null,
        decorations: null,
      });
    });
    expect(result.current.theme.preset).toBe("forest");
    expect(result.current.card).toEqual({
      template: CardTemplateId.Compact,
      settings: { showTags: false },
    });
  });
});
