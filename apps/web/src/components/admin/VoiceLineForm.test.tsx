import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { VoiceLineForm } from "./VoiceLineForm";

vi.mock("@/lib/upload", () => ({
  uploadFile: vi.fn().mockResolvedValue("https://audio.mp3"),
}));

vi.mock("./FileUpload", () => ({
  FileUpload: ({ onFileSelect, label }: { onFileSelect: (file: File | null) => void; label?: string }) => (
    <button onClick={() => onFileSelect(new File(["content"], "audio.mp3", { type: "audio/mpeg" }))}>
      {label ?? "Upload file"}
    </button>
  ),
}));

const defaultProps = {
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
  isPending: false,
  isError: false,
};

describe("VoiceLineForm", () => {
  it("renders Audio, Transcript, and Context fields", () => {
    render(<VoiceLineForm {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Audio" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What is said in this voice line")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Battle cry, greeting, etc.")).toBeInTheDocument();
  });

  it("disables Save when required fields are empty", () => {
    render(<VoiceLineForm {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("calls uploadFile and onSubmit with the resolved URL on save", async () => {
    const onSubmit = vi.fn();
    const { uploadFile } = await import("@/lib/upload");
    render(<VoiceLineForm {...defaultProps} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Audio" }));
    await userEvent.type(screen.getByPlaceholderText("What is said in this voice line"), "Hello world");
    await userEvent.type(screen.getByPlaceholderText("e.g. Battle cry, greeting, etc."), "Greeting");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        audioUrl: "https://audio.mp3",
        transcript: "Hello world",
        context: "Greeting",
      })
    );
    expect(uploadFile).toHaveBeenCalledOnce();
  });

  it("omits context from payload when left empty", async () => {
    const onSubmit = vi.fn();
    render(<VoiceLineForm {...defaultProps} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Audio" }));
    await userEvent.type(screen.getByPlaceholderText("What is said in this voice line"), "Hello world");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ context: undefined }))
    );
  });

  it("uses existing audioUrl in edit mode without uploading when no new file is selected", async () => {
    const onSubmit = vi.fn();
    const { uploadFile } = await import("@/lib/upload");
    vi.mocked(uploadFile).mockClear();
    render(
      <VoiceLineForm
        {...defaultProps}
        onSubmit={onSubmit}
        initialValues={{ audioUrl: "https://existing.mp3", transcript: "Old line" }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ audioUrl: "https://existing.mp3" })
      )
    );
    expect(uploadFile).not.toHaveBeenCalled();
  });

  it("shows upload error when upload fails on save", async () => {
    const { uploadFile } = await import("@/lib/upload");
    vi.mocked(uploadFile).mockRejectedValueOnce(new Error("Network error"));
    render(<VoiceLineForm {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Audio" }));
    await userEvent.type(screen.getByPlaceholderText("What is said in this voice line"), "Hello");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByText("Network error")).toBeInTheDocument());
  });

  it("shows Saving… and disables Save when isPending", () => {
    render(<VoiceLineForm {...defaultProps} isPending />);
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const onCancel = vi.fn();
    render(<VoiceLineForm {...defaultProps} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("shows error message when isError is true", () => {
    render(<VoiceLineForm {...defaultProps} isError />);
    expect(screen.getByText("Failed to create voice line.")).toBeInTheDocument();
  });

  it("pre-populates fields from initialValues", () => {
    render(
      <VoiceLineForm
        {...defaultProps}
        initialValues={{ audioUrl: "https://audio.mp3", transcript: "Old line", context: "Old context" }}
      />
    );
    expect(screen.getByPlaceholderText("What is said in this voice line")).toHaveValue("Old line");
    expect(screen.getByPlaceholderText("e.g. Battle cry, greeting, etc.")).toHaveValue("Old context");
  });

  it("shows 'Failed to update voice line.' error message when editing", () => {
    render(
      <VoiceLineForm
        {...defaultProps}
        initialValues={{ audioUrl: "https://audio.mp3", transcript: "line" }}
        isError
      />
    );
    expect(screen.getByText("Failed to update voice line.")).toBeInTheDocument();
  });
});
