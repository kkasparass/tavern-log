import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ConfirmDialog } from "./ConfirmDialog";

const defaultProps = {
  isOpen: true,
  title: "Are you sure?",
  message: "This action cannot be undone.",
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};

describe("ConfirmDialog", () => {
  it("renders nothing when isOpen is false", () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("renders title, message, and buttons when open", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("uses a custom confirmLabel", () => {
    render(<ConfirmDialog {...defaultProps} confirmLabel="Delete" />);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("applies danger styling to the confirm button when isDangerous", () => {
    render(<ConfirmDialog {...defaultProps} isDangerous />);
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveClass("text-red-300");
  });

  it("does not apply danger styling by default", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Confirm" })).not.toHaveClass("text-red-300");
  });
});
