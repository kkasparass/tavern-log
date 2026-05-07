import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ThemeSection } from "./ThemeSection";
import { THEME_PRESETS } from "@/lib/constants";
import { DEFAULT_THEME } from "@/lib/themes/presets";
import type { ThemeConfig } from "@/lib/themes/types";
import { hslToHex, hexToHSL } from "@/lib/colorUtils";

const mockPreview = vi.fn();

vi.mock("@/components/transitions/TransitionProvider", () => ({
  useTransition: () => ({ preview: mockPreview }),
}));

vi.mock("./ColorHarmonyPicker", () => ({
  ColorHarmonyPicker: ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (hex: string) => void;
    label: string;
  }) => (
    <div>
      <label htmlFor={`color-${label}`}>{label}</label>
      <input
        id={`color-${label}`}
        data-testid={`color-${label.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

function renderSection(value: ThemeConfig, onChange = vi.fn()) {
  render(<ThemeSection value={value} onChange={onChange} />);
  return { onChange };
}

describe("ThemeSection", () => {
  it("highlights the active preset when the current theme matches one", () => {
    renderSection(THEME_PRESETS[0].config);
    const btn = screen.getByRole("button", { name: new RegExp(THEME_PRESETS[0].label) });
    expect(btn).toHaveClass("border-white");
  });

  it("shows Custom badge when theme doesn't match any preset", () => {
    renderSection({ ...DEFAULT_THEME, colors: { ...DEFAULT_THEME.colors, bg: "#123456" } });
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("selecting a preset calls onChange with that preset's full config", async () => {
    const { onChange } = renderSection(DEFAULT_THEME);
    const forestPreset = THEME_PRESETS.find((p) => p.label === "Forest")!;
    await userEvent.click(screen.getByRole("button", { name: /Forest/ }));
    expect(onChange).toHaveBeenCalledWith(forestPreset.config);
  });

  it("changing a color field sets preset to 'custom'", () => {
    const { onChange } = renderSection(THEME_PRESETS[0].config);
    fireEvent.change(screen.getByTestId("color-background"), { target: { value: "#abcdef" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: "custom",
        colors: expect.objectContaining({ bg: "#abcdef" }),
      })
    );
  });

  it("Preview button is disabled when transition is null", () => {
    renderSection({ ...DEFAULT_THEME, transition: null });
    expect(screen.getByRole("button", { name: /Preview/ })).toBeDisabled();
  });

  it("Preview button calls preview() with the current transitionId", async () => {
    renderSection({ ...DEFAULT_THEME, transition: "floral-bloom" });
    await userEvent.click(screen.getByRole("button", { name: /Preview/ }));
    expect(mockPreview).toHaveBeenCalledWith("floral-bloom");
  });

  it("renders 4 harmony palette buttons", () => {
    renderSection(DEFAULT_THEME);
    expect(screen.getAllByRole("button", { name: /Apply harmony palette/ })).toHaveLength(4);
  });

  it("clicking a harmony palette applies all three colors and sets preset to custom", async () => {
    const accent = DEFAULT_THEME.colors.accent;
    const [h, s, l] = hexToHSL(accent);
    const expectedAccent = hslToHex((h + 180) % 360, s, l);
    const { onChange } = renderSection(DEFAULT_THEME);
    await userEvent.click(screen.getByRole("button", { name: "Apply harmony palette 1" }));
    const call: ThemeConfig = onChange.mock.calls[0][0];
    expect(call.preset).toBe("custom");
    expect(call.colors.accent).toBe(expectedAccent);
    expect(call.colors.bg).toBeTruthy();
    expect(call.colors.text).toBeTruthy();
  });
});
