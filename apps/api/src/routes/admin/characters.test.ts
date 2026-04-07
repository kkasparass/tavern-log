import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../../app";
import { miraCharacterListItem } from "../../test/fixtures";

vi.mock("../../lib/prisma", () => ({
  prisma: {
    character: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    characterTag: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  },
}));

vi.mock("../../lib/s3", () => ({
  deleteS3Object: vi.fn(),
}));

import { prisma } from "../../lib/prisma";
import { deleteS3Object } from "../../lib/s3";

beforeEach(() => vi.clearAllMocks());

async function setup() {
  const app = buildApp();
  await app.ready();
  const token = app.jwt.sign({ userId: "user-1", email: "admin@example.com" });
  return { app, authCookie: `token=${token}` };
}

const otherUserCharacter = { ...miraCharacterListItem, createdById: "user-2" };
const characterWithThumbnail = { ...miraCharacterListItem, thumbnailUrl: "https://example.com/old-thumb.jpg" };

describe("GET /admin/characters", () => {
  it("returns 200 with character list and normalised tags", async () => {
    vi.mocked(prisma.character.findMany).mockResolvedValue([miraCharacterListItem]);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "GET",
      url: "/admin/characters",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(1);
    expect(res.json()[0].tags).toEqual(["mage", "D&D 5e", "retired"]);
  });

  it("filters by createdById", async () => {
    vi.mocked(prisma.character.findMany).mockResolvedValue([miraCharacterListItem]);
    const { app, authCookie } = await setup();
    await app.inject({ method: "GET", url: "/admin/characters", headers: { cookie: authCookie } });
    const call = vi.mocked(prisma.character.findMany).mock.calls[0]![0]!;
    expect(call.where).toMatchObject({ createdById: "user-1" });
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({ method: "GET", url: "/admin/characters" });
    expect(res.statusCode).toBe(401);
  });
});

describe("POST /admin/characters", () => {
  it("creates character and returns 201", async () => {
    vi.mocked(prisma.character.create).mockResolvedValue(miraCharacterListItem);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/characters",
      headers: { cookie: authCookie },
      payload: { name: "Mira Ashveil", system: "D&D 5e" },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().name).toBe("Mira Ashveil");
    const call = vi.mocked(prisma.character.create).mock.calls[0]![0]!;
    expect(call.data).toMatchObject({ createdById: "user-1" });
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/characters",
      payload: { name: "Test", system: "D&D 5e" },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /admin/characters/:id", () => {
  it("returns 200 with character and normalised tags", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "GET",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().slug).toBe("mira-ashveil");
    expect(res.json().tags).toEqual(["mage", "D&D 5e", "retired"]);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(null);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "GET",
      url: "/admin/characters/unknown",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 403 when character belongs to another user", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(otherUserCharacter);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "GET",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(403);
  });
});

describe("PUT /admin/characters/:id", () => {
  it("updates character and returns 200", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem);
    vi.mocked(prisma.character.update).mockResolvedValue({
      ...miraCharacterListItem,
      name: "Mira Updated",
    });
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
      payload: { name: "Mira Updated" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().name).toBe("Mira Updated");
  });

  it("replaces tags when tags provided", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem);
    vi.mocked(prisma.characterTag.deleteMany).mockResolvedValue({ count: 3 });
    vi.mocked(prisma.characterTag.createMany).mockResolvedValue({ count: 2 });
    vi.mocked(prisma.character.update).mockResolvedValue(miraCharacterListItem);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
      payload: { tags: ["mage", "retired"] },
    });
    expect(res.statusCode).toBe(200);
    expect(vi.mocked(prisma.characterTag.deleteMany)).toHaveBeenCalledWith({
      where: { characterId: "cuid-mira" },
    });
    expect(vi.mocked(prisma.characterTag.createMany)).toHaveBeenCalled();
  });

  it("returns 404 when character not found", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(null);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/characters/unknown",
      headers: { cookie: authCookie },
      payload: { name: "Updated" },
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 403 when character belongs to another user", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(otherUserCharacter);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
      payload: { name: "Updated" },
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/characters/cuid-mira",
      payload: { name: "Updated" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("deletes old S3 thumbnail when thumbnailUrl changes", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(characterWithThumbnail);
    vi.mocked(prisma.character.update).mockResolvedValue(characterWithThumbnail);
    const { app, authCookie } = await setup();
    await app.inject({
      method: "PUT",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
      payload: { thumbnailUrl: "https://example.com/new-thumb.jpg" },
    });
    expect(vi.mocked(deleteS3Object)).toHaveBeenCalledWith("https://example.com/old-thumb.jpg");
  });

  it("does not call deleteS3Object when thumbnailUrl is unchanged", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(characterWithThumbnail);
    vi.mocked(prisma.character.update).mockResolvedValue(characterWithThumbnail);
    const { app, authCookie } = await setup();
    await app.inject({
      method: "PUT",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
      payload: { thumbnailUrl: "https://example.com/old-thumb.jpg" },
    });
    expect(vi.mocked(deleteS3Object)).not.toHaveBeenCalled();
  });

  it("does not call deleteS3Object when existing thumbnailUrl is null", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem);
    vi.mocked(prisma.character.update).mockResolvedValue(miraCharacterListItem);
    const { app, authCookie } = await setup();
    await app.inject({
      method: "PUT",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
      payload: { thumbnailUrl: "https://example.com/new-thumb.jpg" },
    });
    expect(vi.mocked(deleteS3Object)).not.toHaveBeenCalled();
  });

  it("still returns 200 when S3 delete of old thumbnail fails", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(characterWithThumbnail);
    vi.mocked(prisma.character.update).mockResolvedValue(characterWithThumbnail);
    vi.mocked(deleteS3Object).mockRejectedValue(new Error("S3 error"));
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
      payload: { thumbnailUrl: "https://example.com/new-thumb.jpg" },
    });
    expect(res.statusCode).toBe(200);
    expect(vi.mocked(prisma.character.update)).toHaveBeenCalled();
  });
});

describe("DELETE /admin/characters/:id", () => {
  it("deletes character and returns 204", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem);
    vi.mocked(prisma.character.delete).mockResolvedValue(miraCharacterListItem);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "DELETE",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(204);
  });

  it("returns 404 when character not found", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(null);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "DELETE",
      url: "/admin/characters/unknown",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 403 when character belongs to another user", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(otherUserCharacter);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "DELETE",
      url: "/admin/characters/cuid-mira",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({ method: "DELETE", url: "/admin/characters/cuid-mira" });
    expect(res.statusCode).toBe(401);
  });
});
