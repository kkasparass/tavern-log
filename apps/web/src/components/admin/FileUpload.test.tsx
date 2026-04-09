import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "./FileUpload";

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("FileUpload", () => {
  it("renders file input with correct accept attribute", () => {
    render(<FileUpload accept="image/jpeg,image/png" onUpload={vi.fn()} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();
    expect(fileInput.accept).toBe("image/jpeg,image/png");
  });

  it("calls onUpload with objectUrl after successful upload flow", async () => {
    const onUpload = vi.fn();
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          uploadUrl: "https://s3.amazonaws.com/presigned-put-url",
          objectUrl: "https://tavernlog-upload.s3.eu-south-2.amazonaws.com/uploads/test.jpg",
        }),
      })
      .mockResolvedValueOnce({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    render(<FileUpload accept="image/jpeg" onUpload={onUpload} label="Upload Image" />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["content"], "portrait.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(onUpload).toHaveBeenCalledWith(
        "https://tavernlog-upload.s3.eu-south-2.amazonaws.com/uploads/test.jpg"
      );
    });
    expect(screen.getByText("Uploaded ✓")).toBeInTheDocument();
  });

  it("shows displayValue as the filename when provided", () => {
    render(
      <FileUpload accept="image/jpeg" onUpload={vi.fn()} displayValue="portrait.jpg" />
    );
    expect(screen.getByText("portrait.jpg")).toBeInTheDocument();
  });

  it("shows 'No file chosen' when displayValue is omitted", () => {
    render(<FileUpload accept="image/jpeg" onUpload={vi.fn()} />);
    expect(screen.getByText("No file chosen")).toBeInTheDocument();
  });

  it("shows selected file name after picking a file, replacing displayValue", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          uploadUrl: "https://s3.amazonaws.com/presigned-put-url",
          objectUrl: "https://tavernlog-upload.s3.eu-south-2.amazonaws.com/uploads/new.jpg",
        }),
      })
      .mockResolvedValueOnce({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    render(
      <FileUpload accept="image/jpeg" onUpload={vi.fn()} displayValue="old.jpg" />
    );
    expect(screen.getByText("old.jpg")).toBeInTheDocument();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, new File(["content"], "new.jpg", { type: "image/jpeg" }));

    await waitFor(() => {
      expect(screen.getByText("new.jpg")).toBeInTheDocument();
    });
  });

  it("renders a preview image when previewUrl is provided for an image accept", () => {
    render(
      <FileUpload
        accept="image/jpeg"
        onUpload={vi.fn()}
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
        onUpload={vi.fn()}
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
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));

    render(<FileUpload accept="image/jpeg" onUpload={vi.fn()} />);
    expect(document.querySelector("img")).not.toBeInTheDocument();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, new File(["content"], "new.jpg", { type: "image/jpeg" }));

    await waitFor(() => {
      expect(document.querySelector("img")).toHaveAttribute("src", "blob:local-preview");
    });
  });

  it("opens the Lightbox when the preview image is clicked", async () => {
    render(
      <FileUpload
        accept="image/jpeg"
        onUpload={vi.fn()}
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

  it("shows error message when presign request fails", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Unsupported file type" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<FileUpload accept="image/jpeg" onUpload={vi.fn()} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    // Use a matching MIME type — accept attribute validation is client-side; the server rejects it
    const file = new File(["content"], "portrait.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText("Unsupported file type")).toBeInTheDocument();
    });
  });
});
