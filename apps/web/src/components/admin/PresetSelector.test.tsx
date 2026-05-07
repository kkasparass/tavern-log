import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PresetSelector } from "./PresetSelector";
import { THEME_PRESETS } from "@/lib/constants";
import { DEFAULT_THEME } from "@/lib/themes/presets";

describe("PresetSelector", () => {
  it("renders a button for each preset", () => {
    render(<PresetSelector value={DEFAULT_THEME} onChange={vi.fn()} />);
    for (const preset of THEME_PRESETS) {
      expect(screen.getByRole("button", { name: new RegExp(preset.label) })).toBeInTheDocument();
    }
  });

  it("highlights the active preset when the current theme matches one", () => {
    render(<PresetSelector value={THEME_PRESETS[0].config} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: new RegExp(THEME_PRESETS[0].label) })).toHaveClass(
      "border-white"
    );
  });

  it("shows Custom badge when theme doesn't match any preset", () => {
    render(
      <PresetSelector
        value={{ ...DEFAULT_THEME, colors: { ...DEFAULT_THEME.colors, bg: "#123456" } }}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("calls onChange with the preset's full config when a preset is clicked", async () => {
    const onChange = vi.fn();
    render(<PresetSelector value={DEFAULT_THEME} onChange={onChange} />);
    const forestPreset = THEME_PRESETS.find((p) => p.label === "Forest")!;
    await userEvent.click(screen.getByRole("button", { name: /Forest/ }));
    expect(onChange).toHaveBeenCalledWith(forestPreset.config);
  });
});
