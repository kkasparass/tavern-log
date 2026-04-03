import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../app";

vi.mock("../lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn(), create: vi.fn() },
  },
}));

vi.mock("bcryptjs");

import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

const mockUser = {
  id: "user-1",
  email: "admin@example.com",
  passwordHash: "$2a$10$hashedpassword",
  createdAt: new Date(),
};

beforeEach(() => vi.clearAllMocks());

describe("POST /auth/login", () => {
  it("returns 200 and sets token cookie on valid credentials", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "admin@example.com", password: "correct-password" },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toMatch(/token=/);
  });

  it("returns 401 when password is wrong", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "admin@example.com", password: "wrong-password" },
    });

    expect(res.statusCode).toBe(401);
  });

  it("returns 401 when email is not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "unknown@example.com", password: "any-password" },
    });

    expect(res.statusCode).toBe(401);
  });
});

describe("POST /auth/register", () => {
  it("returns 201 and sets token cookie on successful registration", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.hash).mockResolvedValue("$2a$10$hashedpassword" as never);

    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: { email: "new@example.com", password: "password123" },
    });

    expect(res.statusCode).toBe(201);
    expect(res.headers["set-cookie"]).toMatch(/token=/);
  });

  it("returns 409 when email is already registered", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: { email: "admin@example.com", password: "password123" },
    });

    expect(res.statusCode).toBe(409);
  });

  it("returns 400 when email is missing", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: { password: "password123" },
    });

    expect(res.statusCode).toBe(400);
  });

  it("returns 400 when password is too short", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: { email: "new@example.com", password: "short" },
    });

    expect(res.statusCode).toBe(400);
  });
});

describe("POST /auth/logout", () => {
  it("returns 200 and clears the token cookie", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/logout",
    });

    expect(res.statusCode).toBe(200);
    const setCookie = res.headers["set-cookie"] as string;
    expect(setCookie).toMatch(/token=;|Max-Age=0/);
  });
});
