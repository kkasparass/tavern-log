import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TimelineEventForm } from "./TimelineEventForm";

const defaultProps = {
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
  nextOrder: 3,
  isPending: false,
  isError: false,
};

describe("TimelineEventForm", () => {
  it("renders Title, Description, and Date Label fields", () => {
    render(<TimelineEventForm {...defaultProps} />);
    expect(screen.getByPlaceholderText("Event title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What happened?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Year 412, Session 3, Spring")).toBeInTheDocument();
  });

  it("disables Save when title is empty", () => {
    render(<TimelineEventForm {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("calls onSubmit with correct data including nextOrder", async () => {
    const onSubmit = vi.fn();
    render(<TimelineEventForm {...defaultProps} onSubmit={onSubmit} nextOrder={4} />);
    await userEvent.type(screen.getByPlaceholderText("Event title"), "The Battle");
    await userEvent.type(screen.getByPlaceholderText("What happened?"), "It was fierce.");
    await userEvent.type(
      screen.getByPlaceholderText("e.g. Year 412, Session 3, Spring"),
      "Year 412"
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({
      title: "The Battle",
      description: "It was fierce.",
      dateLabel: "Year 412",
      order: 4,
    });
  });

  it("omits optional fields from payload when left empty", async () => {
    const onSubmit = vi.fn();
    render(<TimelineEventForm {...defaultProps} onSubmit={onSubmit} />);
    await userEvent.type(screen.getByPlaceholderText("Event title"), "The Battle");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ description: undefined, dateLabel: undefined })
    );
  });

  it("shows Saving… and disables Save when isPending", () => {
    render(<TimelineEventForm {...defaultProps} isPending />);
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const onCancel = vi.fn();
    render(<TimelineEventForm {...defaultProps} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("shows error message when isError is true", () => {
    render(<TimelineEventForm {...defaultProps} isError />);
    expect(screen.getByText("Failed to create event.")).toBeInTheDocument();
  });
});
