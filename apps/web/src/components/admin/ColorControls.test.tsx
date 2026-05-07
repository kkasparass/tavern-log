import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ColorControls } from "./ColorControls";
import type { ThemeColors } from "@/lib/themes/types";

vi.mock("./ColorPicker", () => ({
  ColorPicker: ({
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

const defaultColors: ThemeColors = {
  bg: "#0f0f1a",
  text: "#e0e0e0",
  accent: "#7c3aed",
};

describe("ColorControls", () => {
  it("renders pickers for Background, Text, and Accent", () => {
    render(<ColorControls value={defaultColors} onChange={vi.fn()} />);
    expect(screen.getByText("Background")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
    expect(screen.getByText("Accent")).toBeInTheDocument();
  });

  it("calls onChange with updated bg color", () => {
    const onChange = vi.fn();
    render(<ColorControls value={defaultColors} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("color-background"), { target: { value: "#abcdef" } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultColors, bg: "#abcdef" });
  });

  it("calls onChange with updated text color", () => {
    const onChange = vi.fn();
    render(<ColorControls value={defaultColors} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("color-text"), { target: { value: "#ffffff" } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultColors, text: "#ffffff" });
  });

  it("calls onChange with updated accent color", () => {
    const onChange = vi.fn();
    render(<ColorControls value={defaultColors} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("color-accent"), { target: { value: "#ff0000" } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultColors, accent: "#ff0000" });
  });
});
