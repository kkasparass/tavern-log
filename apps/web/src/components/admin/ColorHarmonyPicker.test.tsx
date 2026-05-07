import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ColorHarmonyPicker } from "./ColorHarmonyPicker";

describe("ColorHarmonyPicker", () => {
  it("renders the label", () => {
    render(<ColorHarmonyPicker value="#7c3aed" onChange={vi.fn()} label="Accent" />);
    expect(screen.getByText("Accent")).toBeInTheDocument();
  });

  it("renders a 2D color area and a hue slider (max 360)", () => {
    render(<ColorHarmonyPicker value="#7c3aed" onChange={vi.fn()} label="Accent" />);
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
    const hueSlider = sliders.find((s) => s.getAttribute("max") === "360");
    expect(hueSlider).toBeDefined();
  });
});
