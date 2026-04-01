import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CharacterCard } from "./CharacterCard";
import { mockCharacterListItem } from "@/test/fixtures";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- intentional plain <img> in mock, next/image not needed in tests
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe("CharacterCard", () => {
  it("renders name and system", () => {
    render(<CharacterCard {...mockCharacterListItem} />);
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    // 'D&D 5e' appears twice: once as the system label, once as a tag
    expect(screen.getAllByText("D&D 5e")).toHaveLength(2);
  });

  it("renders tags", () => {
    render(<CharacterCard {...mockCharacterListItem} />);
    expect(screen.getByText("mage")).toBeInTheDocument();
    expect(screen.getByText("retired")).toBeInTheDocument();
  });

  it("links to the character page", () => {
    render(<CharacterCard {...mockCharacterListItem} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/characters/mira-ashveil",
    );
  });
});
