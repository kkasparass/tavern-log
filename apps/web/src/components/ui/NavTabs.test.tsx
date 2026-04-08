import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NavTabs, type NavTab } from "./NavTabs";

vi.mock("next/link");

const mockUsePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

const tabs: NavTab[] = [
  { label: "Alpha", href: "/section/alpha" },
  { label: "Beta", href: "/section/beta" },
  { label: "Gamma", href: "/section/gamma" },
];

const activeClassName = "border-b-2 border-white text-white";
const inactiveClassName = "text-white/50 hover:text-white/80";

describe("NavTabs", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders all tabs with correct hrefs", () => {
    mockUsePathname.mockReturnValue("/section/alpha");
    render(
      <NavTabs
        tabs={tabs}
        activeClassName={activeClassName}
        inactiveClassName={inactiveClassName}
      />
    );

    expect(screen.getByRole("link", { name: "Alpha" })).toHaveAttribute("href", "/section/alpha");
    expect(screen.getByRole("link", { name: "Beta" })).toHaveAttribute("href", "/section/beta");
    expect(screen.getByRole("link", { name: "Gamma" })).toHaveAttribute("href", "/section/gamma");
  });

  it("applies activeClassName to the matching tab", () => {
    mockUsePathname.mockReturnValue("/section/beta");
    render(
      <NavTabs
        tabs={tabs}
        activeClassName={activeClassName}
        inactiveClassName={inactiveClassName}
      />
    );

    expect(screen.getByRole("link", { name: "Beta" }).className).toContain("border-b-2");
  });

  it("applies inactiveClassName to non-matching tabs", () => {
    mockUsePathname.mockReturnValue("/section/beta");
    render(
      <NavTabs
        tabs={tabs}
        activeClassName={activeClassName}
        inactiveClassName={inactiveClassName}
      />
    );

    expect(screen.getByRole("link", { name: "Alpha" }).className).not.toContain("border-b-2");
    expect(screen.getByRole("link", { name: "Gamma" }).className).not.toContain("border-b-2");
  });

  it("marks no tab active when pathname does not match any tab", () => {
    mockUsePathname.mockReturnValue("/section/unknown");
    render(
      <NavTabs
        tabs={tabs}
        activeClassName={activeClassName}
        inactiveClassName={inactiveClassName}
      />
    );

    screen.getAllByRole("link").forEach((link) => {
      expect(link.className).not.toContain("border-b-2");
    });
  });

  it("applies the className prop to the nav element", () => {
    mockUsePathname.mockReturnValue("/section/alpha");
    const { container } = render(
      <NavTabs
        tabs={tabs}
        className="custom-nav-class"
        activeClassName={activeClassName}
        inactiveClassName={inactiveClassName}
      />
    );

    expect(container.querySelector("nav")?.className).toContain("custom-nav-class");
  });
});
