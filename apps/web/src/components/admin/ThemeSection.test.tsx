import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ThemeSection } from "./ThemeSection";
import { DEFAULT_THEME } from "@/lib/themes/presets";

vi.mock("./PresetSelector", () => ({
  PresetSelector: () => <div data-testid="preset-selector" />,
}));

vi.mock("./ColorControls", () => ({
  ColorControls: () => <div data-testid="color-controls" />,
}));

vi.mock("./AppearanceControls", () => ({
  AppearanceControls: () => <div data-testid="appearance-controls" />,
}));

describe("ThemeSection", () => {
  it("renders all three sub-sections", () => {
    render(<ThemeSection value={DEFAULT_THEME} onChange={vi.fn()} />);
    expect(screen.getByTestId("preset-selector")).toBeInTheDocument();
    expect(screen.getByTestId("color-controls")).toBeInTheDocument();
    expect(screen.getByTestId("appearance-controls")).toBeInTheDocument();
  });
});
