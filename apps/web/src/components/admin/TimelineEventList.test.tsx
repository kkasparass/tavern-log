import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TimelineEventList } from "./TimelineEventList";
import { mockCharacter } from "@/test/fixtures";

const [first, second, third] = mockCharacter.timeline;

const defaultProps = {
  events: [first, second, third],
  editingEvent: null,
  onEdit: vi.fn(),
  onSaveEdit: vi.fn(),
  onCancelEdit: vi.fn(),
  isSavingEdit: false,
  saveEditError: false,
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

  it("calls onEdit with the event when Edit is clicked", async () => {
    const onEdit = vi.fn();
    render(<TimelineEventList {...defaultProps} onEdit={onEdit} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    expect(onEdit).toHaveBeenCalledWith(first);
  });

  it("renders inline form in place of the editing event", () => {
    render(<TimelineEventList {...defaultProps} editingEvent={first} />);
    expect(screen.getByPlaceholderText("Event title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("pre-fills the inline form with the editing event values", () => {
    render(<TimelineEventList {...defaultProps} editingEvent={first} />);
    expect(screen.getByPlaceholderText("Event title")).toHaveValue(first.title);
    expect(screen.getByPlaceholderText("What happened?")).toHaveValue(first.description);
    expect(screen.getByPlaceholderText("e.g. Year 412, Session 3, Spring")).toHaveValue(first.dateLabel);
  });

  it("still renders normal view for items not being edited", () => {
    render(<TimelineEventList {...defaultProps} editingEvent={first} />);
    expect(screen.getByText(second.title)).toBeInTheDocument();
    expect(screen.getByText(third.title)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(2);
  });

  it("calls onSaveEdit with the event id and updated data on Save", async () => {
    const onSaveEdit = vi.fn();
    render(<TimelineEventList {...defaultProps} editingEvent={first} onSaveEdit={onSaveEdit} />);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSaveEdit).toHaveBeenCalledWith(
      first.id,
      expect.objectContaining({ title: first.title, dateLabel: first.dateLabel })
    );
  });

  it("calls onCancelEdit when Cancel is clicked in the inline form", async () => {
    const onCancelEdit = vi.fn();
    render(<TimelineEventList {...defaultProps} editingEvent={first} onCancelEdit={onCancelEdit} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancelEdit).toHaveBeenCalled();
  });

  it("shows saving state in the inline form when isSavingEdit", () => {
    render(<TimelineEventList {...defaultProps} editingEvent={first} isSavingEdit />);
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("shows error in the inline form when saveEditError", () => {
    render(<TimelineEventList {...defaultProps} editingEvent={first} saveEditError />);
    expect(screen.getByText("Failed to update event.")).toBeInTheDocument();
  });
});
