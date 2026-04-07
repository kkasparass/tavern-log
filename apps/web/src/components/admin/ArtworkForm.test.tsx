import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ArtworkForm } from "./ArtworkForm";

vi.mock("./FileUpload", () => ({
  FileUpload: ({ onUpload, label }: { onUpload: (url: string) => void; label?: string }) => (
    <button onClick={() => onUpload("https://img.png")}>{label ?? "Upload file"}</button>
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

  it("disables Save when imageUrl is empty", () => {
    render(<ArtworkForm {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("calls onSubmit with correct data", async () => {
    const onSubmit = vi.fn();
    render(<ArtworkForm {...defaultProps} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Image" }));
    await userEvent.type(screen.getByPlaceholderText("Artwork title"), "My Art");
    await userEvent.type(screen.getByPlaceholderText("Short description"), "A caption");
    await userEvent.type(screen.getByPlaceholderText("Artist name or link"), "Artist");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({
      imageUrl: "https://img.png",
      title: "My Art",
      caption: "A caption",
      artistCredit: "Artist",
    });
  });

  it("omits optional fields from payload when left empty", async () => {
    const onSubmit = vi.fn();
    render(<ArtworkForm {...defaultProps} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Image" }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: undefined, caption: undefined, artistCredit: undefined })
    );
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
