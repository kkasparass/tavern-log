import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "./FileUpload";

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("FileUpload", () => {
  it("renders file input with correct accept attribute", () => {
    render(<FileUpload accept="image/jpeg,image/png" onFileSelect={vi.fn()} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();
    expect(fileInput.accept).toBe("image/jpeg,image/png");
  });

  it("calls onFileSelect with the picked File", async () => {
    const onFileSelect = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL: vi.fn(() => "blob:x"), revokeObjectURL: vi.fn() });

    render(<FileUpload accept="image/jpeg" onFileSelect={onFileSelect} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["content"], "portrait.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, file);

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it("shows displayValue as the filename when provided", () => {
    render(<FileUpload accept="image/jpeg" onFileSelect={vi.fn()} displayValue="portrait.jpg" />);
    expect(screen.getByText("portrait.jpg")).toBeInTheDocument();
  });

  it("shows 'No file chosen' when displayValue is omitted", () => {
    render(<FileUpload accept="image/jpeg" onFileSelect={vi.fn()} />);
    expect(screen.getByText("No file chosen")).toBeInTheDocument();
  });

  it("shows selected file name after picking a file, replacing displayValue", async () => {
    vi.stubGlobal("URL", { ...URL, createObjectURL: vi.fn(() => "blob:x"), revokeObjectURL: vi.fn() });

    render(<FileUpload accept="image/jpeg" onFileSelect={vi.fn()} displayValue="old.jpg" />);
    expect(screen.getByText("old.jpg")).toBeInTheDocument();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, new File(["content"], "new.jpg", { type: "image/jpeg" }));

    expect(screen.getByText("new.jpg")).toBeInTheDocument();
  });

  it("renders a preview image when previewUrl is provided for an image accept", () => {
    render(
      <FileUpload
        accept="image/jpeg"
        onFileSelect={vi.fn()}
        previewUrl="https://example.com/existing.jpg"
      />
    );
    const preview = document.querySelector("img");
    expect(preview).toHaveAttribute("src", "https://example.com/existing.jpg");
  });

  it("does not render a preview image when accept is audio-only", () => {
    render(
      <FileUpload
        accept="audio/mpeg"
        onFileSelect={vi.fn()}
        previewUrl="https://example.com/existing.jpg"
      />
    );
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  it("renders a local blob preview after picking a file", async () => {
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:local-preview"),
      revokeObjectURL: vi.fn(),
    });

    render(<FileUpload accept="image/jpeg" onFileSelect={vi.fn()} />);
    expect(document.querySelector("img")).not.toBeInTheDocument();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, new File(["content"], "new.jpg", { type: "image/jpeg" }));

    expect(document.querySelector("img")).toHaveAttribute("src", "blob:local-preview");
  });

  it("opens the Lightbox when the preview image is clicked", async () => {
    render(
      <FileUpload
        accept="image/jpeg"
        onFileSelect={vi.fn()}
        previewUrl="https://example.com/existing.jpg"
      />
    );
    expect(document.querySelector(".fixed img")).not.toBeInTheDocument();
    await userEvent.click(document.querySelector("img")!);
    expect(document.querySelector(".fixed img")).toHaveAttribute(
      "src",
      "https://example.com/existing.jpg"
    );
  });
});
