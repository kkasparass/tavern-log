import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ColorHarmonyPicker } from "./ColorHarmonyPicker";

// Harmony math verification — complement of #ff0000 (hue 0) is hue 180 = #00ffff
const RED = "#ff0000";
const RED_COMPLEMENT = "#00ffff";

describe("ColorHarmonyPicker", () => {
  it("renders the label", () => {
    render(<ColorHarmonyPicker value="#7c3aed" onChange={vi.fn()} label="Accent" />);
    expect(screen.getByText("Accent")).toBeInTheDocument();
  });

  it("renders 4 harmony swatch buttons", () => {
    render(<ColorHarmonyPicker value="#7c3aed" onChange={vi.fn()} label="Accent" />);
    const swatches = ["Complement", "Analogous", "Triadic", "Split"];
    for (const name of swatches) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("calls onChange with the complement hex when that swatch is clicked", async () => {
    const onChange = vi.fn();
    render(<ColorHarmonyPicker value={RED} onChange={onChange} label="Test" />);
    await userEvent.click(screen.getByRole("button", { name: "Complement" }));
    expect(onChange).toHaveBeenCalledWith(RED_COMPLEMENT);
  });

  it("renders a hue slider (max 360) and a 2D color area slider", () => {
    render(<ColorHarmonyPicker value="#7c3aed" onChange={vi.fn()} label="Accent" />);
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
    const hueSlider = sliders.find((s) => s.getAttribute("max") === "360");
    expect(hueSlider).toBeDefined();
  });
});
