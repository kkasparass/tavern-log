import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ArtworkList } from "./ArtworkList";
import { mockCharacter } from "@/test/fixtures";

const [first, second] = mockCharacter.artworks;

const defaultProps = {
  artworks: [first, second],
  onMoveUp: vi.fn(),
  onMoveDown: vi.fn(),
  onDelete: vi.fn(),
  isDeleting: false,
};

describe("ArtworkList", () => {
  it("renders imageUrl, title, and caption for each artwork", () => {
    render(<ArtworkList {...defaultProps} />);
    expect(screen.getByText(first.title!)).toBeInTheDocument();
    expect(screen.getByText(first.caption!)).toBeInTheDocument();
    expect(screen.getByText(second.title!)).toBeInTheDocument();
  });

  it("renders artist credit when present", () => {
    render(<ArtworkList {...defaultProps} />);
    expect(screen.getByText(`Art by ${first.artistCredit}`)).toBeInTheDocument();
  });

  it("disables Move Up for the first item", () => {
    render(<ArtworkList {...defaultProps} />);
    const upButtons = screen.getAllByRole("button", { name: "Move up" });
    expect(upButtons[0]).toBeDisabled();
    expect(upButtons[1]).toBeEnabled();
  });

  it("disables Move Down for the last item", () => {
    render(<ArtworkList {...defaultProps} />);
    const downButtons = screen.getAllByRole("button", { name: "Move down" });
    expect(downButtons[0]).toBeEnabled();
    expect(downButtons[1]).toBeDisabled();
  });

  it("calls onMoveUp with the correct index", async () => {
    const onMoveUp = vi.fn();
    render(<ArtworkList {...defaultProps} onMoveUp={onMoveUp} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Move up" })[1]);
    expect(onMoveUp).toHaveBeenCalledWith(1);
  });

  it("calls onMoveDown with the correct index", async () => {
    const onMoveDown = vi.fn();
    render(<ArtworkList {...defaultProps} onMoveDown={onMoveDown} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Move down" })[0]);
    expect(onMoveDown).toHaveBeenCalledWith(0);
  });

  it("calls onDelete with the artwork id", async () => {
    const onDelete = vi.fn();
    render(<ArtworkList {...defaultProps} onDelete={onDelete} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(onDelete).toHaveBeenCalledWith(first.id);
  });

  it("disables Delete buttons when isDeleting", () => {
    render(<ArtworkList {...defaultProps} isDeleting />);
    screen.getAllByRole("button", { name: "Delete" }).forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it("shows empty state when artworks list is empty", () => {
    render(<ArtworkList {...defaultProps} artworks={[]} />);
    expect(screen.getByText("No artworks yet.")).toBeInTheDocument();
  });
});
