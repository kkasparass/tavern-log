import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { renderWithQuery } from "@/test/utils";
import { Header } from "./Header";

vi.mock("next/link");
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";

const mockCookies = vi.mocked(cookies);

function makeCookieStore(token?: string): ReadonlyRequestCookies {
  return {
    get: (name: string) =>
      name === "token" && token ? { name: "token", value: token } : undefined,
  } as unknown as ReadonlyRequestCookies;
}

describe("Header", () => {
  it("renders home link with correct href", async () => {
    mockCookies.mockResolvedValue(makeCookieStore());
    renderWithQuery(await Header());
    expect(screen.getByRole("link", { name: "Tavern Log" })).toHaveAttribute("href", "/");
  });

  it("renders admin link with correct href", async () => {
    mockCookies.mockResolvedValue(makeCookieStore());
    renderWithQuery(await Header());
    expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/admin");
  });

  it("shows logout button when logged in", async () => {
    mockCookies.mockResolvedValue(makeCookieStore("abc"));
    renderWithQuery(await Header());
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("hides logout button when logged out", async () => {
    mockCookies.mockResolvedValue(makeCookieStore());
    renderWithQuery(await Header());
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument();
  });
});
