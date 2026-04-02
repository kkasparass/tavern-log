import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../../app";
import { miraStory, miraCharacterListItem } from "../../test/fixtures";

vi.mock("../../lib/prisma", () => ({
  prisma: {
    character: { findUnique: vi.fn() },
    story: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "../../lib/prisma";

const otherUserCharacter = { ...miraCharacterListItem, createdById: "user-2" };
const storyWithCharacter = { ...miraStory, character: { createdById: "user-1" } };
const storyWithOtherCharacter = { ...miraStory, character: { createdById: "user-2" } };

beforeEach(() => vi.clearAllMocks());

async function setup() {
  const app = buildApp();
  await app.ready();
  const token = app.jwt.sign({ userId: "user-1", email: "admin@example.com" });
  return { app, authCookie: `token=${token}` };
}

describe("GET /admin/characters/:id/stories", () => {
  it("returns 200 with story list", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem);
    vi.mocked(prisma.story.findMany).mockResolvedValue([miraStory]);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "GET",
      url: "/admin/characters/cuid-mira/stories",
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
      url: "/admin/characters/cuid-mira/stories",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: "GET",
      url: "/admin/characters/cuid-mira/stories",
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("POST /admin/characters/:id/stories", () => {
  it("creates story with isDraft true and returns 201", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(miraCharacterListItem);
    vi.mocked(prisma.story.create).mockResolvedValue(miraStory);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/characters/cuid-mira/stories",
      headers: { cookie: authCookie },
      payload: { title: "The Last Spell" },
    });
    expect(res.statusCode).toBe(201);
    const call = vi.mocked(prisma.story.create).mock.calls[0]![0]!;
    expect(call.data.isDraft).toBe(true);
    expect(call.data.characterId).toBe("cuid-mira");
  });

  it("returns 403 when character belongs to another user", async () => {
    vi.mocked(prisma.character.findUnique).mockResolvedValue(otherUserCharacter);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/characters/cuid-mira/stories",
      headers: { cookie: authCookie },
      payload: { title: "Test" },
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: "POST",
      url: "/admin/characters/cuid-mira/stories",
      payload: { title: "Test" },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("PUT /admin/stories/:storyId", () => {
  it("updates story and returns 200", async () => {
    vi.mocked(prisma.story.findUnique).mockResolvedValue(storyWithCharacter);
    vi.mocked(prisma.story.update).mockResolvedValue({ ...miraStory, title: "Updated" });
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/stories/cuid-story-1",
      headers: { cookie: authCookie },
      payload: { title: "Updated" },
    });
    expect(res.statusCode).toBe(200);
  });

  it("sets publishedAt when publishing a draft", async () => {
    const draftStory = { ...storyWithCharacter, isDraft: true, publishedAt: null };
    vi.mocked(prisma.story.findUnique).mockResolvedValue(draftStory);
    vi.mocked(prisma.story.update).mockResolvedValue({ ...draftStory, isDraft: false });
    const { app, authCookie } = await setup();
    await app.inject({
      method: "PUT",
      url: "/admin/stories/cuid-story-1",
      headers: { cookie: authCookie },
      payload: { isDraft: false },
    });
    const call = vi.mocked(prisma.story.update).mock.calls[0]![0]!;
    expect(call.data.isDraft).toBe(false);
    expect(call.data.publishedAt).toBeInstanceOf(Date);
  });

  it("clears publishedAt when unpublishing", async () => {
    vi.mocked(prisma.story.findUnique).mockResolvedValue(storyWithCharacter);
    vi.mocked(prisma.story.update).mockResolvedValue({
      ...miraStory,
      isDraft: true,
      publishedAt: null,
    });
    const { app, authCookie } = await setup();
    await app.inject({
      method: "PUT",
      url: "/admin/stories/cuid-story-1",
      headers: { cookie: authCookie },
      payload: { isDraft: true },
    });
    const call = vi.mocked(prisma.story.update).mock.calls[0]![0]!;
    expect(call.data.isDraft).toBe(true);
    expect(call.data.publishedAt).toBeNull();
  });

  it("returns 404 when not found", async () => {
    vi.mocked(prisma.story.findUnique).mockResolvedValue(null);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/stories/unknown",
      headers: { cookie: authCookie },
      payload: { title: "Updated" },
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 403 when story belongs to another user", async () => {
    vi.mocked(prisma.story.findUnique).mockResolvedValue(storyWithOtherCharacter);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/stories/cuid-story-1",
      headers: { cookie: authCookie },
      payload: { title: "Updated" },
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: "PUT",
      url: "/admin/stories/cuid-story-1",
      payload: { title: "Updated" },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("DELETE /admin/stories/:storyId", () => {
  it("deletes story and returns 204", async () => {
    vi.mocked(prisma.story.findUnique).mockResolvedValue(storyWithCharacter);
    vi.mocked(prisma.story.delete).mockResolvedValue(miraStory);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "DELETE",
      url: "/admin/stories/cuid-story-1",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(204);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(prisma.story.findUnique).mockResolvedValue(null);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "DELETE",
      url: "/admin/stories/unknown",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 403 when story belongs to another user", async () => {
    vi.mocked(prisma.story.findUnique).mockResolvedValue(storyWithOtherCharacter);
    const { app, authCookie } = await setup();
    const res = await app.inject({
      method: "DELETE",
      url: "/admin/stories/cuid-story-1",
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const { app } = await setup();
    const res = await app.inject({ method: "DELETE", url: "/admin/stories/cuid-story-1" });
    expect(res.statusCode).toBe(401);
  });
});
