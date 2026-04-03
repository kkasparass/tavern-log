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
