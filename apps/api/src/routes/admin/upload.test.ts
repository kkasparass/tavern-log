import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../../app";

vi.mock("../../lib/s3", () => ({
  presignPutUrl: vi.fn(),
}));

import { presignPutUrl } from "../../lib/s3";

const mockPresignResult = {
  uploadUrl: "https://s3.amazonaws.com/tavernlog-upload/uploads/test-uuid.jpg?signature=abc",
  objectUrl: "https://tavernlog-upload.s3.eu-south-2.amazonaws.com/uploads/test-uuid.jpg",
};

beforeEach(() => vi.clearAllMocks());

async function setup() {
  const app = buildApp();
  await app.ready();
  const token = app.jwt.sign({ userId: "user-1", email: "admin@example.com" });
  return { app, authCookie: `token=${token}` };
}

describe("POST /admin/upload/presign", () => {
  it("returns presigned URL for a valid image type", async () => {
    vi.mocked(presignPutUrl).mockResolvedValue(mockPresignResult);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/upload/presign",
      headers: { cookie: authCookie },
      payload: { filename: "portrait.jpg", contentType: "image/jpeg" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      uploadUrl: mockPresignResult.uploadUrl,
      objectUrl: mockPresignResult.objectUrl,
    });
  });

  it("returns presigned URL for a valid audio type", async () => {
    vi.mocked(presignPutUrl).mockResolvedValue({
      uploadUrl: "https://s3.amazonaws.com/tavernlog-upload/uploads/test-uuid.mp3?signature=abc",
      objectUrl: "https://tavernlog-upload.s3.eu-south-2.amazonaws.com/uploads/test-uuid.mp3",
    });
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/upload/presign",
      headers: { cookie: authCookie },
      payload: { filename: "voice.mp3", contentType: "audio/mpeg" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty("uploadUrl");
    expect(res.json()).toHaveProperty("objectUrl");
  });

  it("returns 400 for a disallowed MIME type", async () => {
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/upload/presign",
      headers: { cookie: authCookie },
      payload: { filename: "script.exe", contentType: "application/octet-stream" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ error: "Unsupported file type" });
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/upload/presign",
      payload: { filename: "portrait.jpg", contentType: "image/jpeg" },
    });
    expect(res.statusCode).toBe(401);
  });
});
