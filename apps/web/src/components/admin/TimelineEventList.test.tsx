import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TimelineEventList } from "./TimelineEventList";
import { mockCharacter } from "@/test/fixtures";

const [first, second, third] = mockCharacter.timeline;

const defaultProps = {
  events: [first, second, third],
  onMoveUp: vi.fn(),
  onMoveDown: vi.fn(),
  onDelete: vi.fn(),
  isDeleting: false,
};

describe("TimelineEventList", () => {
  it("renders event titles, dateLabels, and descriptions", () => {
    render(<TimelineEventList {...defaultProps} />);
    expect(screen.getByText(first.title)).toBeInTheDocument();
    expect(screen.getByText(first.dateLabel!)).toBeInTheDocument();
    expect(screen.getByText(first.description!)).toBeInTheDocument();
  });

  it("disables Move Up for the first item", () => {
    render(<TimelineEventList {...defaultProps} />);
    const upButtons = screen.getAllByRole("button", { name: "Move up" });
    expect(upButtons[0]).toBeDisabled();
    expect(upButtons[1]).toBeEnabled();
  });

  it("disables Move Down for the last item", () => {
    render(<TimelineEventList {...defaultProps} />);
    const downButtons = screen.getAllByRole("button", { name: "Move down" });
    expect(downButtons[downButtons.length - 1]).toBeDisabled();
    expect(downButtons[downButtons.length - 2]).toBeEnabled();
  });

  it("calls onMoveUp with the correct index", async () => {
    const onMoveUp = vi.fn();
    render(<TimelineEventList {...defaultProps} onMoveUp={onMoveUp} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Move up" })[1]);
    expect(onMoveUp).toHaveBeenCalledWith(1);
  });

  it("calls onMoveDown with the correct index", async () => {
    const onMoveDown = vi.fn();
    render(<TimelineEventList {...defaultProps} onMoveDown={onMoveDown} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Move down" })[0]);
    expect(onMoveDown).toHaveBeenCalledWith(0);
  });

  it("calls onDelete with the event id", async () => {
    const onDelete = vi.fn();
    render(<TimelineEventList {...defaultProps} onDelete={onDelete} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(onDelete).toHaveBeenCalledWith(first.id);
  });

  it("disables Delete buttons when isDeleting", () => {
    render(<TimelineEventList {...defaultProps} isDeleting />);
    screen.getAllByRole("button", { name: "Delete" }).forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("shows empty state when events list is empty", () => {
    render(<TimelineEventList {...defaultProps} events={[]} />);
    expect(screen.getByText("No events yet.")).toBeInTheDocument();
  });
});
