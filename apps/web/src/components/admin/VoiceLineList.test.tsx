import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { VoiceLineList } from "./VoiceLineList";
import { mockCharacter } from "@/test/fixtures";

vi.mock("./FileUpload", () => ({
  FileUpload: ({ onUpload, label }: { onUpload: (url: string) => void; label?: string }) => (
    <button onClick={() => onUpload("https://new-audio.mp3")}>{label ?? "Upload file"}</button>
  ),
}));

const [first, second] = mockCharacter.voiceLines;

const defaultProps = {
  voiceLines: [first, second],
  editingVoiceLine: null,
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

describe("VoiceLineList", () => {
  it("renders transcripts for each voice line", () => {
    render(<VoiceLineList {...defaultProps} />);
    expect(screen.getByText(first.transcript)).toBeInTheDocument();
    expect(screen.getByText(second.transcript)).toBeInTheDocument();
  });

  it("renders an audio element for each voice line with the correct src", () => {
    render(<VoiceLineList {...defaultProps} />);
    const audios = document.querySelectorAll("audio");
    expect(audios).toHaveLength(2);
    expect(audios[0]).toHaveAttribute("src", first.audioUrl);
    expect(audios[1]).toHaveAttribute("src", second.audioUrl);
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

  it("calls onEdit with the voice line when Edit is clicked", async () => {
    const onEdit = vi.fn();
    render(<VoiceLineList {...defaultProps} onEdit={onEdit} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    expect(onEdit).toHaveBeenCalledWith(first);
  });

  it("renders inline form in place of the editing voice line", () => {
    render(<VoiceLineList {...defaultProps} editingVoiceLine={first} />);
    expect(screen.getByPlaceholderText("What is said in this voice line")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("pre-fills the inline form with the editing voice line values", () => {
    render(<VoiceLineList {...defaultProps} editingVoiceLine={first} />);
    expect(screen.getByPlaceholderText("What is said in this voice line")).toHaveValue(first.transcript);
    expect(screen.getByPlaceholderText("e.g. Battle cry, greeting, etc.")).toHaveValue(first.context);
  });

  it("still renders normal view for items not being edited", () => {
    render(<VoiceLineList {...defaultProps} editingVoiceLine={first} />);
    expect(screen.getByText(second.transcript)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(1);
  });

  it("calls onSaveEdit with the voice line id and updated data on Save", async () => {
    const onSaveEdit = vi.fn();
    render(<VoiceLineList {...defaultProps} editingVoiceLine={first} onSaveEdit={onSaveEdit} />);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSaveEdit).toHaveBeenCalledWith(
      first.id,
      expect.objectContaining({ audioUrl: first.audioUrl, transcript: first.transcript })
    );
  });

  it("calls onCancelEdit when Cancel is clicked in the inline form", async () => {
    const onCancelEdit = vi.fn();
    render(<VoiceLineList {...defaultProps} editingVoiceLine={first} onCancelEdit={onCancelEdit} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancelEdit).toHaveBeenCalled();
  });

  it("shows saving state in the inline form when isSavingEdit", () => {
    render(<VoiceLineList {...defaultProps} editingVoiceLine={first} isSavingEdit />);
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("shows error in the inline form when saveEditError", () => {
    render(<VoiceLineList {...defaultProps} editingVoiceLine={first} saveEditError />);
    expect(screen.getByText("Failed to update voice line.")).toBeInTheDocument();
  });
});
