import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { VoiceLineList } from "./VoiceLineList";
import { mockCharacter } from "@/test/fixtures";

const [first, second] = mockCharacter.voiceLines;

const defaultProps = {
  voiceLines: [first, second],
  onMoveUp: vi.fn(),
  onMoveDown: vi.fn(),
  onDelete: vi.fn(),
  isDeleting: false,
};

describe("VoiceLineList", () => {
  it("renders transcripts for each voice line", () => {
    render(<VoiceLineList {...defaultProps} />);
    expect(screen.getByText(first.transcript)).toBeInTheDocument();
    expect(screen.getByText(second.transcript)).toBeInTheDocument();
  });

  it("renders context when present", () => {
    render(<VoiceLineList {...defaultProps} />);
    expect(screen.getByText(first.context!)).toBeInTheDocument();
  });

  it("disables the Move Up button for the first item", () => {
    render(<VoiceLineList {...defaultProps} />);
    const upButtons = screen.getAllByRole("button", { name: "Move up" });
    expect(upButtons[0]).toBeDisabled();
    expect(upButtons[1]).toBeEnabled();
  });

  it("disables the Move Down button for the last item", () => {
    render(<VoiceLineList {...defaultProps} />);
    const downButtons = screen.getAllByRole("button", { name: "Move down" });
    expect(downButtons[0]).toBeEnabled();
    expect(downButtons[1]).toBeDisabled();
  });

  it("calls onMoveUp with the correct index", async () => {
    const onMoveUp = vi.fn();
    render(<VoiceLineList {...defaultProps} onMoveUp={onMoveUp} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Move up" })[1]);
    expect(onMoveUp).toHaveBeenCalledWith(1);
  });

  it("calls onMoveDown with the correct index", async () => {
    const onMoveDown = vi.fn();
    render(<VoiceLineList {...defaultProps} onMoveDown={onMoveDown} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Move down" })[0]);
    expect(onMoveDown).toHaveBeenCalledWith(0);
  });

  it("calls onDelete with the voice line id", async () => {
    const onDelete = vi.fn();
    render(<VoiceLineList {...defaultProps} onDelete={onDelete} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(onDelete).toHaveBeenCalledWith(first.id);
  });

  it("disables Delete buttons when isDeleting", () => {
    render(<VoiceLineList {...defaultProps} isDeleting />);
    screen.getAllByRole("button", { name: "Delete" }).forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("shows empty state when voice lines list is empty", () => {
    render(<VoiceLineList {...defaultProps} voiceLines={[]} />);
    expect(screen.getByText("No voice lines yet.")).toBeInTheDocument();
  });
});
