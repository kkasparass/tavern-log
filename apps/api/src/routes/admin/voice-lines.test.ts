import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../../app";
import { miraCharacterDetail, miraCharacterListItem } from "../../test/fixtures";

vi.mock("../../lib/prisma", () => ({
  prisma: {
    character: { findUnique: vi.fn() },
    voiceLine: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("../../lib/s3", () => ({
  deleteS3Object: vi.fn(),
}));

import { prisma } from "../../lib/prisma";
import { deleteS3Object } from "../../lib/s3";

const mockVoiceLine = miraCharacterDetail.voiceLines[0]!;
const otherUserCharacter = { ...miraCharacterListItem, createdById: "user-2" };
const voiceLineWithCharacter = { ...mockVoiceLine, character: { createdById: "user-1" } };
const voiceLineWithOtherCharacter = { ...mockVoiceLine, character: { createdById: "user-2" } };

beforeEach(() => vi.clearAllMocks());

async function setup() {
  const app = buildApp();
  await app.ready();
  const token = app.jwt.sign({ userId: "user-1", email: "admin@example.com" });
  return { app, authCookie: `token=${token}` };
}

describe("GET /admin/characters/:id/voice-lines", () => {
  it("returns 200 with voice line list", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem);
    vi.mocked(prisma.voiceLine.findMany).mockResolvedValue([mockVoiceLine]);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "GET",
      url: "/admin/characters/cuid-mira/voice-lines",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(1);
  });

  it("returns 403 when character belongs to another user", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(otherUserCharacter);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "GET",
      url: "/admin/characters/cuid-mira/voice-lines",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: "GET",
      url: "/admin/characters/cuid-mira/voice-lines",
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("POST /admin/characters/:id/voice-lines", () => {
  it("creates voice line and returns 201", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem);
    vi.mocked(prisma.voiceLine.create).mockResolvedValue(mockVoiceLine);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/characters/cuid-mira/voice-lines",
      headers: { cookie: authCookie },
      payload: { audioUrl: "https://example.com/audio/test.mp3", transcript: "I don't do quests." },
    });
    expect(res.statusCode).toBe(201);
    const call = vi.mocked(prisma.voiceLine.create).mock.calls[0]![0]!;
    expect(call.data.characterId).toBe("cuid-mira");
  });

  it("returns 403 when character belongs to another user", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(otherUserCharacter);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/characters/cuid-mira/voice-lines",
      headers: { cookie: authCookie },
      payload: { audioUrl: "https://example.com/test.mp3", transcript: "Test" },
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/characters/cuid-mira/voice-lines",
      payload: { audioUrl: "https://example.com/test.mp3", transcript: "Test" },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("PUT /admin/voice-lines/:voiceLineId", () => {
  it("updates voice line and returns 200", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(voiceLineWithCharacter);
    vi.mocked(prisma.voiceLine.update).mockResolvedValue({ ...mockVoiceLine, order: 1 });
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/voice-lines/cuid-vl-1",
      headers: { cookie: authCookie },
      payload: { order: 1 },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().order).toBe(1);
  });

  it("deletes old S3 audio when audioUrl changes", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(voiceLineWithCharacter);
    vi.mocked(prisma.voiceLine.update).mockResolvedValue(mockVoiceLine);
    const { app, authCookie } = await setup();
    await app.inject({
      method: "PUT",
      url: "/admin/voice-lines/cuid-vl-1",
      headers: { cookie: authCookie },
      payload: { audioUrl: "https://example.com/new-audio.mp3" },
    });
    expect(vi.mocked(deleteS3Object)).toHaveBeenCalledWith(voiceLineWithCharacter.audioUrl);
  });

  it("does not call deleteS3Object when audioUrl is unchanged", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(voiceLineWithCharacter);
    vi.mocked(prisma.voiceLine.update).mockResolvedValue(mockVoiceLine);
    const { app, authCookie } = await setup();
    await app.inject({
      method: "PUT",
      url: "/admin/voice-lines/cuid-vl-1",
      headers: { cookie: authCookie },
      payload: { audioUrl: voiceLineWithCharacter.audioUrl },
    });
    expect(vi.mocked(deleteS3Object)).not.toHaveBeenCalled();
  });

  it("still returns 200 when S3 delete of old audio fails", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(voiceLineWithCharacter);
    vi.mocked(prisma.voiceLine.update).mockResolvedValue(mockVoiceLine);
    vi.mocked(deleteS3Object).mockRejectedValue(new Error("S3 error"));
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/voice-lines/cuid-vl-1",
      headers: { cookie: authCookie },
      payload: { audioUrl: "https://example.com/new-audio.mp3" },
    });
    expect(res.statusCode).toBe(200);
    expect(vi.mocked(prisma.voiceLine.update)).toHaveBeenCalled();
  });

  it("returns 404 when not found", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(null);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/voice-lines/unknown",
      headers: { cookie: authCookie },
      payload: { order: 1 },
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 403 when voice line belongs to another user", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(voiceLineWithOtherCharacter);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/voice-lines/cuid-vl-1",
      headers: { cookie: authCookie },
      payload: { order: 1 },
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/voice-lines/cuid-vl-1",
      payload: { order: 1 },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("DELETE /admin/voice-lines/:voiceLineId", () => {
  it("deletes voice line and returns 204", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(voiceLineWithCharacter);
    vi.mocked(prisma.voiceLine.delete).mockResolvedValue(mockVoiceLine);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "DELETE",
      url: "/admin/voice-lines/cuid-vl-1",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(204);
  });

  it("calls deleteS3Object with the voice line audioUrl", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(voiceLineWithCharacter);
    vi.mocked(prisma.voiceLine.delete).mockResolvedValue(mockVoiceLine);
    const { app, authCookie } = await setup();
    await app.inject({
      method: "DELETE",
      url: "/admin/voice-lines/cuid-vl-1",
      headers: { cookie: authCookie },
    });
    expect(vi.mocked(deleteS3Object)).toHaveBeenCalledWith(voiceLineWithCharacter.audioUrl);
  });

  it("still returns 204 and deletes from DB when S3 delete fails", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(voiceLineWithCharacter);
    vi.mocked(prisma.voiceLine.delete).mockResolvedValue(mockVoiceLine);
    vi.mocked(deleteS3Object).mockRejectedValue(new Error("S3 error"));
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "DELETE",
      url: "/admin/voice-lines/cuid-vl-1",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(204);
    expect(vi.mocked(prisma.voiceLine.delete)).toHaveBeenCalled();
  });

  it("returns 404 when not found", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(null);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "DELETE",
      url: "/admin/voice-lines/unknown",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 403 when voice line belongs to another user", async () => {
    vi.mocked(prisma.voiceLine.findUnique).mockResolvedValue(voiceLineWithOtherCharacter);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "DELETE",
      url: "/admin/voice-lines/cuid-vl-1",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({ method: "DELETE", url: "/admin/voice-lines/cuid-vl-1" });
    expect(res.statusCode).toBe(401);
  });
});
