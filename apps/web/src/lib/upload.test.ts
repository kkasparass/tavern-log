import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadFile } from "./upload";

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("uploadFile", () => {
  it("returns objectUrl after successful presign and upload", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          uploadUrl: "https://s3.amazonaws.com/presigned",
          objectUrl: "https://bucket.s3.amazonaws.com/file.jpg",
        }),
      })
      .mockResolvedValueOnce({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    const file = new File(["content"], "portrait.jpg", { type: "image/jpeg" });
    const result = await uploadFile(file);
    expect(result).toBe("https://bucket.s3.amazonaws.com/file.jpg");
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "/api/admin/upload/presign",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("throws with server error message when presign request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Unsupported file type" }),
      })
    );

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    await expect(uploadFile(file)).rejects.toThrow("Unsupported file type");
  });

  it("throws fallback message when presign request fails with no error field", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })
    );

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    await expect(uploadFile(file)).rejects.toThrow("Failed to get upload URL");
  });

  it("throws when PUT to storage fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            uploadUrl: "https://s3.amazonaws.com/presigned",
            objectUrl: "https://bucket.s3.amazonaws.com/file.jpg",
          }),
        })
        .mockResolvedValueOnce({ ok: false })
    );

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    await expect(uploadFile(file)).rejects.toThrow("Upload to storage failed");
  });
});
