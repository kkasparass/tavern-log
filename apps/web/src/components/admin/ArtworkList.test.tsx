import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ArtworkList } from "./ArtworkList";
import { mockCharacter } from "@/test/fixtures";

vi.mock("./FileUpload", () => ({
  FileUpload: ({ onUpload, label }: { onUpload: (url: string) => void; label?: string }) => (
    <button onClick={() => onUpload("https://new-img.png")}>{label ?? "Upload file"}</button>
  ),
}));

const [first, second] = mockCharacter.artworks;

const defaultProps = {
  artworks: [first, second],
  editingArtwork: null,
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

  it("calls onEdit with the artwork when Edit is clicked", async () => {
    const onEdit = vi.fn();
    render(<ArtworkList {...defaultProps} onEdit={onEdit} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    expect(onEdit).toHaveBeenCalledWith(first);
  });

  it("renders inline form in place of the editing artwork", () => {
    render(<ArtworkList {...defaultProps} editingArtwork={first} />);
    expect(screen.getByPlaceholderText("Artwork title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("pre-fills the inline form with the editing artwork values", () => {
    render(<ArtworkList {...defaultProps} editingArtwork={first} />);
    expect(screen.getByPlaceholderText("Artwork title")).toHaveValue(first.title);
    expect(screen.getByPlaceholderText("Short description")).toHaveValue(first.caption);
    expect(screen.getByPlaceholderText("Artist name or link")).toHaveValue(first.artistCredit);
  });

  it("still renders normal view for items not being edited", () => {
    render(<ArtworkList {...defaultProps} editingArtwork={first} />);
    expect(screen.getByText(second.title!)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(1);
  });

  it("calls onSaveEdit with the artwork id and updated data on Save", async () => {
    const onSaveEdit = vi.fn();
    render(<ArtworkList {...defaultProps} editingArtwork={first} onSaveEdit={onSaveEdit} />);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSaveEdit).toHaveBeenCalledWith(
      first.id,
      expect.objectContaining({ imageUrl: first.imageUrl, title: first.title })
    );
  });

  it("calls onCancelEdit when Cancel is clicked in the inline form", async () => {
    const onCancelEdit = vi.fn();
    render(<ArtworkList {...defaultProps} editingArtwork={first} onCancelEdit={onCancelEdit} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancelEdit).toHaveBeenCalled();
  });

  it("shows saving state in the inline form when isSavingEdit", () => {
    render(<ArtworkList {...defaultProps} editingArtwork={first} isSavingEdit />);
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("shows error in the inline form when saveEditError", () => {
    render(<ArtworkList {...defaultProps} editingArtwork={first} saveEditError />);
    expect(screen.getByText("Failed to update artwork.")).toBeInTheDocument();
  });
});
