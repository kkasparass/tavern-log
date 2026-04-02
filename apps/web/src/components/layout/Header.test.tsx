import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "./Header";

vi.mock("next/link");

describe("Header", () => {
  it("renders home link with correct href", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Tavern Log" })).toHaveAttribute("href", "/");
  });

  it("renders admin link with correct href", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/admin");
  });
});
