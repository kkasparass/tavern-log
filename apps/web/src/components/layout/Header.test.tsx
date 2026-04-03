import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderWithQuery } from "@/test/utils";
import { Header } from "./Header";

vi.mock("next/link");
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";

const mockCookies = vi.mocked(cookies);

describe("Header", () => {
  it("renders home link with correct href", async () => {
    mockCookies.mockResolvedValue({ get: () => undefined } as any);
    renderWithQuery(await Header());
    expect(screen.getByRole("link", { name: "Tavern Log" })).toHaveAttribute("href", "/");
  });

  it("renders admin link with correct href", async () => {
    mockCookies.mockResolvedValue({ get: () => undefined } as any);
    renderWithQuery(await Header());
    expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/admin");
  });

  it("shows logout button when logged in", async () => {
    mockCookies.mockResolvedValue({ get: () => ({ name: "token", value: "abc" }) } as any);
    renderWithQuery(await Header());
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("hides logout button when logged out", async () => {
    mockCookies.mockResolvedValue({ get: () => undefined } as any);
    renderWithQuery(await Header());
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument();
  });
});
