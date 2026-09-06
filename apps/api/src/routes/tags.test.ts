import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../app";

vi.mock("../lib/prisma", () => ({
  prisma: {
    characterTag: { groupBy: vi.fn() },
  },
}));

import { prisma } from "../lib/prisma";

describe("GET /tags", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns tags with counts", async () => {
    vi.mocked(prisma.characterTag.groupBy).mockResolvedValue([
      { tag: "goblin", _count: { tag: 3 } },
      { tag: "mage", _count: { tag: 1 } },
    ] as never);
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/tags" });
    expect(res.statusCode).toBe(200);
    expect(res.json().tags).toEqual([
      { tag: "goblin", count: 3 },
      { tag: "mage", count: 1 },
    ]);
  });

  it("scopes suggestions to public characters", async () => {
    vi.mocked(prisma.characterTag.groupBy).mockResolvedValue([]);
    const app = buildApp();
    await app.inject({ method: "GET", url: "/tags" });
    const call = vi.mocked(prisma.characterTag.groupBy).mock.calls[0]![0]!;
    expect(call.where).toMatchObject({ character: { isPublic: true } });
  });

  it("passes a case-insensitive prefix filter", async () => {
    vi.mocked(prisma.characterTag.groupBy).mockResolvedValue([]);
    const app = buildApp();
    await app.inject({ method: "GET", url: "/tags?q=go" });
    const call = vi.mocked(prisma.characterTag.groupBy).mock.calls[0]![0]!;
    expect(call.where).toMatchObject({ tag: { startsWith: "go", mode: "insensitive" } });
  });

  it("orders by usage count desc with alphabetical tiebreak and caps at 10", async () => {
    vi.mocked(prisma.characterTag.groupBy).mockResolvedValue([]);
    const app = buildApp();
    await app.inject({ method: "GET", url: "/tags?q=go" });
    const call = vi.mocked(prisma.characterTag.groupBy).mock.calls[0]![0]!;
    expect(call.orderBy).toEqual([{ _count: { tag: "desc" } }, { tag: "asc" }]);
    expect(call.take).toBe(10);
  });

  it("returns empty list when no tags match", async () => {
    vi.mocked(prisma.characterTag.groupBy).mockResolvedValue([]);
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/tags?q=zzz" });
    expect(res.statusCode).toBe(200);
    expect(res.json().tags).toEqual([]);
  });
});
