import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ArtworkForm } from "./ArtworkForm";

vi.mock("@/lib/upload", () => ({
  uploadFile: vi.fn().mockResolvedValue("https://img.png"),
}));

vi.mock("./FileUpload", () => ({
  FileUpload: ({ onFileSelect, label }: { onFileSelect: (file: File | null) => void; label?: string }) => (
    <button onClick={() => onFileSelect(new File(["content"], "img.png", { type: "image/jpeg" }))}>
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

describe("ArtworkForm", () => {
  it("renders Image, Title, Caption, and Artist Credit fields", () => {
    render(<ArtworkForm {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Image" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Artwork title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Short description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Artist name or link")).toBeInTheDocument();
  });

  it("disables Save when no image is selected or provided", () => {
    render(<ArtworkForm {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("enables Save after a file is selected", async () => {
    render(<ArtworkForm {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Image" }));
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("calls uploadFile and onSubmit with the resolved URL on save", async () => {
    const onSubmit = vi.fn();
    const { uploadFile } = await import("@/lib/upload");
    render(<ArtworkForm {...defaultProps} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Image" }));
    await userEvent.type(screen.getByPlaceholderText("Artwork title"), "My Art");
    await userEvent.type(screen.getByPlaceholderText("Short description"), "A caption");
    await userEvent.type(screen.getByPlaceholderText("Artist name or link"), "Artist");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        imageUrl: "https://img.png",
        title: "My Art",
        caption: "A caption",
        artistCredit: "Artist",
      })
    );
    expect(uploadFile).toHaveBeenCalledOnce();
  });

  it("omits optional fields from payload when left empty", async () => {
    const onSubmit = vi.fn();
    render(<ArtworkForm {...defaultProps} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Image" }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: undefined, caption: undefined, artistCredit: undefined })
      )
    );
  });

  it("uses existing imageUrl in edit mode without uploading when no new file is selected", async () => {
    const onSubmit = vi.fn();
    const { uploadFile } = await import("@/lib/upload");
    vi.mocked(uploadFile).mockClear();
    render(
      <ArtworkForm
        {...defaultProps}
        onSubmit={onSubmit}
        initialValues={{ imageUrl: "https://existing.jpg" }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ imageUrl: "https://existing.jpg" })
      )
    );
    expect(uploadFile).not.toHaveBeenCalled();
  });

  it("shows upload error when upload fails on save", async () => {
    const { uploadFile } = await import("@/lib/upload");
    vi.mocked(uploadFile).mockRejectedValueOnce(new Error("Network error"));
    render(<ArtworkForm {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Image" }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByText("Network error")).toBeInTheDocument());
  });

  it("shows Saving… and disables Save when isPending", () => {
    render(<ArtworkForm {...defaultProps} isPending />);
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const onCancel = vi.fn();
    render(<ArtworkForm {...defaultProps} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("shows error message when isError is true", () => {
    render(<ArtworkForm {...defaultProps} isError />);
    expect(screen.getByText("Failed to create artwork.")).toBeInTheDocument();
  });

  it("pre-populates fields from initialValues", () => {
    render(
      <ArtworkForm
        {...defaultProps}
        initialValues={{ imageUrl: "https://img.png", title: "Old Title", caption: "Old caption", artistCredit: "Old Artist" }}
      />
    );
    expect(screen.getByPlaceholderText("Artwork title")).toHaveValue("Old Title");
    expect(screen.getByPlaceholderText("Short description")).toHaveValue("Old caption");
    expect(screen.getByPlaceholderText("Artist name or link")).toHaveValue("Old Artist");
  });

  it("shows 'Failed to update artwork.' error message when editing", () => {
    render(
      <ArtworkForm
        {...defaultProps}
        initialValues={{ imageUrl: "https://img.png" }}
        isError
      />
    );
    expect(screen.getByText("Failed to update artwork.")).toBeInTheDocument();
  });
});
