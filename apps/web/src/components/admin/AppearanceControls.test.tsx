import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AppearanceControls } from "./AppearanceControls";
import { DEFAULT_THEME } from "@/lib/themes/presets";

const mockPreview = vi.fn();

vi.mock("@/components/transitions/TransitionProvider", () => ({
  useTransition: () => ({ preview: mockPreview }),
}));

describe("AppearanceControls", () => {
  it("renders pattern, transition, and decoration dropdowns", () => {
    render(<AppearanceControls value={DEFAULT_THEME} onChange={vi.fn()} />);
    expect(screen.getByLabelText("Background Pattern")).toBeInTheDocument();
    expect(screen.getByLabelText("Transition")).toBeInTheDocument();
    expect(screen.getByLabelText("Decorations")).toBeInTheDocument();
  });

  it("Preview button is disabled when transition is null", () => {
    render(
      <AppearanceControls value={{ ...DEFAULT_THEME, transition: null }} onChange={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: /Preview/ })).toBeDisabled();
  });

  it("Preview button calls preview() with the current transitionId", async () => {
    render(
      <AppearanceControls
        value={{ ...DEFAULT_THEME, transition: "floral-bloom" }}
        onChange={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /Preview/ }));
    expect(mockPreview).toHaveBeenCalledWith("floral-bloom");
  });

  it("changing transition calls onChange with updated value and preset: custom", async () => {
    const onChange = vi.fn();
    render(<AppearanceControls value={DEFAULT_THEME} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText("Transition"), "floral-bloom");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ transition: "floral-bloom", preset: "custom" })
    );
  });
});
